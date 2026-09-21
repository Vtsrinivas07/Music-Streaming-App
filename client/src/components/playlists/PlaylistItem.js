import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlay, FaPause, FaEllipsisH } from 'react-icons/fa';
import { PlayerContext } from '../../context/PlayerContext';
import { AuthContext } from '../../context/AuthContext';

const PlaylistCard = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    
    .play-button {
      opacity: 1;
      transform: translateY(0);
    }
    
    .options-button {
      opacity: 1;
    }
  }
`;

const PlaylistCover = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  margin-bottom: 16px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const PlaylistImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaylistInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlaylistTitle = styled(Link)`
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 8px;
  color: white;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PlaylistDescription = styled.p`
  color: #aaa;
  font-size: 14px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PlaylistMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  color: #aaa;
  font-size: 14px;
`;

const SongCount = styled.div``;

const Owner = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlayButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.5);
  
  &:hover {
    transform: scale(1.1) translateY(0);
    background-color: var(--primary-hover);
  }
  
  & svg {
    font-size: 20px;
  }
`;

const OptionsButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
`;

const OptionMenu = styled.div`
  position: absolute;
  top: 48px;
  right: 12px;
  background: #282828;
  border-radius: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 10;
  overflow: hidden;
`;

const OptionItem = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const PlaylistItem = ({ playlist, onDelete, onEdit }) => {
  const [showOptions, setShowOptions] = useState(false);
  const { currentPlaylist, isPlaying, togglePlay, playPlaylist } = useContext(PlayerContext);
  const { user } = useContext(AuthContext);
  
  const isCurrentPlaylist = currentPlaylist && currentPlaylist._id === playlist._id;
  const isOwner = user && playlist.owner && user._id === playlist.owner._id;

  const handlePlayClick = (e) => {
    e.preventDefault();
    if (isCurrentPlaylist) {
      togglePlay();
    } else {
      playPlaylist(playlist);
    }
  };
  
  const handleOptionsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions(!showOptions);
  };
  
  const handleDeleteClick = (e) => {
    e.preventDefault();
    setShowOptions(false);
    if (onDelete) onDelete(playlist._id);
  };
  
  const handleEditClick = (e) => {
    e.preventDefault();
    setShowOptions(false);
    if (onEdit) onEdit(playlist);
  };
  
  // Determine playlist cover image
  const coverImage = playlist.coverImage 
    ? `/uploads/${playlist.coverImage}` 
    : playlist.songs && playlist.songs.length > 0 && playlist.songs[0].coverImage 
      ? `/uploads/${playlist.songs[0].coverImage}` 
      : '/images/default-playlist.jpg';

  return (
    <PlaylistCard>
      <PlaylistCover>
        <PlaylistImage src={coverImage} alt={playlist.name} />
        <PlayButton className="play-button" onClick={handlePlayClick}>
          {isCurrentPlaylist && isPlaying ? <FaPause /> : <FaPlay />}
        </PlayButton>
        {isOwner && (
          <>
            <OptionsButton className="options-button" onClick={handleOptionsClick}>
              <FaEllipsisH />
            </OptionsButton>
            {showOptions && (
              <OptionMenu>
                <OptionItem onClick={handleEditClick}>Edit playlist</OptionItem>
                <OptionItem onClick={handleDeleteClick}>Delete playlist</OptionItem>
              </OptionMenu>
            )}
          </>
        )}
      </PlaylistCover>
      <PlaylistInfo>
        <PlaylistTitle to={`/playlist/${playlist._id}`}>{playlist.name}</PlaylistTitle>
        {playlist.description && (
          <PlaylistDescription>{playlist.description}</PlaylistDescription>
        )}
        <PlaylistMeta>
          <SongCount>{playlist.songs ? playlist.songs.length : 0} songs</SongCount>
          {playlist.owner && <Owner>By {playlist.owner.username}</Owner>}
        </PlaylistMeta>
      </PlaylistInfo>
    </PlaylistCard>
  );
};

export default PlaylistItem; 