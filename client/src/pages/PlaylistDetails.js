import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaPlay, FaPause, FaTrash, FaMusic, FaArrowLeft } from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';
import SongList from '../components/songs/SongList';
import { CURATED_PLAYLISTS, FALLBACK_TRACKS } from '../services/musicApiService';

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  align-self: flex-start;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const HeaderBanner = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2.5rem;
  background: linear-gradient(180deg, rgba(40, 40, 60, 0.7) 0%, rgba(20, 20, 30, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2.5rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.75rem;
    gap: 1.5rem;
  }
`;

const CoverImage = styled.div`
  width: 220px;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.55);
  flex-shrink: 0;
  background-color: #1a1a24;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 160px;
    height: 160px;
  }
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  span.badge {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--primary-color);
  }

  h1.title {
    font-size: 2.8rem;
    font-weight: 900;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.02em;
    line-height: 1.15;

    @media (max-width: 768px) {
      font-size: 1.85rem;
    }
  }

  p.desc {
    color: var(--text-secondary);
    font-size: 14.5px;
    margin: 0;
    line-height: 1.5;
    max-width: 600px;
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 600;
    margin-top: 4px;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 14px;
`;

const PlayAllBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--primary-color);
  color: #000000;
  padding: 12px 28px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 14.5px;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(29, 185, 84, 0.35);
  transition: all 0.2s ease;

  &:hover {
    background: #24e569;
    transform: scale(1.05);
  }
`;

const DeleteBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 59, 48, 0.15);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.3);
  padding: 10px 18px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ff3b30;
    color: #ffffff;
  }
`;

const EmptyStateCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 3.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 44px;
    color: var(--text-muted);
  }

  h3 {
    font-size: 1.35rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
  }

  p {
    color: var(--text-secondary);
    font-size: 14.5px;
    max-width: 440px;
    margin: 0;
  }

  button {
    background: var(--primary-color);
    color: #000000;
    font-weight: 800;
    border: none;
    padding: 10px 24px;
    border-radius: 30px;
    cursor: pointer;
    margin-top: 8px;
  }
`;

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400';

const PlaylistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userPlaylists = [], deletePlaylist, playList, isPlaying, currentSong, pauseSong } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. First check local userPlaylists
    const localMatch = userPlaylists.find(p => String(p._id || p.id) === String(id));
    if (localMatch) {
      setPlaylist(localMatch);
      setLoading(false);
      return;
    }

    // 2. Check curated playlists
    const curatedMatch = CURATED_PLAYLISTS.find(p => String(p._id || p.id) === String(id));
    if (curatedMatch) {
      // populate with relevant fallback songs if empty
      const songs = curatedMatch.songs && curatedMatch.songs.length > 0 
        ? curatedMatch.songs 
        : FALLBACK_TRACKS.slice(0, 15);
      setPlaylist({ ...curatedMatch, songs });
      setLoading(false);
      return;
    }

    // 3. Fall back to backend API
    const fetchRemote = async () => {
      try {
        const res = await axios.get(`/api/playlists/${id}`);
        const data = res.data?.data || res.data;
        if (data) {
          setPlaylist(data);
        }
      } catch (err) {
        console.warn('Could not fetch playlist from backend:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRemote();
  }, [id, userPlaylists]);

  if (loading) {
    return (
      <Container>
        <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
          Loading playlist...
        </div>
      </Container>
    );
  }

  if (!playlist) {
    return (
      <Container>
        <BackButton onClick={() => navigate('/playlists')}>
          <FaArrowLeft /> Back to Playlists
        </BackButton>
        <EmptyStateCard>
          <FaMusic />
          <h3>Playlist Not Found</h3>
          <p>This playlist might have been deleted or does not exist.</p>
          <button onClick={() => navigate('/playlists')}>View All Playlists</button>
        </EmptyStateCard>
      </Container>
    );
  }

  const songs = playlist.songs || [];
  const isCustomPlaylist = String(playlist._id || playlist.id).startsWith('pl-user-');
  const isPlaylistPlaying = songs.length > 0 && songs.some(s => s._id === currentSong?._id) && isPlaying;

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    if (isPlaylistPlaying) {
      pauseSong();
    } else {
      playList(songs, 0);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      deletePlaylist(playlist._id || playlist.id);
      navigate('/playlists');
    }
  };

  return (
    <Container>
      <BackButton onClick={() => navigate('/playlists')}>
        <FaArrowLeft /> Back to Playlists
      </BackButton>

      <HeaderBanner>
        <CoverImage>
          <img 
            src={playlist.coverImage || DEFAULT_COVER} 
            alt={playlist.name} 
            onError={(e) => { e.target.src = DEFAULT_COVER; }}
          />
        </CoverImage>

        <Info>
          <span className="badge">PLAYLIST</span>
          <h1 className="title">{playlist.name}</h1>
          <p className="desc">{playlist.description || 'Curated music collection'}</p>
          <div className="meta-row">
            <span>{songs.length} {songs.length === 1 ? 'song' : 'songs'}</span>
            <span>•</span>
            <span>{playlist.followers || 'MUSICBOX Curated'}</span>
          </div>

          <ActionsRow>
            {songs.length > 0 && (
              <PlayAllBtn onClick={handlePlayAll}>
                {isPlaylistPlaying ? <FaPause /> : <FaPlay />}
                <span>{isPlaylistPlaying ? 'PAUSE ALL' : 'PLAY ALL'}</span>
              </PlayAllBtn>
            )}

            {isCustomPlaylist && (
              <DeleteBtn onClick={handleDelete} title="Delete this playlist">
                <FaTrash /> Delete
              </DeleteBtn>
            )}
          </ActionsRow>
        </Info>
      </HeaderBanner>

      {songs.length > 0 ? (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', color: '#ffffff' }}>
            Tracks ({songs.length})
          </h2>
          <SongList songs={songs} />
        </div>
      ) : (
        <EmptyStateCard>
          <FaMusic />
          <h3>This playlist is currently empty</h3>
          <p>Add songs to this playlist by clicking the "+" button on any track across MUSICBOX.</p>
          <button onClick={() => navigate('/')}>Explore Music Hits</button>
        </EmptyStateCard>
      )}
    </Container>
  );
};

export default PlaylistDetails; 