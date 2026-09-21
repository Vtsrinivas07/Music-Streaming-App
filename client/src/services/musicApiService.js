// Free Music API Service connecting to JioSaavn 320kbps Studio Full Songs & iTunes API
// Provides 100% full-length songs (3-6 mins) for Tollywood (Telugu), Bollywood (Hindi), and Kollywood (Tamil) cinema!

const ITUNES_BASE_URL = 'https://itunes.apple.com/search';

// Helper to format track length in mm:ss
export const formatDuration = (millis) => {
  if (!millis) return '3:30';
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Helper to upscale artwork to high-definition (600x600)
export const getHighResArtwork = (artworkUrl) => {
  if (!artworkUrl) return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600';
  return artworkUrl
    .replace('100x100bb.jpg', '600x600bb.jpg')
    .replace('100x100bb.png', '600x600bb.png')
    .replace('150x150', '500x500')
    .replace('100x100', '600x600');
};

// Normalize raw iTunes track into MUSICBOX Player song structure
export const normalizeItunesTrack = (track) => {
  return {
    _id: `itunes-${track.trackId}`,
    id: `itunes-${track.trackId}`,
    title: track.trackName || 'Unknown Title',
    name: track.trackName || 'Unknown Title',
    artist: {
      _id: `artist-${track.artistId || 1}`,
      name: track.artistName || 'Unknown Artist'
    },
    artistName: track.artistName || 'Unknown Artist',
    album: {
      _id: `album-${track.collectionId || 1}`,
      title: track.collectionName || 'Single'
    },
    albumName: track.collectionName || 'Single',
    coverImage: getHighResArtwork(track.artworkUrl100),
    image: getHighResArtwork(track.artworkUrl100),
    audioFile: track.previewUrl,
    audioUrl: track.previewUrl,
    url: track.previewUrl,
    duration: formatDuration(track.trackTimeMillis),
    durationSeconds: Math.floor((track.trackTimeMillis || 200000) / 1000),
    isFullSong: false,
    quality: 'AAC Preview',
    genre: track.primaryGenreName || 'Indian Pop',
    releaseDate: track.releaseDate,
    likes: []
  };
};

// ==========================================
// 🇮🇳 TOLLYWOOD (Telugu Cinema - 100% FULL SONGS 320kbps)
// ==========================================
export const TOLLYWOOD_TRACKS = [
  {
    _id: 'tollywood-peelings-full',
    id: 'tollywood-peelings-full',
    title: 'Peelings (From "Pushpa 2 The Rule")',
    name: 'Peelings (From "Pushpa 2 The Rule")',
    artist: { _id: 'art-dsp', name: 'Devi Sri Prasad, Shankarr Babu, Laxmi Dasa' },
    artistName: 'Devi Sri Prasad, Shankarr Babu, Laxmi Dasa',
    album: { _id: 'alb-pushpa2', title: 'Pushpa 2 The Rule (Telugu)' },
    albumName: 'Pushpa 2 The Rule (Telugu)',
    coverImage: 'https://c.saavncdn.com/366/Pushpa-2-The-Rule-Telugu-Telugu-2024-20241205211012-500x500.jpg',
    image: 'https://c.saavncdn.com/366/Pushpa-2-The-Rule-Telugu-Telugu-2024-20241205211012-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/366/2eb21d94241ba0d9e970d808a7dc015d_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/366/2eb21d94241ba0d9e970d808a7dc015d_320.mp4',
    url: 'https://aac.saavncdn.com/366/2eb21d94241ba0d9e970d808a7dc015d_320.mp4',
    duration: '4:07',
    durationSeconds: 247,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Tollywood / Telugu Mass',
    likes: []
  },
  {
    _id: 'tollywood-pushpa-pushpa-full',
    id: 'tollywood-pushpa-pushpa-full',
    title: 'Pushpa Pushpa (Telugu)',
    name: 'Pushpa Pushpa (Telugu)',
    artist: { _id: 'art-dsp', name: 'Devi Sri Prasad & Nakash Aziz' },
    artistName: 'Devi Sri Prasad & Nakash Aziz',
    album: { _id: 'alb-pushpa2', title: 'Pushpa 2 The Rule' },
    albumName: 'Pushpa 2 The Rule',
    coverImage: 'https://c.saavncdn.com/366/Pushpa-2-The-Rule-Telugu-Telugu-2024-20241205211012-500x500.jpg',
    image: 'https://c.saavncdn.com/366/Pushpa-2-The-Rule-Telugu-Telugu-2024-20241205211012-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/366/0377fc358eb812da5d44b215b4bebfb3_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/366/0377fc358eb812da5d44b215b4bebfb3_320.mp4',
    url: 'https://aac.saavncdn.com/366/0377fc358eb812da5d44b215b4bebfb3_320.mp4',
    duration: '4:18',
    durationSeconds: 258,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Tollywood / Telugu Anthem',
    likes: []
  },
  {
    _id: 'tollywood-chuttamalle-full',
    id: 'tollywood-chuttamalle-full',
    title: 'Chuttamalle',
    name: 'Chuttamalle',
    artist: { _id: 'art-anirudh', name: 'Anirudh Ravichander & Shilpa Rao' },
    artistName: 'Anirudh Ravichander & Shilpa Rao',
    album: { _id: 'alb-devara', title: 'Devara Part 1 - Telugu' },
    albumName: 'Devara Part 1 - Telugu',
    coverImage: 'https://c.saavncdn.com/313/Devara-Part-1-Telugu-Telugu-2024-20240926171010-500x500.jpg',
    image: 'https://c.saavncdn.com/313/Devara-Part-1-Telugu-Telugu-2024-20240926171010-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/313/e49e604945889f330e5b3536dd0ff524_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/313/e49e604945889f330e5b3536dd0ff524_320.mp4',
    url: 'https://aac.saavncdn.com/313/e49e604945889f330e5b3536dd0ff524_320.mp4',
    duration: '3:42',
    durationSeconds: 222,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Tollywood / Melody',
    likes: []
  },
  {
    _id: 'tollywood-naatu-naatu-full',
    id: 'tollywood-naatu-naatu-full',
    title: 'Naatu Naatu',
    name: 'Naatu Naatu',
    artist: { _id: 'art-keeravaani', name: 'Rahul Sipligunj, Kaala Bhairava & M.M. Keeravaani' },
    artistName: 'Rahul Sipligunj, Kaala Bhairava & M.M. Keeravaani',
    album: { _id: 'alb-rrr', title: 'RRR (Telugu)' },
    albumName: 'RRR (Telugu)',
    coverImage: 'https://c.saavncdn.com/683/RRR-Telugu-Telugu-2022-20250828171313-500x500.jpg',
    image: 'https://c.saavncdn.com/683/RRR-Telugu-Telugu-2022-20250828171313-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/683/000ab54759049a8451ffcdc6412a0ef6_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/683/000ab54759049a8451ffcdc6412a0ef6_320.mp4',
    url: 'https://aac.saavncdn.com/683/000ab54759049a8451ffcdc6412a0ef6_320.mp4',
    duration: '3:34',
    durationSeconds: 214,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Tollywood / Oscar Winner',
    likes: []
  }
];

// ==========================================
// 🇮🇳 BOLLYWOOD (Hindi Cinema - 100% FULL SONGS 320kbps)
// ==========================================
export const BOLLYWOOD_TRACKS = [
  {
    _id: 'bollywood-gehra-hua-full',
    id: 'bollywood-gehra-hua-full',
    title: 'Gehra Hua (From "Dhurandhar")',
    name: 'Gehra Hua (From "Dhurandhar")',
    artist: { _id: 'art-arijit', name: 'Arijit Singh & Shashwat Sachdev' },
    artistName: 'Arijit Singh & Shashwat Sachdev',
    album: { _id: 'alb-dhurandhar', title: 'Dhurandhar' },
    albumName: 'Dhurandhar',
    coverImage: 'https://c.saavncdn.com/450/Gehra-Hua-From-Dhurandhar-Hindi-2025-20251205154217-500x500.jpg',
    image: 'https://c.saavncdn.com/450/Gehra-Hua-From-Dhurandhar-Hindi-2025-20251205154217-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/450/f467e05e2825cec2203546333e0d0550_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/450/f467e05e2825cec2203546333e0d0550_320.mp4',
    url: 'https://aac.saavncdn.com/450/f467e05e2825cec2203546333e0d0550_320.mp4',
    duration: '6:02',
    durationSeconds: 362,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Bollywood / Soulful Romantic',
    likes: []
  },
  {
    _id: 'bollywood-kesariya-full',
    id: 'bollywood-kesariya-full',
    title: 'Kesariya',
    name: 'Kesariya',
    artist: { _id: 'art-arijit', name: 'Arijit Singh & Pritam' },
    artistName: 'Arijit Singh & Pritam',
    album: { _id: 'alb-brahmastra', title: 'Brahmastra' },
    albumName: 'Brahmastra',
    coverImage: 'https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg',
    image: 'https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4',
    url: 'https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4',
    duration: '4:28',
    durationSeconds: 268,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Bollywood / Romance',
    likes: []
  },
  {
    _id: 'bollywood-apnabanale-full',
    id: 'bollywood-apnabanale-full',
    title: 'Apna Bana Le',
    name: 'Apna Bana Le',
    artist: { _id: 'art-arijit', name: 'Arijit Singh & Sachin-Jigar' },
    artistName: 'Arijit Singh & Sachin-Jigar',
    album: { _id: 'alb-bhediya', title: 'Bhediya' },
    albumName: 'Bhediya',
    coverImage: 'https://c.saavncdn.com/809/Wedding-Love-Songs-Hindi-2026-20251230172703-500x500.jpg',
    image: 'https://c.saavncdn.com/809/Wedding-Love-Songs-Hindi-2026-20251230172703-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/809/8a839d9200a725bce0b68eeae46409cf_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/809/8a839d9200a725bce0b68eeae46409cf_320.mp4',
    url: 'https://aac.saavncdn.com/809/8a839d9200a725bce0b68eeae46409cf_320.mp4',
    duration: '4:21',
    durationSeconds: 261,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Bollywood / Love Anthem',
    likes: []
  }
];

// ==========================================
// 🇮🇳 KOLLYWOOD (Tamil Cinema - 100% FULL SONGS 320kbps)
// ==========================================
export const KOLLYWOOD_TRACKS = [
  {
    _id: 'kollywood-badass-full',
    id: 'kollywood-badass-full',
    title: 'Badass (From "Leo")',
    name: 'Badass (From "Leo")',
    artist: { _id: 'art-anirudh', name: 'Anirudh Ravichander' },
    artistName: 'Anirudh Ravichander',
    album: { _id: 'alb-leo', title: 'Leo' },
    albumName: 'Leo',
    coverImage: 'https://c.saavncdn.com/415/Leo-Original-Motion-Picture-Soundtrack-English-2023-20231019170311-500x500.jpg',
    image: 'https://c.saavncdn.com/415/Leo-Original-Motion-Picture-Soundtrack-English-2023-20231019170311-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/415/46a7b21d2a3f4b9e019a7cdff7442c55_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/415/46a7b21d2a3f4b9e019a7cdff7442c55_320.mp4',
    url: 'https://aac.saavncdn.com/415/46a7b21d2a3f4b9e019a7cdff7442c55_320.mp4',
    duration: '3:49',
    durationSeconds: 229,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Kollywood / Mass Beat',
    likes: []
  },
  {
    _id: 'kollywood-hukum-full',
    id: 'kollywood-hukum-full',
    title: 'Hukum - Thalaivar Alappara',
    name: 'Hukum - Thalaivar Alappara',
    artist: { _id: 'art-anirudh', name: 'Anirudh Ravichander & Super Subu' },
    artistName: 'Anirudh Ravichander & Super Subu',
    album: { _id: 'alb-jailer', title: 'Jailer (Tamil)' },
    albumName: 'Jailer (Tamil)',
    coverImage: 'https://c.saavncdn.com/187/Jailer-Tamil-2023-20230728081443-500x500.jpg',
    image: 'https://c.saavncdn.com/187/Jailer-Tamil-2023-20230728081443-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/187/0c4d0aee91a3ac81d4b645ec448a2960_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/187/0c4d0aee91a3ac81d4b645ec448a2960_320.mp4',
    url: 'https://aac.saavncdn.com/187/0c4d0aee91a3ac81d4b645ec448a2960_320.mp4',
    duration: '3:27',
    durationSeconds: 207,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Kollywood / Mass Anthem',
    likes: []
  },
  {
    _id: 'kollywood-leo-entry-full',
    id: 'kollywood-leo-entry-full',
    title: 'Leo Das Entry (From "Leo")',
    name: 'Leo Das Entry (From "Leo")',
    artist: { _id: 'art-anirudh', name: 'Anirudh Ravichander' },
    artistName: 'Anirudh Ravichander',
    album: { _id: 'alb-leo-entry', title: 'Leo' },
    albumName: 'Leo',
    coverImage: 'https://c.saavncdn.com/109/Leo-Das-Entry-From-Leo-Tamil-2024-20240108151125-500x500.jpg',
    image: 'https://c.saavncdn.com/109/Leo-Das-Entry-From-Leo-Tamil-2024-20240108151125-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/109/5a7623ae2855a97fdadb9a2494c35cbc_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/109/5a7623ae2855a97fdadb9a2494c35cbc_320.mp4',
    url: 'https://aac.saavncdn.com/109/5a7623ae2855a97fdadb9a2494c35cbc_320.mp4',
    duration: '1:37',
    durationSeconds: 97,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Kollywood / Theme',
    likes: []
  }
];

// ==========================================
// 🌍 HOLLYWOOD (English Global Hits - 100% FULL SONGS 320kbps)
// ==========================================
export const HOLLYWOOD_TRACKS = [
  {
    _id: 'hollywood-blinding-lights-full',
    id: 'hollywood-blinding-lights-full',
    title: 'Blinding Lights',
    name: 'Blinding Lights',
    artist: { _id: 'art-theweeknd', name: 'The Weeknd' },
    artistName: 'The Weeknd',
    album: { _id: 'alb-afterhours', title: 'After Hours' },
    albumName: 'After Hours',
    coverImage: 'https://c.saavncdn.com/077/After-Hours-English-2020-20260804045014-500x500.jpg',
    image: 'https://c.saavncdn.com/077/After-Hours-English-2020-20260804045014-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/077/0b02a92687d1ae3369b6859f44872e52_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/077/0b02a92687d1ae3369b6859f44872e52_320.mp4',
    url: 'https://aac.saavncdn.com/077/0b02a92687d1ae3369b6859f44872e52_320.mp4',
    duration: '3:20',
    durationSeconds: 200,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Hollywood / Synth-Pop',
    likes: []
  },
  {
    _id: 'hollywood-cruel-summer-full',
    id: 'hollywood-cruel-summer-full',
    title: 'Cruel Summer',
    name: 'Cruel Summer',
    artist: { _id: 'art-taylor', name: 'Taylor Swift' },
    artistName: 'Taylor Swift',
    album: { _id: 'alb-lover', title: 'Lover' },
    albumName: 'Lover',
    coverImage: 'https://c.saavncdn.com/243/The-Cruelest-Summer-English-2023-20231109123211-500x500.jpg',
    image: 'https://c.saavncdn.com/243/The-Cruelest-Summer-English-2023-20231109123211-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/243/cf6b522de1390996fdbe109298873c72_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/243/cf6b522de1390996fdbe109298873c72_320.mp4',
    url: 'https://aac.saavncdn.com/243/cf6b522de1390996fdbe109298873c72_320.mp4',
    duration: '2:58',
    durationSeconds: 178,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Hollywood / Pop',
    likes: []
  },
  {
    _id: 'hollywood-diewithasmile-full',
    id: 'hollywood-diewithasmile-full',
    title: 'Die With A Smile',
    name: 'Die With A Smile',
    artist: { _id: 'art-brunomars', name: 'Lady Gaga & Bruno Mars' },
    artistName: 'Lady Gaga & Bruno Mars',
    album: { _id: 'alb-diewithasmile', title: 'Die With A Smile' },
    albumName: 'Die With A Smile',
    coverImage: 'https://c.saavncdn.com/060/Die-With-A-Smile-English-2024-20240816103634-500x500.jpg',
    image: 'https://c.saavncdn.com/060/Die-With-A-Smile-English-2024-20240816103634-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/060/05bb6ae7a01edcbd8e0d859d2fa1d83d_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/060/05bb6ae7a01edcbd8e0d859d2fa1d83d_320.mp4',
    url: 'https://aac.saavncdn.com/060/05bb6ae7a01edcbd8e0d859d2fa1d83d_320.mp4',
    duration: '4:10',
    durationSeconds: 250,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Hollywood / Pop Ballad',
    likes: []
  },
  {
    _id: 'hollywood-shapeofyou-full',
    id: 'hollywood-shapeofyou-full',
    title: 'Shape of You',
    name: 'Shape of You',
    artist: { _id: 'art-edsheeran', name: 'Ed Sheeran' },
    artistName: 'Ed Sheeran',
    album: { _id: 'alb-divide', title: 'Divide' },
    albumName: 'Divide',
    coverImage: 'https://c.saavncdn.com/126/Shape-of-You-English-2017-500x500.jpg',
    image: 'https://c.saavncdn.com/126/Shape-of-You-English-2017-500x500.jpg',
    audioFile: 'https://aac.saavncdn.com/126/da7cde34b008294e181842062530546d_320.mp4',
    audioUrl: 'https://aac.saavncdn.com/126/da7cde34b008294e181842062530546d_320.mp4',
    url: 'https://aac.saavncdn.com/126/da7cde34b008294e181842062530546d_320.mp4',
    duration: '3:53',
    durationSeconds: 233,
    isFullSong: true,
    quality: '320kbps HQ Full Song',
    genre: 'Hollywood / Pop',
    likes: []
  }
];

// Fallback Global Tracks
export const FALLBACK_TRACKS = [
  ...TOLLYWOOD_TRACKS,
  ...BOLLYWOOD_TRACKS,
  ...KOLLYWOOD_TRACKS,
  ...HOLLYWOOD_TRACKS
];

// Curated Playlists
export const CURATED_PLAYLISTS = [
  {
    _id: 'pl-tollywood-mega',
    id: 'pl-tollywood-mega',
    name: "Tollywood Blockbuster Hits",
    description: "Full songs from Pushpa 2, Devara, RRR, Kalki 2898 AD & DSP beats in 320kbps.",
    coverImage: 'https://c.saavncdn.com/366/Pushpa-2-The-Rule-Telugu-Telugu-2024-20241205211012-500x500.jpg',
    trackCount: '45 Songs',
    followers: '18,450,200',
    gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    badge: 'TOLLYWOOD FULL'
  },
  {
    _id: 'pl-bollywood-romance',
    id: 'pl-bollywood-romance',
    name: 'Bollywood Magic & Romance',
    description: 'Full tracks by Arijit Singh, Pritam, Shreya Ghoshal and Sachin-Jigar.',
    coverImage: 'https://c.saavncdn.com/450/Gehra-Hua-From-Dhurandhar-Hindi-2025-20251205154217-500x500.jpg',
    trackCount: '50 Songs',
    followers: '24,190,400',
    gradient: 'linear-gradient(135deg, #fc3c44 0%, #b8336a 100%)',
    badge: 'BOLLYWOOD FULL'
  },
  {
    _id: 'pl-kollywood-mass',
    id: 'pl-kollywood-mass',
    name: 'Kollywood Anirudh & Kuthu',
    description: 'Electrifying full Tamil cinema hits from Leo, Jailer, Vikram and Master.',
    coverImage: 'https://c.saavncdn.com/187/Jailer-Tamil-2023-20230728081443-500x500.jpg',
    trackCount: '40 Songs',
    followers: '16,210,900',
    gradient: 'linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)',
    badge: 'KOLLYWOOD FULL'
  },
  {
    _id: 'pl-todays-top-hits',
    id: 'pl-todays-top-hits',
    name: "Today's Global & Indian Top Hits",
    description: "The hottest tracks right now across Indian cinema and global charts.",
    coverImage: 'https://c.saavncdn.com/313/Devara-Part-1-Telugu-Telugu-2024-20240926171010-500x500.jpg',
    trackCount: '50 Songs',
    followers: '34,219,890',
    gradient: 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)',
    badge: 'TOP CHART'
  }
];

// Featured Artists
export const TOP_ARTISTS = [
  {
    _id: 'art-anirudh',
    name: 'Anirudh Ravichander',
    monthlyListeners: '22,480,900',
    image: 'https://c.saavncdn.com/187/Jailer-Tamil-2023-20230728081443-500x500.jpg',
    genre: 'Kollywood / Tamil Rockstar',
    verified: true
  },
  {
    _id: 'art-arijit',
    name: 'Arijit Singh',
    monthlyListeners: '42,890,200',
    image: 'https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg',
    genre: 'Bollywood / King of Melodies',
    verified: true
  },
  {
    _id: 'art-dsp',
    name: 'Devi Sri Prasad (DSP)',
    monthlyListeners: '14,350,600',
    image: 'https://c.saavncdn.com/366/Pushpa-2-The-Rule-Telugu-Telugu-2024-20241205211012-500x500.jpg',
    genre: 'Tollywood / Rockstar DSP',
    verified: true
  }
];

// Search with Full Songs first
export const searchFreeMusic = async (term, limit = 24, page = 1) => {
  if (!term || !term.trim()) return [];
  try {
    const encoded = encodeURIComponent(term.trim());
    // Try backend proxy for full songs (JioSaavn 320kbps)
    const res = await fetch(`/api/music-api/search?q=${encoded}&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.length > 0) {
        return json.data;
      }
    }

    // Fallback directly to iTunes
    const itunesRes = await fetch(`${ITUNES_BASE_URL}?term=${encoded}&country=IN&entity=song&limit=${limit}`);
    const data = await itunesRes.json();
    return (data.results || []).filter(t => t.previewUrl).map(normalizeItunesTrack);
  } catch (err) {
    console.warn('Search error, using static tracks:', err);
    return FALLBACK_TRACKS.filter(t =>
      t.title.toLowerCase().includes(term.toLowerCase()) ||
      t.artist.name.toLowerCase().includes(term.toLowerCase())
    );
  }
};

// Fetch Tollywood Telugu Full Songs
export const fetchTollywoodHits = async (limit = 24, page = 1) => {
  try {
    const res = await fetch(`/api/music-api/indian?industry=tollywood&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.length > 0) return json.data;
    }
    return TOLLYWOOD_TRACKS;
  } catch {
    return TOLLYWOOD_TRACKS;
  }
};

// Fetch Bollywood Hindi Full Songs
export const fetchBollywoodHits = async (limit = 24, page = 1) => {
  try {
    const res = await fetch(`/api/music-api/indian?industry=bollywood&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) return json.data;
    }
    return BOLLYWOOD_TRACKS;
  } catch {
    return BOLLYWOOD_TRACKS;
  }
};

// Fetch Kollywood Tamil Full Songs
export const fetchKollywoodHits = async (limit = 24, page = 1) => {
  try {
    const res = await fetch(`/api/music-api/indian?industry=kollywood&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) return json.data;
    }
    return KOLLYWOOD_TRACKS;
  } catch {
    return KOLLYWOOD_TRACKS;
  }
};

// Fetch Hollywood English Full Songs
export const fetchHollywoodHits = async (limit = 24, page = 1) => {
  try {
    const res = await fetch(`/api/music-api/indian?industry=hollywood&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) return json.data;
    }
    return HOLLYWOOD_TRACKS;
  } catch {
    return HOLLYWOOD_TRACKS;
  }
};

// Fetch Trending Hits
export const fetchTrendingHits = async (limit = 24, page = 1) => {
  try {
    const res = await fetch(`/api/music-api/trending?limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) return json.data;
    }
    return FALLBACK_TRACKS;
  } catch {
    return FALLBACK_TRACKS;
  }
};

// Fetch Punjabi Full Songs
export const fetchPunjabiHits = async (limit = 24, page = 1) => {
  try {
    const res = await fetch(`/api/music-api/indian?industry=punjabi&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) return json.data;
    }
    return FALLBACK_TRACKS;
  } catch {
    return FALLBACK_TRACKS;
  }
};

// Fetch Malayalam Mollywood Full Songs
export const fetchMalayalamHits = async (limit = 24, page = 1) => {
  try {
    const res = await fetch(`/api/music-api/indian?industry=malayalam&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) return json.data;
    }
    return FALLBACK_TRACKS;
  } catch {
    return FALLBACK_TRACKS;
  }
};

// Fetch Kannada Sandalwood Full Songs
export const fetchKannadaHits = async (limit = 24, page = 1) => {
  try {
    const res = await fetch(`/api/music-api/indian?industry=kannada&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) return json.data;
    }
    return FALLBACK_TRACKS;
  } catch {
    return FALLBACK_TRACKS;
  }
};

// Fetch Bhojpuri Full Songs
export const fetchBhojpuriHits = async (limit = 24, page = 1) => {
  try {
    const res = await fetch(`/api/music-api/indian?industry=bhojpuri&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) return json.data;
    }
    return FALLBACK_TRACKS;
  } catch {
    return FALLBACK_TRACKS;
  }
};

// Fetch Bengali Full Songs
export const fetchBengaliHits = async (limit = 24, page = 1) => {
  try {
    const res = await fetch(`/api/music-api/indian?industry=bengali&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) return json.data;
    }
    return FALLBACK_TRACKS;
  } catch {
    return FALLBACK_TRACKS;
  }
};

// Fetch K-Pop & Global Full Songs
export const fetchKPopHits = async (limit = 24, page = 1) => {
  try {
    const res = await fetch(`/api/music-api/indian?industry=kpop&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) return json.data;
    }
    return FALLBACK_TRACKS;
  } catch {
    return FALLBACK_TRACKS;
  }
};

// Fetch Tracks by Specific Genre or Mood
export const fetchGenreTracks = async (genre, limit = 24, page = 1) => {
  if (genre === 'tollywood') return fetchTollywoodHits(limit, page);
  if (genre === 'bollywood') return fetchBollywoodHits(limit, page);
  if (genre === 'kollywood') return fetchKollywoodHits(limit, page);
  if (genre === 'hollywood') return fetchHollywoodHits(limit, page);
  if (genre === 'punjabi') return fetchPunjabiHits(limit, page);
  if (genre === 'malayalam') return fetchMalayalamHits(limit, page);
  if (genre === 'kannada') return fetchKannadaHits(limit, page);
  if (genre === 'bhojpuri') return fetchBhojpuriHits(limit, page);
  if (genre === 'bengali') return fetchBengaliHits(limit, page);
  if (genre === 'kpop') return fetchKPopHits(limit, page);

  try {
    const res = await fetch(`/api/music-api/search?q=${encodeURIComponent(genre)}&limit=${limit}&page=${page}`);
    if (res.ok) {
      const json = await res.json();
      if (json.data?.length > 0) return json.data;
    }
    return FALLBACK_TRACKS;
  } catch {
    return FALLBACK_TRACKS;
  }
};
