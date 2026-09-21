import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPlus, FaCheck } from 'react-icons/fa';
import { usePlayer } from '../../context/PlayerContext';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalCard = styled.div`
  background: #161622;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  width: 100%;
  max-width: 440px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #ffffff;
  }

  button.close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;

    &:hover {
      color: #ffffff;
    }
  }
`;

const TargetSongBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px 14px;

  img {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    object-fit: cover;
  }

  .info {
    overflow: hidden;
    h4 {
      margin: 0 0 2px 0;
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    p {
      margin: 0;
      font-size: 12px;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const PlaylistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

const PlaylistItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .details {
    display: flex;
    flex-direction: column;
    span.name {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
    }
    span.count {
      font-size: 12px;
      color: var(--text-muted);
    }
  }

  button.add-btn {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.2s;

    &.added {
      background: rgba(29, 185, 84, 0.2);
      color: #1db954;
      border: 1px solid rgba(29, 185, 84, 0.4);
      cursor: default;
    }

    &.not-added {
      background: var(--primary-color);
      color: #000000;
      &:hover {
        background: #24e569;
        transform: scale(1.05);
      }
    }
  }
`;

const CreateSection = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 4px;

  input {
    flex: 1;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 25px;
    padding: 10px 16px;
    font-size: 13px;
    color: #ffffff;
    outline: none;

    &:focus {
      border-color: var(--primary-color);
    }

    &::placeholder {
      color: var(--text-muted);
    }
  }

  button {
    padding: 10px 18px;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    border: 1px solid rgba(255, 255, 255, 0.15);
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;

    &:hover {
      background: var(--primary-color);
      color: #000000;
      border-color: transparent;
    }
  }
`;

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300';

const AddToPlaylistModal = () => {
  const { 
    isAddToPlaylistOpen, 
    songForPlaylist, 
    closeAddToPlaylist, 
    userPlaylists, 
    addSongToPlaylist,
    createPlaylist 
  } = usePlayer();

  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAddToPlaylistOpen || !songForPlaylist) return null;

  const targetId = String(songForPlaylist._id || songForPlaylist.id);

  const handleAdd = (playlist) => {
    addSongToPlaylist(playlist._id || playlist.id, songForPlaylist);
    setSuccessMsg(`Added to "${playlist.name}"!`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleCreateAndAdd = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const newPl = createPlaylist({
      name: newPlaylistName.trim(),
      description: 'Created by you',
      coverImage: songForPlaylist.coverImage || DEFAULT_COVER
    });

    addSongToPlaylist(newPl._id, songForPlaylist);
    setNewPlaylistName('');
    setSuccessMsg(`Created "${newPl.name}" & added song!`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const isSongInPlaylist = (playlist) => {
    return (playlist.songs || []).some(s => {
      if (typeof s === 'object') return String(s._id || s.id) === targetId;
      return String(s) === targetId;
    });
  };

  return (
    <Overlay onClick={closeAddToPlaylist}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>Add to Playlist</h3>
          <button className="close-btn" onClick={closeAddToPlaylist}>
            <FaTimes />
          </button>
        </ModalHeader>

        {/* Selected Song Preview */}
        <TargetSongBanner>
          <img 
            src={songForPlaylist.coverImage || DEFAULT_COVER} 
            alt={songForPlaylist.title}
            onError={(e) => { e.target.src = DEFAULT_COVER; }}
          />
          <div className="info">
            <h4>{songForPlaylist.title}</h4>
            <p>{songForPlaylist.artist?.name || songForPlaylist.artistName || 'Unknown Artist'}</p>
          </div>
        </TargetSongBanner>

        {successMsg && (
          <div style={{ color: '#1db954', fontSize: '13px', fontWeight: '700', textAlign: 'center' }}>
            ✓ {successMsg}
          </div>
        )}

        {/* Existing Playlists */}
        <PlaylistList>
          {userPlaylists.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
              You don't have any playlists yet. Create your first one below!
            </div>
          ) : (
            userPlaylists.map((pl) => {
              const inPlaylist = isSongInPlaylist(pl);
              return (
                <PlaylistItem key={pl._id || pl.id}>
                  <div className="details">
                    <span className="name">{pl.name}</span>
                    <span className="count">{(pl.songs || []).length} songs</span>
                  </div>
                  <button 
                    className={`add-btn ${inPlaylist ? 'added' : 'not-added'}`}
                    onClick={() => !inPlaylist && handleAdd(pl)}
                    disabled={inPlaylist}
                  >
                    {inPlaylist ? (
                      <>
                        <FaCheck /> Added
                      </>
                    ) : (
                      <>
                        <FaPlus /> Add
                      </>
                    )}
                  </button>
                </PlaylistItem>
              );
            })
          )}
        </PlaylistList>

        {/* Quick Create New Playlist */}
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
            OR CREATE A NEW PLAYLIST
          </div>
          <CreateSection onSubmit={handleCreateAndAdd}>
            <input 
              type="text" 
              placeholder="New playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <button type="submit">
              <FaPlus /> Create & Add
            </button>
          </CreateSection>
        </div>
      </ModalCard>
    </Overlay>
  );
};

export default AddToPlaylistModal;
