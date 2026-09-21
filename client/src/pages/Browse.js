import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { 
  FaSearch, 
  FaMusic, 
  FaListUl, 
  FaUser, 
  FaCompactDisc, 
  FaBolt, 
  FaSyncAlt, 
  FaTimes, 
  FaGlobeAmericas 
} from 'react-icons/fa';

// Components
import SongList from '../components/songs/SongList';
import PlaylistGrid from '../components/playlists/PlaylistGrid';
import ArtistGrid from '../components/artists/ArtistGrid';
import AlbumGrid from '../components/albums/AlbumGrid';
import { 
  searchFreeMusic,
  fetchTrendingHits, 
  fetchGenreTracks,
  CURATED_PLAYLISTS, 
  TOP_ARTISTS 
} from '../services/musicApiService';

const BrowseContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 3rem;
`;

const BrowseHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PageHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(29, 185, 84, 0.15);
  color: var(--primary-color);
  border: 1px solid rgba(29, 185, 84, 0.3);
  padding: 4px 12px;
  border-radius: 20px;

  span.dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--primary-color);
    box-shadow: 0 0 8px var(--primary-color);
  }
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const TabsList = styled.div`
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 5px;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow-x: auto;
  max-width: 100%;
`;

const TabButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 13.5px;
  font-weight: 700;
  background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.active ? '#000000' : 'var(--text-secondary)'};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: #ffffff;
    background: ${props => props.active ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 40px;
  padding: 8px 16px;
  width: 100%;
  max-width: 380px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: var(--primary-color);
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    color: var(--text-muted);
    margin-right: 10px;
  }

  input {
    background: transparent;
    border: none;
    color: white;
    font-size: 13.5px;
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
    display: flex;
    align-items: center;
    &:hover {
      color: #ffffff;
    }
  }
`;

// Regional/Language Filter Bar
const RegionFilters = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

const RegionPill = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, var(--primary-color), #179b44)' : 'rgba(255, 255, 255, 0.06)'};
  color: ${props => props.active ? '#000000' : 'rgba(255, 255, 255, 0.85)'};
  font-weight: ${props => props.active ? '700' : '500'};
  font-size: 13px;
  padding: 8px 16px;
  border-radius: 25px;
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
  white-space: nowrap;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.12)'};
    color: ${props => props.active ? '#000000' : '#ffffff'};
    transform: translateY(-1px);
  }
`;

const ContentContainer = styled.div`
  min-height: 400px;
`;

const CatalogCountBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 13.5px;
  color: var(--text-secondary);

  span.highlight {
    color: #ffffff;
    font-weight: 700;
  }
`;

const LoadMoreBtn = styled.button`
  margin: 2.5rem auto 1rem;
  padding: 12px 32px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  background: var(--primary-color);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 18px rgba(29, 185, 84, 0.35);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(29, 185, 84, 0.5);
    background: #1ed760;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const REGIONS = [
  { id: 'all', label: '🔥 All Global & Indian Hits' },
  { id: 'tollywood', label: '🎬 Tollywood (Telugu)' },
  { id: 'bollywood', label: '🌟 Bollywood (Hindi)' },
  { id: 'kollywood', label: '🔥 Kollywood (Tamil)' },
  { id: 'hollywood', label: '🌍 Hollywood (English)' },
  { id: 'punjabi', label: '⚡ Punjabi Beats' },
  { id: 'malayalam', label: '🌴 Malayalam Hits' },
  { id: 'kannada', label: '🦁 Kannada Hits' },
  { id: 'bhojpuri', label: '💃 Bhojpuri Hits' },
  { id: 'bengali', label: '🎵 Bengali Hits' },
  { id: 'kpop', label: '✨ K-Pop Hits' },
];

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  
  const type = searchParams.get('type') || 'songs';
  const initialRegion = searchParams.get('industry') || 'all';
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);

  // Sync state if URL industry changes
  useEffect(() => {
    const ind = searchParams.get('industry');
    if (ind && ind !== selectedRegion) {
      setSelectedRegion(ind);
      setPage(1);
    }
  }, [searchParams, selectedRegion]);

  // Main loader for content
  const loadContent = useCallback(async (currentType, region, query, pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      if (currentType === 'songs') {
        let songs = [];
        if (query.trim().length > 0) {
          songs = await searchFreeMusic(query.trim(), 30, pageNum);
        } else if (region === 'all') {
          songs = await fetchTrendingHits(30, pageNum);
        } else {
          songs = await fetchGenreTracks(region, 30, pageNum);
        }

        setContent(prev => pageNum === 1 ? songs : [...prev, ...songs]);
      } else if (currentType === 'playlists') {
        try {
          const res = await axios.get('/api/playlists');
          const local = res.data.data || [];
          setContent(local.length > 0 ? local : CURATED_PLAYLISTS);
        } catch {
          setContent(CURATED_PLAYLISTS);
        }
      } else if (currentType === 'artists') {
        try {
          const res = await axios.get('/api/artists');
          const local = res.data.data || [];
          setContent(local.length > 0 ? local : TOP_ARTISTS);
        } catch {
          setContent(TOP_ARTISTS);
        }
      } else if (currentType === 'albums') {
        const res = await axios.get('/api/albums');
        setContent(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching browse content:', err);
      if (pageNum === 1) setContent([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Fetch whenever type or region changes
  useEffect(() => {
    setPage(1);
    loadContent(type, selectedRegion, searchTerm, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, selectedRegion]);

  const handleTypeChange = (newType) => {
    const params = { type: newType };
    if (selectedRegion && selectedRegion !== 'all') {
      params.industry = selectedRegion;
    }
    setSearchParams(params);
  };

  const handleRegionChange = (regionId) => {
    setSelectedRegion(regionId);
    setSearchParams({ type: 'songs', industry: regionId });
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      loadContent(type, selectedRegion, searchTerm, 1);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadContent(type, selectedRegion, searchTerm, nextPage);
  };

  return (
    <BrowseContainer>
      <BrowseHeader>
        <PageHeaderRow>
          <PageTitle>
            <FaGlobeAmericas style={{ color: 'var(--primary-color)' }} />
            Explore 80M+ Global & Regional Music
          </PageTitle>
          <LiveBadge>
            <span className="dot" /> 80M+ Full 320kbps Catalog Active
          </LiveBadge>
        </PageHeaderRow>

        <ControlsBar>
          <TabsList>
            <TabButton 
              active={type === 'songs'} 
              onClick={() => handleTypeChange('songs')}
            >
              <FaMusic />
              <span>Full Songs (80M+)</span>
            </TabButton>
            <TabButton 
              active={type === 'playlists'} 
              onClick={() => handleTypeChange('playlists')}
            >
              <FaListUl />
              <span>Curated Playlists</span>
            </TabButton>
            <TabButton 
              active={type === 'artists'} 
              onClick={() => handleTypeChange('artists')}
            >
              <FaUser />
              <span>Top Artists</span>
            </TabButton>
            <TabButton 
              active={type === 'albums'} 
              onClick={() => handleTypeChange('albums')}
            >
              <FaCompactDisc />
              <span>Albums</span>
            </TabButton>
          </TabsList>

          <SearchInputWrapper>
            <FaSearch />
            <input 
              type="text" 
              placeholder={type === 'songs' ? "Search 80M+ songs & press Enter..." : `Filter ${type}...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
            {searchTerm && (
              <button 
                className="clear-btn" 
                onClick={() => {
                  setSearchTerm('');
                  setPage(1);
                  loadContent(type, selectedRegion, '', 1);
                }}
              >
                <FaTimes />
              </button>
            )}
          </SearchInputWrapper>
        </ControlsBar>

        {/* Regional Filters (Visible for songs) */}
        {type === 'songs' && (
          <RegionFilters>
            {REGIONS.map(reg => (
              <RegionPill
                key={reg.id}
                active={selectedRegion === reg.id}
                onClick={() => handleRegionChange(reg.id)}
              >
                {reg.label}
              </RegionPill>
            ))}
          </RegionFilters>
        )}
      </BrowseHeader>

      <ContentContainer>
        {type === 'songs' && (
          <CatalogCountBar>
            <span>
              Showing <span className="highlight">{content.length} tracks</span> from{' '}
              <span className="highlight">
                {REGIONS.find(r => r.id === selectedRegion)?.label || 'Global Catalog'}
              </span>
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Page {page} • 100% Full Songs 320kbps
            </span>
          </CatalogCountBar>
        )}

        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '3rem 0', textAlign: 'center', fontSize: '15px' }}>
            <FaSyncAlt className="spin" style={{ marginRight: '8px' }} />
            Loading 80M+ catalog for {selectedRegion.toUpperCase()}...
          </div>
        ) : (
          <>
            {type === 'songs' && (
              <>
                <SongList songs={content} />
                <LoadMoreBtn onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? <FaSyncAlt className="spin" /> : <FaBolt />}
                  {loadingMore ? 'Fetching next songs...' : `Load More Songs (Page ${page + 1})`}
                </LoadMoreBtn>
              </>
            )}
            {type === 'playlists' && <PlaylistGrid playlists={content} />}
            {type === 'artists' && <ArtistGrid artists={content} />}
            {type === 'albums' && <AlbumGrid albums={content} />}
          </>
        )}
      </ContentContainer>
    </BrowseContainer>
  );
};

export default Browse;