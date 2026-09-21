import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { FaHeart, FaMusic, FaPlay, FaPause } from 'react-icons/fa';
import SongList from '../components/songs/SongList';
import { FALLBACK_TRACKS } from '../services/musicApiService';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const HeaderBanner = styled.div`
  background: linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%);
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  box-shadow: 0 16px 40px rgba(233, 64, 87, 0.3);

  .banner-left {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .heart-icon-box {
    width: 90px;
    height: 90px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 40px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
    flex-shrink: 0;
  }

  .header-text {
    h1 {
      font-size: 2.8rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }
    p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.75rem;

    .banner-left {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .heart-icon-box {
      width: 60px;
      height: 60px;
      font-size: 28px;
    }

    .header-text h1 {
      font-size: 2rem;
    }
  }
`;

const PlayAllBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #000000;
  padding: 14px 28px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 15px;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: scale(1.05);
    background: #f0f0f0;
  }
`;

const EmptyStateCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 3.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 48px;
    color: #fc3c44;
  }

  h3 {
    font-size: 1.35rem;
    font-weight: 800;
    color: #ffffff;
  }

  p {
    color: var(--text-secondary);
    font-size: 14.5px;
    max-width: 440px;
    line-height: 1.5;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Favorites = () => {
  const { likedSongs = [], playList, isPlaying, currentSong, pauseSong } = usePlayer();

  const isLikedPlaying = likedSongs.length > 0 && likedSongs.some(s => s._id === currentSong?._id) && isPlaying;

  const handlePlayAll = () => {
    if (likedSongs.length === 0) return;
    if (isLikedPlaying) {
      pauseSong();
    } else {
      playList(likedSongs, 0);
    }
  };

  return (
    <Container>
      <HeaderBanner>
        <div className="banner-left">
          <div className="heart-icon-box">
            <FaHeart />
          </div>
          <div className="header-text">
            <h1>Liked Songs</h1>
            <p>{likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'} saved to your library</p>
          </div>
        </div>

        {likedSongs.length > 0 && (
          <PlayAllBtn onClick={handlePlayAll}>
            {isLikedPlaying ? <FaPause /> : <FaPlay />}
            <span>{isLikedPlaying ? 'PAUSE ALL' : 'PLAY ALL'}</span>
          </PlayAllBtn>
        )}
      </HeaderBanner>

      {likedSongs.length > 0 ? (
        <>
          <Section>
            <SectionTitle>
              <FaHeart style={{ color: '#fc3c44' }} />
              Your Liked Tracks ({likedSongs.length})
            </SectionTitle>
            <SongList songs={likedSongs} />
          </Section>

          <Section style={{ marginTop: '1.5rem' }}>
            <SectionTitle>
              <FaMusic style={{ color: 'var(--primary-color)' }} />
              More Recommended Hits
            </SectionTitle>
            <SongList songs={FALLBACK_TRACKS.slice(0, 6)} />
          </Section>
        </>
      ) : (
        <>
          <EmptyStateCard>
            <FaHeart />
            <h3>Songs you like will appear here</h3>
            <p>Save songs by clicking the heart icon anywhere across MUSICBOX. Here are some trending hits to get you started:</p>
          </EmptyStateCard>

          <Section>
            <SectionTitle>
              <FaMusic style={{ color: 'var(--primary-color)' }} />
              Recommended Hits For You
            </SectionTitle>
            <SongList songs={FALLBACK_TRACKS.slice(0, 10)} />
          </Section>
        </>
      )}
    </Container>
  );
};

export default Favorites;