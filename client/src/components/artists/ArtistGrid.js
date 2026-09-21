import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 24px;
`;

const ArtistCard = styled(Link)`
  text-decoration: none;
  background: rgba(22, 22, 32, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(35, 35, 50, 0.8);
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

const ArtistAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #252532;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  margin-bottom: 12px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${ArtistCard}:hover & img {
    transform: scale(1.08);
  }
`;

const ArtistName = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  .verified-badge {
    color: #00f2fe;
    font-size: 13px;
  }
`;

const ArtistSub = styled.p`
  margin: 4px 0 0 0;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
  text-align: center;
`;

const DEFAULT_ARTIST_IMG = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';

const ArtistGrid = ({ artists = [] }) => {
  const resolveImage = (img) => {
    if (!img) return DEFAULT_ARTIST_IMG;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/uploads')) return img;
    if (img.startsWith('uploads/')) return `/${img}`;
    return `/uploads/${img}`;
  };

  return (
    <Grid>
      {artists.map((artist, idx) => (
        <ArtistCard key={artist._id || artist.id || idx} to={artist._id ? `/artist/${artist._id}` : '#'}>
          <ArtistAvatar>
            <img 
              src={resolveImage(artist.image)} 
              alt={artist.name}
              onError={(e) => { e.target.src = DEFAULT_ARTIST_IMG; }}
            />
          </ArtistAvatar>
          <ArtistName>
            {artist.name}
            <FaCheckCircle className="verified-badge" title="Verified Artist" />
          </ArtistName>
          <ArtistSub>{artist.monthlyListeners ? `${artist.monthlyListeners} listeners` : 'Artist'}</ArtistSub>
        </ArtistCard>
      ))}
    </Grid>
  );
};

export default ArtistGrid;