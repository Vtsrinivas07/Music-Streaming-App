import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
`;

const AlbumCard = styled(Link)`
  text-decoration: none;
  background: rgba(22, 22, 32, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(35, 35, 50, 0.85);
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

const AlbumCover = styled.div`
  width: 100%;
  padding-bottom: 100%;
  background: #1e1e28;
  border-radius: 10px;
  margin-bottom: 12px;
  overflow: hidden;
  position: relative;
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

  ${AlbumCard}:hover & img {
    transform: scale(1.05);
  }
`;

const AlbumInfo = styled.div`
  overflow: hidden;
`;

const AlbumTitle = styled.h3`
  margin: 0 0 4px 0;
  font-size: 15px;
  color: #ffffff;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtistName = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DEFAULT_ALBUM_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400';

const AlbumGrid = ({ albums = [] }) => {
  const resolveImage = (img) => {
    if (!img) return DEFAULT_ALBUM_COVER;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/uploads')) return img;
    if (img.startsWith('uploads/')) return `/${img}`;
    return `/uploads/${img}`;
  };

  return (
    <Grid>
      {albums.map((album, idx) => (
        <AlbumCard key={album._id || album.id || idx} to={album._id ? `/album/${album._id}` : '#'}>
          <AlbumCover>
            <img 
              src={resolveImage(album.coverImage)} 
              alt={album.title}
              onError={(e) => { e.target.src = DEFAULT_ALBUM_COVER; }}
            />
          </AlbumCover>
          <AlbumInfo>
            <AlbumTitle>{album.title}</AlbumTitle>
            <ArtistName>{album.artist?.name || album.artistName || 'Various Artists'}</ArtistName>
          </AlbumInfo>
        </AlbumCard>
      ))}
    </Grid>
  );
};

export default AlbumGrid;