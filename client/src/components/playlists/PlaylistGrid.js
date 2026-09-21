import React from 'react';
import styled from 'styled-components';
import { FaPlay, FaMusic, FaPlus } from 'react-icons/fa';
import { usePlayer } from '../../context/PlayerContext';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const PlaylistCard = styled.div`
  background: rgba(22, 22, 32, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: pointer;
  
  &:hover {
    background: rgba(35, 35, 50, 0.85);
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.15);
  }
  
  &:hover .play-button {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PlaylistCover = styled.div`
  position: relative;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  margin-bottom: 12px;
  background-color: #1e1e28;
  
  &:before {
    content: "";
    display: block;
    padding-top: 100%;
  }
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${PlaylistCard}:hover & img {
    transform: scale(1.04);
  }
`;

const PlayButton = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.25s ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  z-index: 2;
  
  &:hover {
    transform: scale(1.1) translateY(0);
    background-color: #22d662;
  }

  svg {
    font-size: 16px;
    margin-left: 2px;
  }
`;

const PlaylistTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PlaylistInfo = styled.p`
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
`;

const PlaylistBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 9.5px;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  color: #ffffff;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.05em;
  z-index: 2;
`;

const DEFAULT_PLAYLIST_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400';

const CreateCard = styled.div`
  background: rgba(29, 185, 84, 0.05);
  border: 2px dashed rgba(29, 185, 84, 0.35);
  border-radius: 14px;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  min-height: 240px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(29, 185, 84, 0.12);
    border-color: var(--primary-color);
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(29, 185, 84, 0.2);

    .create-icon-wrapper {
      transform: scale(1.1);
      background: var(--primary-color);
      color: #000000;
    }
  }

  .create-icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(29, 185, 84, 0.2);
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 14px;
    transition: all 0.25s ease;
  }

  h4 {
    margin: 0 0 6px 0;
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
  }

  p {
    margin: 0;
    font-size: 12.5px;
    color: var(--text-muted);
  }
`;

const PlaylistGrid = ({ 
  title, 
  playlists = [], 
  onPlaylistClick, 
  onPlayClick,
  showCreateCard = false,
  onCreatePlaylist
}) => {
  const { playSong } = usePlayer();

  const resolveImage = (cover) => {
    if (!cover) return DEFAULT_PLAYLIST_COVER;
    if (cover.startsWith('http')) return cover;
    if (cover.startsWith('/uploads')) return cover;
    if (cover.startsWith('uploads/')) return `/${cover}`;
    return `/uploads/${cover}`;
  };

  const handleCardClick = (playlist) => {
    if (onPlaylistClick) {
      onPlaylistClick(playlist);
    } else if (playlist.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[0]);
    }
  };

  return (
    <div>
      {title && (
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px', color: '#ffffff' }}>
          {title}
        </h2>
      )}
      <Grid>
        {showCreateCard && (
          <CreateCard onClick={onCreatePlaylist}>
            <div className="create-icon-wrapper">
              <FaPlus />
            </div>
            <h4>Create Playlist</h4>
            <p>Build your custom mix</p>
          </CreateCard>
        )}
        {playlists.map((playlist, idx) => (
          <PlaylistCard key={playlist._id || playlist.id || idx} onClick={() => handleCardClick(playlist)}>
            <PlaylistCover>
              {playlist.badge && <PlaylistBadge>{playlist.badge}</PlaylistBadge>}
              <img 
                src={resolveImage(playlist.coverImage)} 
                alt={playlist.name}
                onError={(e) => { e.target.src = DEFAULT_PLAYLIST_COVER; }}
              />
              <PlayButton className="play-button" onClick={(e) => {
                e.stopPropagation();
                if (playlist.songs && playlist.songs.length > 0) {
                  playSong(playlist.songs[0]);
                }
              }}>
                <FaPlay />
              </PlayButton>
            </PlaylistCover>
            <PlaylistTitle>{playlist.name}</PlaylistTitle>
            <PlaylistInfo>
              {playlist.description || (playlist.trackCount ? playlist.trackCount : (playlist.songs ? `${playlist.songs.length} songs` : 'Curated hits'))}
            </PlaylistInfo>
          </PlaylistCard>
        ))}
      </Grid>
    </div>
  );
};

export default PlaylistGrid;