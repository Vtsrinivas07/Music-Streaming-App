import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FaPlay, 
  FaPause, 
  FaSearch, 
  FaFire, 
  FaMusic, 
  FaCheckCircle,
  FaCompactDisc,
  FaHeadphones,
  FaFilm,
  FaGlobe,
  FaTimes,
  FaHeart,
  FaRegHeart,
  FaPlus,
  FaBolt,
  FaSyncAlt,
  FaLayerGroup
} from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext';
import { 
  searchFreeMusic, 
  fetchTrendingHits, 
  fetchGenreTracks, 
  fetchTollywoodHits,
  fetchBollywoodHits,
  fetchKollywoodHits,
  fetchHollywoodHits,
  fetchPunjabiHits,
  fetchMalayalamHits,
  fetchKannadaHits,
  fetchBhojpuriHits,
  fetchKPopHits,
  CURATED_PLAYLISTS, 
  TOP_ARTISTS,
  TOLLYWOOD_TRACKS,
  BOLLYWOOD_TRACKS,
  KOLLYWOOD_TRACKS,
  HOLLYWOOD_TRACKS,
  FALLBACK_TRACKS 
} from '../services/musicApiService';

// Components
import SongList from '../components/songs/SongList';
import PlaylistGrid from '../components/playlists/PlaylistGrid';
import ArtistGrid from '../components/artists/ArtistGrid';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

// Modern Search & Header Area
const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 50px;
  padding: 10px 18px;
  width: 100%;
  max-width: 480px;
  transition: all 0.2s ease;
  position: relative;

  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(29, 185, 84, 0.25);
    background: rgba(255, 255, 255, 0.1);
  }

  svg.search-icon {
    color: var(--text-muted);
    font-size: 16px;
    margin-right: 12px;
  }

  input {
    background: transparent;
    border: none;
    color: #ffffff;
    font-size: 14px;
    width: 100%;
    outline: none;
    &::placeholder {
      color: var(--text-muted);
    }
  }

  button.clear-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 14px;
    padding: 0 4px;
    display: flex;
    align-items: center;
    &:hover {
      color: #ffffff;
    }
  }
`;

// Pill Filters
const PillFilters = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  width: 100%;

  &::-webkit-scrollbar {
    height: 4px;
  }
`;

const Pill = styled.button`
  padding: 9px 20px;
  border-radius: 30px;
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.active ? 'linear-gradient(135deg, #1db954 0%, #169b45 100%)' : 'rgba(255, 255, 255, 0.07)'};
  color: ${props => props.active ? '#000000' : 'var(--text-secondary)'};
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.08)'};
  box-shadow: ${props => props.active ? '0 4px 15px rgba(29, 185, 84, 0.35)' : 'none'};
  cursor: pointer;

  &:hover {
    color: #ffffff;
    background: ${props => props.active ? 'linear-gradient(135deg, #1db954 0%, #169b45 100%)' : 'rgba(255, 255, 255, 0.12)'};
    transform: translateY(-2px);
  }
`;

// Hero Banner (Apple Music / Spotify style)
const HeroBanner = styled.div`
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #f12711 0%, #b8336a 45%, #2a0845 100%);
  padding: 2.75rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  box-shadow: 0 20px 50px rgba(241, 39, 17, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  z-index: 1;
  max-width: 650px;

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: #ffffff;
    width: fit-content;
    text-transform: uppercase;
  }

  .hero-title {
    font-size: 2.75rem;
    font-weight: 900;
    color: #ffffff;
    line-height: 1.12;
    margin: 0;
    letter-spacing: -0.03em;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);

    @media (max-width: 768px) {
      font-size: 1.85rem;
    }
  }

  .hero-artist {
    font-size: 1.15rem;
    color: rgba(255, 255, 255, 0.88);
    font-weight: 500;
  }

  .hero-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 0.5rem;
  }
`;

const HeroCoverWrapper = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  flex-shrink: 0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.55);
  border: 2px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 900px) {
    display: none;
  }

  img.hero-artwork {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlayNowBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #000000;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;

  &:hover {
    transform: scale(1.05);
    background: #f0f0f0;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
  }
`;

const NextHitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: #ffffff;
  padding: 14px 22px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

// 80M+ Catalog Explorer Hub
const CatalogBanner = styled.div`
  background: linear-gradient(135deg, rgba(29, 185, 84, 0.12) 0%, rgba(0, 114, 255, 0.1) 40%, rgba(241, 39, 17, 0.12) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(14px);

  .banner-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .catalog-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(29, 185, 84, 0.18);
    border: 1px solid rgba(29, 185, 84, 0.4);
    color: #24e569;
    font-size: 12px;
    font-weight: 800;
    padding: 5px 14px;
    border-radius: 30px;
    letter-spacing: 0.05em;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #24e569;
    box-shadow: 0 0 10px #24e569;
    animation: pulse 1.8s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
  }

  h2 {
    font-size: 1.6rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.02em;
  }

  p {
    color: var(--text-secondary);
    font-size: 14px;
    margin: 0;
    max-width: 850px;
    line-height: 1.5;
  }
`;

const SuggestionChips = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 4px;

  span.label {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--text-muted);
  }

  button.chip {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #ffffff;
    font-size: 12.5px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--primary-color);
      color: #000000;
      border-color: transparent;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(29, 185, 84, 0.35);
    }
  }
`;

const IndustryCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 14px;
  margin-top: 4px;
`;

const IndustryCard = styled.div`
  background: ${props => props.gradient || 'rgba(255, 255, 255, 0.05)'};
  border-radius: 14px;
  padding: 16px 18px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 90px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
    border-color: rgba(255, 255, 255, 0.2);
  }

  h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.01em;
  }

  span.count {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.85);
    font-weight: 600;
    margin-top: 6px;
  }
`;

const LoadMoreBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 1.5rem auto 0 auto;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  padding: 12px 32px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-color);
    color: #000000;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(29, 185, 84, 0.35);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Section Layouts
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h2`
  font-size: 1.45rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionAction = styled(Link)`
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    text-decoration: underline;
  }
`;

// Trending Cards Grid
const TrackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
  gap: 20px;
`;

const TrackCard = styled.div`
  background: rgba(22, 22, 32, 0.65);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(36, 36, 52, 0.85);
    transform: translateY(-6px);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
    border-color: rgba(255, 255, 255, 0.15);

    .card-play-btn {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CardCoverWrapper = styled.div`
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
  background-color: #1e1e28;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${TrackCard}:hover & img {
    transform: scale(1.05);
  }
`;

const CardPlayButton = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary-color);
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.25s ease;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  z-index: 2;

  &:hover {
    transform: scale(1.1) translateY(0);
    background: #24e569;
  }

  svg {
    font-size: 15px;
    margin-left: 2px;
  }
`;

const CardActions = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 4;
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.25s ease;

  ${TrackCard}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.15);
      background: rgba(0, 0, 0, 0.9);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &.liked {
      color: #fc3c44;
    }
  }
`;

const TrackTitle = styled.h4`
  font-size: 14.5px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.p`
  font-size: 12.5px;
  color: var(--text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GenreBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 9px;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  color: #ffffff;
  padding: 3px 7px;
  border-radius: 6px;
  z-index: 2;
`;

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400';

const Home = () => {
  const [selectedPill, setSelectedPill] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [displayTracks, setDisplayTracks] = useState(FALLBACK_TRACKS);
  const [tollywoodTracks, setTollywoodTracks] = useState(TOLLYWOOD_TRACKS);
  const [bollywoodTracks, setBollywoodTracks] = useState(BOLLYWOOD_TRACKS);
  const [kollywoodTracks, setKollywoodTracks] = useState(KOLLYWOOD_TRACKS);
  const [hollywoodTracks, setHollywoodTracks] = useState(HOLLYWOOD_TRACKS);
  const [punjabiTracks, setPunjabiTracks] = useState([]);
  const [chartTracks, setChartTracks] = useState(TOLLYWOOD_TRACKS.concat(HOLLYWOOD_TRACKS.slice(0, 3)));
  const [heroTrack, setHeroTrack] = useState(TOLLYWOOD_TRACKS[0]);
  const [playlists] = useState(CURATED_PLAYLISTS);
  const [artists] = useState(TOP_ARTISTS);

  // Pagination states
  const [searchPage, setSearchPage] = useState(1);
  const [tollywoodPage, setTollywoodPage] = useState(1);
  const [bollywoodPage, setBollywoodPage] = useState(1);
  const [kollywoodPage, setKollywoodPage] = useState(1);
  const [hollywoodPage, setHollywoodPage] = useState(1);
  const [punjabiPage, setPunjabiPage] = useState(1);
  const [displayPage, setDisplayPage] = useState(1);
  const [loadingSection, setLoadingSection] = useState(null);

  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    pauseSong, 
    isLiked, 
    toggleLikeSong, 
    openAddToPlaylist 
  } = usePlayer();

  // Load deep catalog across all Indian & Global industries
  useEffect(() => {
    const loadContent = async () => {
      try {
        const [teluguHits, hindiHits, tamilHits, englishHits, trendingHits, punjabiHits] = await Promise.all([
          fetchTollywoodHits(24, 1),
          fetchBollywoodHits(24, 1),
          fetchKollywoodHits(24, 1),
          fetchHollywoodHits(24, 1),
          fetchTrendingHits(24, 1),
          fetchPunjabiHits(20, 1)
        ]);

        if (teluguHits && teluguHits.length > 0) {
          setTollywoodTracks(teluguHits);
          const pushpaHit = teluguHits.find(t => 
            t.title?.toLowerCase().includes('pushpa') || 
            t.title?.toLowerCase().includes('peelings')
          ) || TOLLYWOOD_TRACKS[0];
          setHeroTrack(pushpaHit);
        }
        if (hindiHits && hindiHits.length > 0) {
          setBollywoodTracks(hindiHits);
        }
        if (tamilHits && tamilHits.length > 0) {
          setKollywoodTracks(tamilHits);
        }
        if (englishHits && englishHits.length > 0) {
          setHollywoodTracks(englishHits);
        }
        if (punjabiHits && punjabiHits.length > 0) {
          setPunjabiTracks(punjabiHits);
        }
        if (trendingHits && trendingHits.length > 0) {
          setDisplayTracks(trendingHits);
          setChartTracks(trendingHits.slice(0, 8));
        }
      } catch (e) {
        console.warn('Using pre-cached regional tracks:', e);
      }
    };
    loadContent();
  }, []);

  // Live search across 80M+ songs
  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setSearchPage(1);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const results = await searchFreeMusic(q, 24, 1);
    setSearchResults(results || []);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchPage(1);
  };

  const handleQuickSearch = async (term) => {
    setSearchQuery(term);
    setSearchPage(1);
    const results = await searchFreeMusic(term, 24, 1);
    setSearchResults(results || []);
  };

  // Regional Cinema & Industry filter
  const handlePillClick = async (genreKey) => {
    setSelectedPill(genreKey);
    setSearchQuery('');
    setSearchResults([]);
    setDisplayPage(1);

    if (genreKey === 'all') {
      const hits = await fetchTrendingHits(24, 1);
      setDisplayTracks(hits);
    } else if (genreKey === 'tollywood') {
      const telugu = await fetchTollywoodHits(24, 1);
      setDisplayTracks(telugu);
      const pushpaHit = telugu.find(t => 
        t.title?.toLowerCase().includes('pushpa') || 
        t.title?.toLowerCase().includes('peelings')
      ) || TOLLYWOOD_TRACKS[0];
      setHeroTrack(pushpaHit);
    } else if (genreKey === 'bollywood') {
      const hindi = await fetchBollywoodHits(24, 1);
      setDisplayTracks(hindi);
      if (hindi.length > 0) setHeroTrack(hindi[0]);
    } else if (genreKey === 'kollywood') {
      const tamil = await fetchKollywoodHits(24, 1);
      setDisplayTracks(tamil);
      if (tamil.length > 0) setHeroTrack(tamil[0]);
    } else if (genreKey === 'hollywood') {
      const english = await fetchHollywoodHits(24, 1);
      setDisplayTracks(english);
      if (english.length > 0) setHeroTrack(english[0]);
    } else if (genreKey === 'punjabi') {
      const punjabi = await fetchPunjabiHits(24, 1);
      setDisplayTracks(punjabi);
      if (punjabi.length > 0) setHeroTrack(punjabi[0]);
    } else if (genreKey === 'malayalam') {
      const malayalam = await fetchMalayalamHits(24, 1);
      setDisplayTracks(malayalam);
      if (malayalam.length > 0) setHeroTrack(malayalam[0]);
    } else if (genreKey === 'kannada') {
      const kannada = await fetchKannadaHits(24, 1);
      setDisplayTracks(kannada);
      if (kannada.length > 0) setHeroTrack(kannada[0]);
    } else if (genreKey === 'bhojpuri') {
      const bhojpuri = await fetchBhojpuriHits(24, 1);
      setDisplayTracks(bhojpuri);
      if (bhojpuri.length > 0) setHeroTrack(bhojpuri[0]);
    } else if (genreKey === 'kpop') {
      const kpop = await fetchKPopHits(24, 1);
      setDisplayTracks(kpop);
      if (kpop.length > 0) setHeroTrack(kpop[0]);
    } else {
      const filtered = await fetchGenreTracks(genreKey, 24, 1);
      setDisplayTracks(filtered);
    }
  };

  // Pagination "Load More" handlers
  const handleLoadMoreSearch = async () => {
    if (!searchQuery.trim() || loadingSection) return;
    setLoadingSection('search');
    const nextPage = searchPage + 1;
    const more = await searchFreeMusic(searchQuery, 24, nextPage);
    if (more && more.length > 0) {
      setSearchResults(prev => [...prev, ...more]);
      setSearchPage(nextPage);
    }
    setLoadingSection(null);
  };

  const handleLoadMoreTollywood = async () => {
    if (loadingSection) return;
    setLoadingSection('tollywood');
    const nextPage = tollywoodPage + 1;
    const more = await fetchTollywoodHits(24, nextPage);
    if (more && more.length > 0) {
      setTollywoodTracks(prev => [...prev, ...more]);
      setTollywoodPage(nextPage);
    }
    setLoadingSection(null);
  };

  const handleLoadMoreBollywood = async () => {
    if (loadingSection) return;
    setLoadingSection('bollywood');
    const nextPage = bollywoodPage + 1;
    const more = await fetchBollywoodHits(24, nextPage);
    if (more && more.length > 0) {
      setBollywoodTracks(prev => [...prev, ...more]);
      setBollywoodPage(nextPage);
    }
    setLoadingSection(null);
  };

  const handleLoadMoreKollywood = async () => {
    if (loadingSection) return;
    setLoadingSection('kollywood');
    const nextPage = kollywoodPage + 1;
    const more = await fetchKollywoodHits(24, nextPage);
    if (more && more.length > 0) {
      setKollywoodTracks(prev => [...prev, ...more]);
      setKollywoodPage(nextPage);
    }
    setLoadingSection(null);
  };

  const handleLoadMoreHollywood = async () => {
    if (loadingSection) return;
    setLoadingSection('hollywood');
    const nextPage = hollywoodPage + 1;
    const more = await fetchHollywoodHits(24, nextPage);
    if (more && more.length > 0) {
      setHollywoodTracks(prev => [...prev, ...more]);
      setHollywoodPage(nextPage);
    }
    setLoadingSection(null);
  };

  const handleLoadMorePunjabi = async () => {
    if (loadingSection) return;
    setLoadingSection('punjabi');
    const nextPage = punjabiPage + 1;
    const more = await fetchPunjabiHits(24, nextPage);
    if (more && more.length > 0) {
      setPunjabiTracks(prev => [...prev, ...more]);
      setPunjabiPage(nextPage);
    }
    setLoadingSection(null);
  };

  const handleLoadMoreDisplay = async () => {
    if (loadingSection) return;
    setLoadingSection('display');
    const nextPage = displayPage + 1;
    const more = await fetchGenreTracks(selectedPill, 24, nextPage);
    if (more && more.length > 0) {
      setDisplayTracks(prev => [...prev, ...more]);
      setDisplayPage(nextPage);
    }
    setLoadingSection(null);
  };

  const handleHeroPlay = () => {
    if (!heroTrack) return;
    if (currentSong?._id === heroTrack._id && isPlaying) {
      pauseSong();
    } else {
      playSong(heroTrack);
    }
  };

  const handleNextHeroTrack = () => {
    const hits = [
      TOLLYWOOD_TRACKS[0], // Peelings (Pushpa 2)
      TOLLYWOOD_TRACKS[1], // Pushpa Pushpa (Pushpa 2)
      BOLLYWOOD_TRACKS[0], // Gehra Hua
      KOLLYWOOD_TRACKS[0], // Badass (Leo)
      HOLLYWOOD_TRACKS[0], // Blinding Lights
      TOLLYWOOD_TRACKS[2], // Chuttamalle (Devara)
    ];
    const currIdx = hits.findIndex(h => (h._id === heroTrack?._id || h.title === heroTrack?.title));
    const nextIdx = (currIdx + 1) % hits.length;
    setHeroTrack(hits[nextIdx]);
  };

  const isHeroPlaying = currentSong?._id === heroTrack?._id && isPlaying;
  const isSearchActive = searchQuery.trim().length > 0;

  // Reusable Track Card with Like and Add-to-Playlist
  const renderTrackCard = (track, index) => {
    const trackId = track._id || track.id || `track-${index}`;
    const isThisPlaying = (currentSong?._id === track._id || currentSong?.id === track.id) && isPlaying;
    const isSongLiked = isLiked(track._id || track.id);

    return (
      <TrackCard 
        key={trackId}
        onClick={() => isThisPlaying ? pauseSong() : playSong(track)}
      >
        <CardCoverWrapper>
          {track.genre && <GenreBadge>{track.genre}</GenreBadge>}
          
          <CardActions onClick={(e) => e.stopPropagation()}>
            <button 
              className={isSongLiked ? 'liked' : ''}
              onClick={() => toggleLikeSong(track)}
              title={isSongLiked ? 'Remove from Liked Songs' : 'Like'}
            >
              {isSongLiked ? <FaHeart /> : <FaRegHeart />}
            </button>
            <button 
              onClick={() => openAddToPlaylist(track)}
              title="Add to playlist"
            >
              <FaPlus />
            </button>
          </CardActions>

          <img 
            src={track.coverImage || DEFAULT_COVER} 
            alt={track.title}
            onError={(e) => { e.target.src = DEFAULT_COVER; }}
          />
          <CardPlayButton className="card-play-btn">
            {isThisPlaying ? <FaPause /> : <FaPlay />}
          </CardPlayButton>
        </CardCoverWrapper>

        <TrackTitle title={track.title}>{track.title}</TrackTitle>
        <TrackArtist>{track.artist?.name || track.artistName || 'Unknown Artist'}</TrackArtist>
        {track.duration && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {track.duration}
          </div>
        )}
      </TrackCard>
    );
  };

  return (
    <HomeContainer>
      {/* Top Header & Live Search Bar */}
      <HeaderBar>
        <SearchInputWrapper>
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search 80M+ songs: Taylor Swift, Pushpa 2, Arijit, Devara, Anirudh..." 
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button className="clear-btn" onClick={handleClearSearch} title="Clear search">
              <FaTimes />
            </button>
          )}
        </SearchInputWrapper>

        <PillFilters>
          <Pill active={!isSearchActive && selectedPill === 'all'} onClick={() => handlePillClick('all')}>
            🔥 All Hits
          </Pill>
          <Pill active={!isSearchActive && selectedPill === 'tollywood'} onClick={() => handlePillClick('tollywood')}>
            🎬 Tollywood (Telugu)
          </Pill>
          <Pill active={!isSearchActive && selectedPill === 'bollywood'} onClick={() => handlePillClick('bollywood')}>
            🌟 Bollywood (Hindi)
          </Pill>
          <Pill active={!isSearchActive && selectedPill === 'kollywood'} onClick={() => handlePillClick('kollywood')}>
            🔥 Kollywood (Tamil)
          </Pill>
          <Pill active={!isSearchActive && selectedPill === 'hollywood'} onClick={() => handlePillClick('hollywood')}>
            🌍 Hollywood (English)
          </Pill>
          <Pill active={!isSearchActive && selectedPill === 'punjabi'} onClick={() => handlePillClick('punjabi')}>
            ⚡ Punjabi Beats
          </Pill>
          <Pill active={!isSearchActive && selectedPill === 'malayalam'} onClick={() => handlePillClick('malayalam')}>
            🌴 Malayalam
          </Pill>
          <Pill active={!isSearchActive && selectedPill === 'kannada'} onClick={() => handlePillClick('kannada')}>
            🦁 Kannada
          </Pill>
          <Pill active={!isSearchActive && selectedPill === 'bhojpuri'} onClick={() => handlePillClick('bhojpuri')}>
            💃 Bhojpuri
          </Pill>
          <Pill active={!isSearchActive && selectedPill === 'kpop'} onClick={() => handlePillClick('kpop')}>
            ✨ K-Pop
          </Pill>
        </PillFilters>
      </HeaderBar>

      {/* INSTANT SEARCH RESULTS - RIGHT BELOW THE SEARCH BAR WITHOUT ANY DELAY OR SCROLLING */}
      {isSearchActive ? (
        <Section style={{ marginTop: '0.5rem' }}>
          <SectionHeader>
            <SectionTitle>
              <FaSearch style={{ color: 'var(--primary-color)' }} />
              Search Results for "{searchQuery}" ({searchResults.length} songs found)
            </SectionTitle>
            <button 
              onClick={handleClearSearch}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              <FaTimes /> Clear Search
            </button>
          </SectionHeader>

          {/* Quick search tags right under search header for instant switching */}
          <SuggestionChips style={{ margin: '0 0 1rem 0' }}>
            <span className="label">Try Searching:</span>
            {['Taylor Swift', 'Pushpa 2', 'Arijit Singh', 'Devara', 'Anirudh', 'Diljit Dosanjh', 'The Weeknd', 'Leo', 'Illuminati', 'Billie Eilish', 'Coldplay', 'BTS', 'Bhojpuri Hits'].map(tag => (
              <button key={tag} className="chip" onClick={() => handleQuickSearch(tag)}>
                {tag}
              </button>
            ))}
          </SuggestionChips>

          {searchResults.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px' }}>
              <FaSyncAlt className="spin" style={{ marginRight: '8px' }} />
              Searching across 80M+ songs for "{searchQuery}"... If no exact match appears, try another title, movie, or artist.
            </div>
          ) : (
            <>
              <TrackGrid>
                {searchResults.map(renderTrackCard)}
              </TrackGrid>
              <LoadMoreBtn onClick={handleLoadMoreSearch} disabled={loadingSection === 'search'}>
                {loadingSection === 'search' ? <FaSyncAlt className="spin" /> : <FaBolt />} 
                Load More Search Results (Page {searchPage + 1})
              </LoadMoreBtn>
            </>
          )}
        </Section>
      ) : (
        <>
          {/* 80M+ GLOBAL & REGIONAL MUSIC CATALOG HUB */}
          <CatalogBanner>
            <div className="banner-top">
              <div className="catalog-badge">
                <span className="live-dot" /> 80,000,000+ FULL TRACKS • ZERO 30-SEC LIMITS
              </div>
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: '600' }}>
                Full 320kbps Studio Quality • Tollywood • Bollywood • Kollywood • Hollywood & Worldwide
              </span>
            </div>
            <h2>Access 80M+ Songs Across All Languages & Regions</h2>
            <p>
              Every movie, artist, and track from India and worldwide is available. Type any song name in the search bar above or click any trending tag or cinema industry below to stream instantly:
            </p>

            {/* Quick Trending Searches */}
            <SuggestionChips>
              <span className="label">Popular Searches:</span>
              {['Taylor Swift', 'Pushpa 2', 'Arijit Singh', 'Devara', 'Anirudh', 'Diljit Dosanjh', 'The Weeknd', 'Leo', 'Illuminati', 'Billie Eilish', 'Coldplay', 'BTS', 'Bhojpuri Hits'].map(tag => (
                <button key={tag} className="chip" onClick={() => handleQuickSearch(tag)}>
                  {tag}
                </button>
              ))}
            </SuggestionChips>

            {/* Regional Cinema & Language Cards */}
            <IndustryCardGrid>
              {[
                { name: '🎬 Tollywood', sub: 'Telugu Cinema', count: '1.2M+ Songs', key: 'tollywood', grad: 'linear-gradient(135deg, #f12711, #f5af19)' },
                { name: '🌟 Bollywood', sub: 'Hindi Cinema', count: '2.5M+ Songs', key: 'bollywood', grad: 'linear-gradient(135deg, #fc3c44, #b8336a)' },
                { name: '🔥 Kollywood', sub: 'Tamil Cinema', count: '1.1M+ Songs', key: 'kollywood', grad: 'linear-gradient(135deg, #8A2387, #E94057)' },
                { name: '🌍 Hollywood', sub: 'English & Global', count: '35M+ Songs', key: 'hollywood', grad: 'linear-gradient(135deg, #00f2fe, #4facfe)' },
                { name: '⚡ Punjabi', sub: 'Bhangra & Pop', count: '600K+ Songs', key: 'punjabi', grad: 'linear-gradient(135deg, #f5af19, #f12711)' },
                { name: '🌴 Malayalam', sub: 'Mollywood Hits', count: '450K+ Songs', key: 'malayalam', grad: 'linear-gradient(135deg, #11998e, #38ef7d)' },
                { name: '🦁 Kannada', sub: 'Sandalwood Hits', count: '400K+ Songs', key: 'kannada', grad: 'linear-gradient(135deg, #fa709a, #fee140)' },
                { name: '💃 Bhojpuri', sub: 'Desi Folk & Cinema', count: '350K+ Songs', key: 'bhojpuri', grad: 'linear-gradient(135deg, #654ea3, #eaafc8)' },
                { name: '✨ K-Pop & Global', sub: 'BTS & Asian Pop', count: '500K+ Songs', key: 'kpop', grad: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
              ].map(item => (
                <IndustryCard key={item.key} gradient={item.grad} onClick={() => handlePillClick(item.key)}>
                  <h4>{item.name}</h4>
                  <span className="count">{item.sub} • {item.count}</span>
                </IndustryCard>
              ))}
            </IndustryCardGrid>
          </CatalogBanner>

          {/* Flagship Hero Banner */}
          {heroTrack && (
            <HeroBanner>
              <HeroContent>
                <div className="hero-badge">
                  <FaFire style={{ color: '#ffb300' }} />
                  FEATURED HIT OF THE DAY
                </div>
                <h1 className="hero-title">{heroTrack.title}</h1>
                <div className="hero-artist">
                  {heroTrack.artist?.name || heroTrack.artistName} • {heroTrack.album?.title || heroTrack.albumName}
                </div>
                <div className="hero-actions">
                  <PlayNowBtn onClick={handleHeroPlay}>
                    {isHeroPlaying ? <FaPause /> : <FaPlay />}
                    <span>{isHeroPlaying ? 'PAUSE TRACK' : 'PLAY NOW'}</span>
                  </PlayNowBtn>
                  <NextHitBtn onClick={handleNextHeroTrack} title="Switch to Next Daily Blockbuster">
                    <FaSyncAlt />
                    <span>NEXT HIT</span>
                  </NextHitBtn>
                </div>
              </HeroContent>
              <HeroCoverWrapper>
                <img 
                  className="hero-artwork" 
                  src={heroTrack.coverImage || DEFAULT_COVER} 
                  alt={heroTrack.title} 
                  onError={(e) => { e.target.src = DEFAULT_COVER; }}
                />
              </HeroCoverWrapper>
            </HeroBanner>
          )}

          {/* 🎬 Tollywood Cinema Blockbusters (Telugu Hits) */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <FaFilm style={{ color: '#f12711' }} />
                Tollywood Blockbusters (Telugu Hits - Full 320kbps)
              </SectionTitle>
              <SectionAction to="/browse?industry=tollywood">View More ({tollywoodTracks.length})</SectionAction>
            </SectionHeader>

            <TrackGrid>
              {tollywoodTracks.map(renderTrackCard)}
            </TrackGrid>
            <LoadMoreBtn onClick={handleLoadMoreTollywood} disabled={loadingSection === 'tollywood'}>
              {loadingSection === 'tollywood' ? <FaSyncAlt className="spin" /> : <FaBolt />} 
              Load More Telugu Songs (Page {tollywoodPage + 1})
            </LoadMoreBtn>
          </Section>

          {/* 🌟 Bollywood Magic & Romance (Hindi Hits) */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <FaMusic style={{ color: '#fc3c44' }} />
                Bollywood Magic & Romance (Hindi Hits)
              </SectionTitle>
              <SectionAction to="/browse?industry=bollywood">View More ({bollywoodTracks.length})</SectionAction>
            </SectionHeader>

            <TrackGrid>
              {bollywoodTracks.map(renderTrackCard)}
            </TrackGrid>
            <LoadMoreBtn onClick={handleLoadMoreBollywood} disabled={loadingSection === 'bollywood'}>
              {loadingSection === 'bollywood' ? <FaSyncAlt className="spin" /> : <FaBolt />} 
              Load More Hindi Songs (Page {bollywoodPage + 1})
            </LoadMoreBtn>
          </Section>

          {/* 🔥 Kollywood Mass & Melodies (Tamil Hits) */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <FaFire style={{ color: '#ff7700' }} />
                Kollywood Anirudh & Kuthu (Tamil Hits)
              </SectionTitle>
              <SectionAction to="/browse?industry=kollywood">View More ({kollywoodTracks.length})</SectionAction>
            </SectionHeader>

            <TrackGrid>
              {kollywoodTracks.map(renderTrackCard)}
            </TrackGrid>
            <LoadMoreBtn onClick={handleLoadMoreKollywood} disabled={loadingSection === 'kollywood'}>
              {loadingSection === 'kollywood' ? <FaSyncAlt className="spin" /> : <FaBolt />} 
              Load More Tamil Songs (Page {kollywoodPage + 1})
            </LoadMoreBtn>
          </Section>

          {/* 🌍 Hollywood & Global Blockbusters (English Hits) */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <FaGlobe style={{ color: '#00f2fe' }} />
                Hollywood & Global Chartbusters (English Hits)
              </SectionTitle>
              <SectionAction to="/browse?industry=hollywood">View More ({hollywoodTracks.length})</SectionAction>
            </SectionHeader>

            <TrackGrid>
              {hollywoodTracks.map(renderTrackCard)}
            </TrackGrid>
            <LoadMoreBtn onClick={handleLoadMoreHollywood} disabled={loadingSection === 'hollywood'}>
              {loadingSection === 'hollywood' ? <FaSyncAlt className="spin" /> : <FaBolt />} 
              Load More Hollywood Songs (Page {hollywoodPage + 1})
            </LoadMoreBtn>
          </Section>

          {/* ⚡ Punjabi & Regional Spotlight */}
          {punjabiTracks.length > 0 && (
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <FaCompactDisc style={{ color: '#ffb300' }} />
                  Punjabi Beats & Regional Spotlight
                </SectionTitle>
                <SectionAction to="/browse?industry=punjabi">View More ({punjabiTracks.length})</SectionAction>
              </SectionHeader>

              <TrackGrid>
                {punjabiTracks.map(renderTrackCard)}
              </TrackGrid>
              <LoadMoreBtn onClick={handleLoadMorePunjabi} disabled={loadingSection === 'punjabi'}>
                {loadingSection === 'punjabi' ? <FaSyncAlt className="spin" /> : <FaBolt />} 
                Load More Punjabi Songs (Page {punjabiPage + 1})
              </LoadMoreBtn>
            </Section>
          )}

          {/* Filtered Genre / All Hits Grid */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <FaCompactDisc style={{ color: 'var(--primary-color)' }} />
                {selectedPill === 'tollywood' ? 'Tollywood Hits' : 
                 selectedPill === 'bollywood' ? 'Bollywood Hits' : 
                 selectedPill === 'kollywood' ? 'Kollywood Hits' : 
                 selectedPill === 'hollywood' ? 'Hollywood Hits' : 
                 selectedPill === 'punjabi' ? 'Punjabi Hits' : 
                 selectedPill === 'malayalam' ? 'Malayalam Hits' : 
                 selectedPill === 'kannada' ? 'Kannada Hits' : 
                 selectedPill === 'bhojpuri' ? 'Bhojpuri Hits' : 
                 selectedPill === 'kpop' ? 'K-Pop & Global Hits' : 'Trending Hits Worldwide'}
              </SectionTitle>
              <SectionAction to="/browse">Explore All</SectionAction>
            </SectionHeader>

            <TrackGrid>
              {displayTracks.map(renderTrackCard)}
            </TrackGrid>
            <LoadMoreBtn onClick={handleLoadMoreDisplay} disabled={loadingSection === 'display'}>
              {loadingSection === 'display' ? <FaSyncAlt className="spin" /> : <FaBolt />} 
              Load More Songs (Page {displayPage + 1})
            </LoadMoreBtn>
          </Section>

          {/* Global Top Charts */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <FaHeadphones style={{ color: '#fc3c44' }} />
                Top Charts (Fast Play)
              </SectionTitle>
              <SectionAction to="/browse">View Full Chart</SectionAction>
            </SectionHeader>
            <SongList songs={chartTracks} />
          </Section>

          {/* Curated Playlists */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <FaMusic style={{ color: '#00f2fe' }} />
                Featured Curations
              </SectionTitle>
              <SectionAction to="/playlists">View All</SectionAction>
            </SectionHeader>
            <PlaylistGrid playlists={playlists} />
          </Section>

          {/* Popular Artists */}
          <Section>
            <SectionHeader>
              <SectionTitle>
                <FaCheckCircle style={{ color: '#00f2fe' }} />
                Popular Indian & Global Artists
              </SectionTitle>
              <SectionAction to="/browse">View All Artists</SectionAction>
            </SectionHeader>
            <ArtistGrid artists={artists} />
          </Section>
        </>
      )}
    </HomeContainer>
  );
};

export default Home;