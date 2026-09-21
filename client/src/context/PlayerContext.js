import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { API_BASE } from '../utils/apiUrl';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // Shuffle & Repeat State
  const [isShuffle, setIsShuffle] = useState(() => {
    try {
      return localStorage.getItem('musicbox_shuffle') === 'true';
    } catch {
      return false;
    }
  });

  const [repeatMode, setRepeatMode] = useState(() => {
    try {
      return localStorage.getItem('musicbox_repeat') || 'off'; // 'off' | 'all' | 'one'
    } catch {
      return 'off';
    }
  });

  // Liked Songs Management
  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      const cached = localStorage.getItem('musicbox_liked_songs');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // User Custom Playlists Management
  const [userPlaylists, setUserPlaylists] = useState(() => {
    try {
      const cached = localStorage.getItem('musicbox_user_playlists');
      return cached ? JSON.parse(cached) : [
        {
          _id: 'pl-my-favorites-default',
          id: 'pl-my-favorites-default',
          name: 'My Best Hits',
          description: 'Personal favorite collection',
          coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
          songs: []
        }
      ];
    } catch {
      return [];
    }
  });

  // Add to Playlist Modal State
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [songForPlaylist, setSongForPlaylist] = useState(null);

  const audioRef = useRef(null);
  const currentSongUrlRef = useRef('');
  const currentSongRef = useRef(null);
  const isPlayingRef = useRef(false);
  const queueRef = useRef([]);
  const queueIndexRef = useRef(0);
  const isShuffleRef = useRef(isShuffle);
  const repeatModeRef = useRef(repeatMode);

  // Keep refs in sync for event listeners
  currentSongRef.current = currentSong;
  isPlayingRef.current = isPlaying;
  queueRef.current = queue;
  queueIndexRef.current = queueIndex;
  isShuffleRef.current = isShuffle;
  repeatModeRef.current = repeatMode;

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => {
      const next = !prev;
      try { localStorage.setItem('musicbox_shuffle', String(next)); } catch {}
      return next;
    });
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      let next = 'off';
      if (prev === 'off') next = 'all';
      else if (prev === 'all') next = 'one';
      else next = 'off';
      try { localStorage.setItem('musicbox_repeat', next); } catch {}
      return next;
    });
  }, []);

  // Sync favorites with backend when user logs in
  useEffect(() => {
    if (!user) return;
    axios.get('/api/users/favorites')
      .then(res => {
        const remoteFavorites = res.data?.data;
        if (Array.isArray(remoteFavorites) && remoteFavorites.length > 0) {
          setLikedSongs(prev => {
            const map = new Map();
            // Put remote first, then merge local
            for (const s of remoteFavorites) {
              if (s && (s._id || s.id)) map.set(String(s._id || s.id), s);
            }
            for (const s of prev) {
              if (s && (s._id || s.id)) map.set(String(s._id || s.id), s);
            }
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('musicbox_liked_songs', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, [user]);

  // Sync playlists with backend when user logs in
  useEffect(() => {
    if (!user) return;
    axios.get('/api/playlists/my-playlists')
      .then(res => {
        const remote = res.data?.data || res.data;
        if (Array.isArray(remote) && remote.length > 0) {
          setUserPlaylists(prev => {
            const map = new Map();
            for (const p of prev) map.set(String(p._id || p.id), p);
            for (const p of remote) map.set(String(p._id || p.id), p);
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('musicbox_user_playlists', JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, [user]);

  // 1. Create a single persistent Audio instance on mount
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.85;
    audioRef.current = audio;

    const onLoadedMetadata = () => {
      // If audio duration is a full length (> 45s), use it.
      // If audio metadata reports 30s preview but the song metadata has full duration, retain full duration!
      if (audio.duration && audio.duration > 45) {
        setDuration(audio.duration);
      } else if (currentSongRef.current?.durationSeconds && currentSongRef.current.durationSeconds > 45) {
        setDuration(currentSongRef.current.durationSeconds);
      } else if (audio.duration) {
        setDuration(audio.duration);
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const onPlay = () => {
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onEnded = () => {
      if (repeatModeRef.current === 'one') {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
        setCurrentTime(0);
        return;
      }
      const q = queueRef.current;
      const idx = queueIndexRef.current;
      if (isShuffleRef.current && q.length > 1) {
        let nextIdx = Math.floor(Math.random() * q.length);
        if (nextIdx === idx) nextIdx = (idx + 1) % q.length;
        setQueueIndex(nextIdx);
        setCurrentSong(q[nextIdx]);
        return;
      }
      if (idx < q.length - 1) {
        setQueueIndex(idx + 1);
        setCurrentSong(q[idx + 1]);
      } else if (repeatModeRef.current === 'all' && q.length > 0) {
        setQueueIndex(0);
        setCurrentSong(q[0]);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // 2. Change track ONLY when currentSong changes
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    let fileSrc = currentSong.audioFile || currentSong.audioUrl || currentSong.url || '';
    if (!fileSrc) return;

    if (fileSrc.startsWith('http')) {
      // Direct remote URL
    } else if (fileSrc.startsWith('/uploads')) {
      // already path
    } else if (fileSrc.startsWith('uploads/')) {
      fileSrc = `/${fileSrc}`;
    } else {
      fileSrc = `/uploads/${fileSrc}`;
    }

    // Pre-initialize duration if available
    if (currentSong.durationSeconds) {
      setDuration(currentSong.durationSeconds);
    }

    // Only load if the track URL is actually different
    if (currentSongUrlRef.current !== fileSrc) {
      currentSongUrlRef.current = fileSrc;
      audioRef.current.src = fileSrc;
      audioRef.current.load();
      audioRef.current.play().catch(err => {
        console.warn('Audio play request interrupted or requires interaction:', err);
      });
      setIsPlaying(true);
    }
  }, [currentSong]);

  // 3. Play / Pause toggle without resetting audio
  useEffect(() => {
    if (!audioRef.current || !audioRef.current.src) return;

    if (isPlaying) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(err => {
          console.warn('Error playing audio:', err);
        });
      }
    } else {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // 4. Smooth volume change - completely independent from audio source or progress
  useEffect(() => {
    if (audioRef.current) {
      const clamped = Math.max(0, Math.min(1, volume));
      audioRef.current.volume = clamped;
    }
  }, [volume]);

  const setVolumeLevel = useCallback((newVol) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const playSong = useCallback(async (song, customQueue = null) => {
    if (!song) return;

    let resolvedSong = { ...song };

    // Auto-resolve full 320kbps stream if the track is an iTunes preview clip
    const isPreview = (
      !resolvedSong.isFullSong ||
      (resolvedSong.audioUrl && resolvedSong.audioUrl.includes('apple.com')) ||
      (resolvedSong.audioFile && resolvedSong.audioFile.includes('apple.com')) ||
      (resolvedSong.quality && resolvedSong.quality.includes('Preview'))
    );

    if (isPreview) {
      try {
        const queryTerm = `${resolvedSong.title} ${resolvedSong.artist?.name || resolvedSong.artistName || ''}`.trim();
        const res = await fetch(`${API_BASE}/api/music-api/search?q=${encodeURIComponent(queryTerm)}&limit=1`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0 && json.data[0].audioUrl) {
            const fullTrack = json.data[0];
            resolvedSong.audioUrl = fullTrack.audioUrl;
            resolvedSong.audioFile = fullTrack.audioFile || fullTrack.audioUrl;
            resolvedSong.duration = fullTrack.duration;
            resolvedSong.durationSeconds = fullTrack.durationSeconds;
            resolvedSong.isFullSong = true;
            resolvedSong.quality = '320kbps HQ Full Song';
          }
        }
      } catch (e) {
        console.warn('Auto stream resolution notice:', e);
      }
    }

    if (customQueue && Array.isArray(customQueue) && customQueue.length > 0) {
      setQueue(customQueue);
      const songId = resolvedSong._id || resolvedSong.id;
      const index = customQueue.findIndex(s => (s._id === songId || s.id === songId));
      setQueueIndex(index >= 0 ? index : 0);
    } else {
      setQueue([resolvedSong]);
      setQueueIndex(0);
    }

    setCurrentSong(resolvedSong);
    setIsPlaying(true);
  }, []);

  const pauseSong = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    setIsPlaying(prev => !prev);
  }, [currentSong]);

  const seekTo = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const addToQueue = useCallback((song) => {
    setQueue(prev => [...prev, song]);
  }, []);

  const playList = useCallback((songs, startIndex = 0) => {
    if (!songs || songs.length === 0) return;
    setQueue(songs);
    setQueueIndex(startIndex);
    setCurrentSong(songs[startIndex]);
    setIsPlaying(true);
  }, []);

  const playNext = useCallback(() => {
    const q = queueRef.current;
    const idx = queueIndexRef.current;
    if (!q || q.length === 0) return;

    if (repeatModeRef.current === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      setCurrentTime(0);
      return;
    }

    if (isShuffleRef.current && q.length > 1) {
      let nextIdx = Math.floor(Math.random() * q.length);
      if (nextIdx === idx) {
        nextIdx = (idx + 1) % q.length;
      }
      setQueueIndex(nextIdx);
      setCurrentSong(q[nextIdx]);
      return;
    }

    if (idx < q.length - 1) {
      setQueueIndex(idx + 1);
      setCurrentSong(q[idx + 1]);
    } else if (repeatModeRef.current === 'all') {
      setQueueIndex(0);
      setCurrentSong(q[0]);
    }
  }, []);

  const playPrevious = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const q = queueRef.current;
    const idx = queueIndexRef.current;
    if (isShuffleRef.current && q.length > 1) {
      let prevIdx = Math.floor(Math.random() * q.length);
      setQueueIndex(prevIdx);
      setCurrentSong(q[prevIdx]);
      return;
    }
    if (idx > 0) {
      setQueueIndex(idx - 1);
      setCurrentSong(q[idx - 1]);
    } else if (repeatModeRef.current === 'all' && q.length > 0) {
      setQueueIndex(q.length - 1);
      setCurrentSong(q[q.length - 1]);
    }
  }, []);

  // LIKED SONGS
  const isLiked = useCallback((songId) => {
    if (!songId) return false;
    const idStr = String(songId);
    return likedSongs.some(s => String(s._id || s.id) === idStr);
  }, [likedSongs]);

  const toggleLikeSong = useCallback((song) => {
    if (!song) return;
    const songId = String(song._id || song.id);

    setLikedSongs(prev => {
      const exists = prev.some(s => String(s._id || s.id) === songId);
      let updated;
      if (exists) {
        updated = prev.filter(s => String(s._id || s.id) !== songId);
      } else {
        // ensure full song fields
        const songObj = {
          _id: songId,
          id: songId,
          title: song.title || song.name || 'Unknown Track',
          artist: song.artist || { name: song.artistName || 'Unknown Artist' },
          artistName: song.artist?.name || song.artistName || 'Unknown Artist',
          album: song.album || { title: song.albumName || 'Single' },
          albumName: song.album?.title || song.albumName || 'Single',
          coverImage: song.coverImage || song.image,
          image: song.coverImage || song.image,
          audioUrl: song.audioUrl || song.audioFile || song.url,
          audioFile: song.audioUrl || song.audioFile || song.url,
          duration: song.duration || '3:30',
          durationSeconds: song.durationSeconds || 210,
          genre: song.genre || 'Music'
        };
        updated = [songObj, ...prev];
      }

      try {
        localStorage.setItem('musicbox_liked_songs', JSON.stringify(updated));
      } catch {}

      return updated;
    });

    // Background sync with backend
    axios.post('/api/users/favorites', { song }).catch(() => {
      axios.put(`/api/songs/${songId}/like`, { song }).catch(() => {});
    });
  }, []);

  // USER PLAYLISTS
  const createPlaylist = useCallback(({ name, description, coverImage }) => {
    const newPlaylist = {
      _id: `pl-user-${Date.now()}`,
      id: `pl-user-${Date.now()}`,
      name: name || 'My Playlist',
      description: description || 'Created by you',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
      songs: [],
      createdAt: new Date().toISOString()
    };

    setUserPlaylists(prev => {
      const updated = [newPlaylist, ...prev];
      try {
        localStorage.setItem('musicbox_user_playlists', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Sync to backend if logged in
    axios.post('/api/playlists', {
      name: newPlaylist.name,
      description: newPlaylist.description,
      coverImage: newPlaylist.coverImage
    }).catch(() => {});

    return newPlaylist;
  }, []);

  const addSongToPlaylist = useCallback((playlistId, song) => {
    if (!playlistId || !song) return;
    const targetSongId = String(song._id || song.id);

    setUserPlaylists(prev => {
      const updated = prev.map(pl => {
        if (String(pl._id || pl.id) === String(playlistId)) {
          const songExists = (pl.songs || []).some(s => String(s._id || s.id) === targetSongId);
          if (songExists) return pl;

          const songObj = {
            _id: targetSongId,
            id: targetSongId,
            title: song.title || song.name || 'Unknown Track',
            artist: song.artist || { name: song.artistName || 'Unknown Artist' },
            artistName: song.artist?.name || song.artistName || 'Unknown Artist',
            album: song.album || { title: song.albumName || 'Single' },
            albumName: song.album?.title || song.albumName || 'Single',
            coverImage: song.coverImage || song.image,
            image: song.coverImage || song.image,
            audioUrl: song.audioUrl || song.audioFile || song.url,
            audioFile: song.audioUrl || song.audioFile || song.url,
            duration: song.duration || '3:30',
            durationSeconds: song.durationSeconds || 210,
            genre: song.genre || 'Music'
          };

          return {
            ...pl,
            coverImage: pl.coverImage && !pl.coverImage.includes('unsplash') ? pl.coverImage : (songObj.coverImage || pl.coverImage),
            songs: [...(pl.songs || []), songObj]
          };
        }
        return pl;
      });

      try {
        localStorage.setItem('musicbox_user_playlists', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Background sync to backend
    axios.put(`/api/playlists/${playlistId}/songs`, { song }).catch(() => {});
  }, []);

  const removeSongFromPlaylist = useCallback((playlistId, songId) => {
    setUserPlaylists(prev => {
      const updated = prev.map(pl => {
        if (String(pl._id || pl.id) === String(playlistId)) {
          return {
            ...pl,
            songs: (pl.songs || []).filter(s => String(s._id || s.id) !== String(songId))
          };
        }
        return pl;
      });

      try {
        localStorage.setItem('musicbox_user_playlists', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    axios.delete(`/api/playlists/${playlistId}/songs/${songId}`).catch(() => {});
  }, []);

  const deletePlaylist = useCallback((playlistId) => {
    setUserPlaylists(prev => {
      const updated = prev.filter(pl => String(pl._id || pl.id) !== String(playlistId));
      try {
        localStorage.setItem('musicbox_user_playlists', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    axios.delete(`/api/playlists/${playlistId}`).catch(() => {});
  }, []);

  const openAddToPlaylist = useCallback((song) => {
    setSongForPlaylist(song);
    setIsAddToPlaylistOpen(true);
  }, []);

  const closeAddToPlaylist = useCallback(() => {
    setIsAddToPlaylistOpen(false);
    setSongForPlaylist(null);
  }, []);

  const value = {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    queue,
    queueIndex,
    playSong,
    pauseSong,
    togglePlay,
    setVolumeLevel,
    addToQueue,
    playList,
    seekTo,
    playNext,
    playPrevious,
    // SHUFFLE & REPEAT
    isShuffle,
    repeatMode,
    toggleShuffle,
    toggleRepeat,
    // LIKED SONGS
    likedSongs,
    isLiked,
    toggleLikeSong,
    // PLAYLISTS
    userPlaylists,
    createPlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    // MODAL
    isAddToPlaylistOpen,
    songForPlaylist,
    openAddToPlaylist,
    closeAddToPlaylist,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};