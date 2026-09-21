// Music API Controller - Full Indian Songs (JioSaavn 320kbps) & iTunes Fallback
const https = require('https');
const CryptoJS = require('crypto-js');

// Decrypt JioSaavn media_url (DES-ECB with key '38346591')
const decryptMediaUrl = (cipherText) => {
  if (!cipherText) return null;
  try {
    const key = CryptoJS.enc.Utf8.parse('38346591');
    const decrypted = CryptoJS.DES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(cipherText) },
      key,
      { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
    );
    const url = decrypted.toString(CryptoJS.enc.Utf8);
    if (!url) return null;
    // Upgrade to 320kbps for pristine studio audio quality
    return url.replace(/_96\.mp4$/, '_320.mp4').replace(/_160\.mp4$/, '_320.mp4');
  } catch (e) {
    return null;
  }
};

const searchJioSaavn = async (query, limit = 20, page = 1) => {
  try {
    const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=${limit}&p=${page}&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const results = data.results || [];

    return results.map(s => {
      const streamUrl = decryptMediaUrl(s.more_info?.encrypted_media_url);
      if (!streamUrl) return null;

      const artwork = (s.image || '')
        .replace('150x150', '500x500')
        .replace('50x50', '500x500');

      const durationSeconds = parseInt(s.more_info?.duration || 220, 10);
      const mins = Math.floor(durationSeconds / 60);
      const secs = durationSeconds % 60;
      const formattedDuration = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

      const cleanTitle = (s.title || '')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&');

      const cleanArtist = (s.more_info?.singers || s.subtitle || s.more_info?.music || 'Various Artists')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&');

      const cleanAlbum = (s.album || cleanTitle)
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&');

      return {
        _id: `saavn-${s.id}`,
        title: cleanTitle,
        artist: {
          _id: `artist-${s.more_info?.artistMap?.primary_artists?.[0]?.id || s.id}`,
          name: cleanArtist
        },
        album: {
          _id: `album-${s.album_id || s.id}`,
          title: cleanAlbum
        },
        coverImage: artwork || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
        audioUrl: streamUrl,
        audioFile: streamUrl,
        duration: formattedDuration,
        durationSeconds: durationSeconds,
        isFullSong: true,
        quality: '320kbps HQ Full Song',
        genre: s.language ? `${s.language.charAt(0).toUpperCase() + s.language.slice(1)} Hits` : 'Indian Cinema',
        year: s.year || '2024',
        likes: []
      };
    }).filter(Boolean);
  } catch (err) {
    console.error('JioSaavn search error:', err.message);
    return [];
  }
};

const fetchFromItunes = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => reject(err));
  });
};

const formatDuration = (millis) => {
  if (!millis) return '3:30';
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const normalizeItunesTrack = (track) => {
  const artwork = (track.artworkUrl100 || '')
    .replace('100x100bb.jpg', '600x600bb.jpg')
    .replace('100x100', '600x600');

  return {
    _id: `itunes-${track.trackId}`,
    title: track.trackName,
    artist: {
      _id: `artist-${track.artistId || 1}`,
      name: track.artistName
    },
    album: {
      _id: `album-${track.collectionId || 1}`,
      title: track.collectionName
    },
    coverImage: artwork || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
    audioUrl: track.previewUrl,
    audioFile: track.previewUrl,
    duration: formatDuration(track.trackTimeMillis),
    isFullSong: false,
    quality: 'AAC Preview',
    genre: track.primaryGenreName || 'Pop',
    likes: []
  };
};

// @desc Search songs from Free Music API (prioritizes Full Indian songs, falls back to iTunes)
// @route GET /api/music-api/search?q=query&limit=25&page=1
exports.searchSongs = async (req, res, next) => {
  try {
    const query = req.query.q || 'top hits';
    const limit = parseInt(req.query.limit, 10) || 24;
    const page = parseInt(req.query.page, 10) || 1;

    // Try JioSaavn first for full 3-5 minute songs
    const saavnTracks = await searchJioSaavn(query, limit, page);
    if (saavnTracks && saavnTracks.length > 0) {
      return res.status(200).json({
        success: true,
        page,
        count: saavnTracks.length,
        source: 'jiosaavn-full-songs',
        data: saavnTracks
      });
    }

    // Fall back to iTunes
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}&country=IN`;
    const result = await fetchFromItunes(url);
    const itunesTracks = (result.results || [])
      .filter(t => t.previewUrl)
      .map(normalizeItunesTrack);

    res.status(200).json({
      success: true,
      page,
      count: itunesTracks.length,
      source: 'itunes',
      data: itunesTracks
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get Regional Cinema Hits (Tollywood, Bollywood, Kollywood, Hollywood, Punjabi, Malayalam, Kannada, Bhojpuri, Bengali, K-Pop) - 100% Full Songs
// @route GET /api/music-api/indian?industry=tollywood|bollywood|kollywood|hollywood|punjabi|malayalam|kannada|bhojpuri|bengali|kpop&page=1
exports.getIndianSongs = async (req, res, next) => {
  try {
    const industry = (req.query.industry || 'tollywood').toLowerCase();
    const limit = parseInt(req.query.limit, 10) || 24;
    const page = parseInt(req.query.page, 10) || 1;

    let queries = ['Telugu Top Hits 2024', 'Pushpa 2 Devara Telugu'];
    if (industry === 'tollywood' || industry === 'telugu') {
      queries = ['Telugu Top Hits 2024', 'Devara Pushpa 2 Telugu', 'Devi Sri Prasad Telugu Hits', 'Tollywood Mass Hits', 'Telugu Melody Songs'];
    } else if (industry === 'bollywood' || industry === 'hindi') {
      queries = ['Bollywood Romantic Hits Arijit', 'Stree 2 Animal Hindi Hits', 'Pritam Hindi Top Hits', 'Bollywood Dance Songs', 'Hindi 2024 Hits'];
    } else if (industry === 'kollywood' || industry === 'tamil') {
      queries = ['Tamil Top Hits Anirudh', 'Leo Jailer Tamil Songs', 'AR Rahman Tamil Hits', 'Kollywood Kuthu Songs', 'Tamil Melodies'];
    } else if (industry === 'hollywood' || industry === 'english') {
      queries = ['Billboard Hot 100 English', 'The Weeknd Taylor Swift Pop', 'Bruno Mars Dua Lipa Hits', 'Hollywood Pop Hits 2024', 'Top Global English Songs'];
    } else if (industry === 'punjabi') {
      queries = ['Punjabi Top Hits 2024', 'Diljit Dosanjh AP Dhillon', 'Karan Aujla Punjabi Hits', 'Punjabi Pop Beats'];
    } else if (industry === 'malayalam' || industry === 'mollywood') {
      queries = ['Malayalam Top Hits 2024', 'Aavesham Manjummel Boys Malayalam', 'Mollywood Melody Songs'];
    } else if (industry === 'kannada' || industry === 'sandalwood') {
      queries = ['Kannada Top Hits', 'KGF Kantara Kannada Hits', 'Kannada Film Songs'];
    } else if (industry === 'bhojpuri') {
      queries = ['Bhojpuri Top Hits', 'Pawan Singh Khesari Lal', 'Bhojpuri Cinema Songs'];
    } else if (industry === 'bengali') {
      queries = ['Bengali Top Hits', 'Arijit Singh Bengali Songs', 'Bengali Cinema Hits'];
    } else if (industry === 'kpop' || industry === 'global') {
      queries = ['K-Pop Top Hits BTS NewJeans', 'BLACKPINK Stray Kids KPop', 'Global Pop Hits 2024'];
    }

    // Run parallel searches with page offset
    const searchPromises = queries.map(q => searchJioSaavn(q, Math.ceil(limit / queries.length) + 6, page));
    const resultSets = await Promise.all(searchPromises);

    // Merge and deduplicate by _id and title
    const seen = new Set();
    const combined = [];
    for (const set of resultSets) {
      for (const track of set) {
        const key = (track.title || '').toLowerCase().trim();
        if (!seen.has(track._id) && !seen.has(key)) {
          seen.add(track._id);
          seen.add(key);
          combined.push(track);
        }
      }
    }

    res.status(200).json({
      success: true,
      industry,
      page,
      count: combined.length,
      data: combined.slice(0, limit)
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get trending songs from Free Music API
// @route GET /api/music-api/trending?limit=20&page=1
exports.getTrending = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 24;
    const page = parseInt(req.query.page, 10) || 1;
    // Get full songs from top trending Indian hits
    const saavnTrending = await searchJioSaavn('Trending India 2024', limit, page);
    if (saavnTrending && saavnTrending.length >= 6) {
      return res.status(200).json({
        success: true,
        page,
        count: saavnTrending.length,
        source: 'jiosaavn-full-songs',
        data: saavnTrending
      });
    }

    const url = `https://itunes.apple.com/search?term=india+top+songs&entity=song&limit=${limit}&country=IN`;
    const result = await fetchFromItunes(url);
    const tracks = (result.results || [])
      .filter(t => t.previewUrl)
      .map(normalizeItunesTrack);

    res.status(200).json({
      success: true,
      page,
      count: tracks.length,
      data: tracks
    });
  } catch (err) {
    next(err);
  }
};
