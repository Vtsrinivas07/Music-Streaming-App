import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaTimes, FaMusic, FaFire } from 'react-icons/fa';
import SongList from '../components/songs/SongList';
import { searchFreeMusic, FALLBACK_TRACKS } from '../services/musicApiService';

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SearchBarWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 650px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 45px 15px 50px;
  font-size: 1.1rem;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  color: #ffffff;
  font-weight: 500;
  transition: all 0.25s ease;

  &:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: var(--primary-color);
    box-shadow: 0 0 20px rgba(29, 185, 84, 0.25);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 18px;
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 16px;

  &:hover {
    color: #ffffff;
  }
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 1rem;
`;

const GenreCard = styled.div`
  height: 140px;
  border-radius: 16px;
  background: ${props => props.gradient || 'linear-gradient(135deg, #4facfe, #00f2fe)'};
  padding: 18px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
  }

  h3 {
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
  }

  .genre-sub {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 600;
    margin-top: 4px;
  }

  svg {
    position: absolute;
    bottom: -15px;
    right: -15px;
    font-size: 80px;
    color: rgba(255, 255, 255, 0.2);
    transform: rotate(20deg);
  }
`;

const GENRE_CATEGORIES = [
  { name: 'Tollywood (Telugu)', query: 'Telugu Tollywood hits', gradient: 'linear-gradient(135deg, #f12711, #f5af19)', sub: 'Pushpa, Devara, RRR & DSP' },
  { name: 'Bollywood (Hindi)', query: 'Bollywood Hindi hits Arijit', gradient: 'linear-gradient(135deg, #fc3c44, #b8336a)', sub: 'Arijit, Pritam & Romantics' },
  { name: 'Kollywood (Tamil)', query: 'Tamil Kollywood Anirudh hits', gradient: 'linear-gradient(135deg, #8A2387, #E94057)', sub: 'Anirudh, Leo, Jailer & Kuthu' },
  { name: 'Hollywood (English)', query: 'Hollywood Billboard Pop Hits', gradient: 'linear-gradient(135deg, #00f2fe, #4facfe)', sub: 'Taylor Swift, Weeknd & Bruno' },
  { name: 'Punjabi Beats', query: 'Punjabi hits Diljit AP Dhillon', gradient: 'linear-gradient(135deg, #f5af19, #f12711)', sub: 'Diljit, Karan Aujla & AP' },
  { name: 'Malayalam (Mollywood)', query: 'Malayalam Top Hits Aavesham', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)', sub: 'Aavesham & Manjummel Boys' },
  { name: 'K-Pop & Global', query: 'K-Pop Top Hits BTS', gradient: 'linear-gradient(135deg, #fa709a, #fee140)', sub: 'BTS, BLACKPINK & NewJeans' },
  { name: 'Top Hits 2024', query: 'Top Hits 2024', gradient: 'linear-gradient(135deg, #1db954, #191414)', sub: 'Global Trending' }
];

const Section = styled.div`
  margin-top: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LoadingText = styled.div`
  color: var(--text-muted);
  font-size: 15px;
  padding: 2rem 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSongs([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const results = await searchFreeMusic(query, 25);
      setSongs(results);
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
    setSongs([]);
  };

  const handleCategoryClick = (catQuery) => {
    setQuery(catQuery);
    setSearchParams({ q: catQuery });
  };

  return (
    <Container>
      <SearchBarWrapper>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="What do you want to listen to? (Songs, Artists, Albums)..."
          value={query}
          onChange={handleInputChange}
          autoFocus
        />
        {query && (
          <ClearButton onClick={handleClear}>
            <FaTimes />
          </ClearButton>
        )}
      </SearchBarWrapper>

      {loading ? (
        <LoadingText>
          <div className="equalizer-bar" style={{ height: 16 }} />
          <div className="equalizer-bar" style={{ height: 22 }} />
          <div className="equalizer-bar" style={{ height: 14 }} />
          <span>Searching global music database...</span>
        </LoadingText>
      ) : query.trim() ? (
        <Section>
          <SectionTitle>
            <FaMusic style={{ color: 'var(--primary-color)' }} />
            Search Results for "{query}" ({songs.length} tracks found)
          </SectionTitle>
          {songs.length > 0 ? (
            <SongList songs={songs} />
          ) : (
            <div style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
              No matches found. Try searching for a superstar like "Taylor Swift", "The Weeknd", or "Drake".
            </div>
          )}
        </Section>
      ) : (
        <Section>
          <SectionTitle>
            <FaFire style={{ color: '#ffb300' }} />
            Browse All Genres & Categories
          </SectionTitle>
          <GenreGrid>
            {GENRE_CATEGORIES.map((cat, idx) => (
              <GenreCard 
                key={idx} 
                gradient={cat.gradient}
                onClick={() => handleCategoryClick(cat.query)}
              >
                <h3>{cat.name}</h3>
                <div className="genre-sub">{cat.sub}</div>
                <FaMusic />
              </GenreCard>
            ))}
          </GenreGrid>
        </Section>
      )}
    </Container>
  );
};

export default Search;