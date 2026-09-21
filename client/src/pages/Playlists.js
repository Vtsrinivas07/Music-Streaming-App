import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaTimes } from 'react-icons/fa';

import PlaylistGrid from '../components/playlists/PlaylistGrid';
import PageHeader from '../components/layout/PageHeader';
import { CURATED_PLAYLISTS } from '../services/musicApiService';
import { usePlayer } from '../context/PlayerContext';

const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const CreateBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary-color);
  color: #000000;
  font-weight: 800;
  font-size: 14px;
  padding: 10px 22px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(29, 185, 84, 0.35);
  transition: all 0.2s ease;

  &:hover {
    background: #24e569;
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(29, 185, 84, 0.45);
  }
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const ModalOverlay = styled.div`
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
`;

const ModalCard = styled.div`
  background: #181824;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  width: 100%;
  max-width: 440px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

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
    display: flex;
    align-items: center;

    &:hover {
      color: #ffffff;
    }
  }
`;

const Playlists = () => {
  const navigate = useNavigate();
  const { userPlaylists = [], createPlaylist, deletePlaylist } = usePlayer();
  const [featuredPlaylists, setFeaturedPlaylists] = useState(CURATED_PLAYLISTS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const featRes = await axios.get('/api/playlists/featured');
        const featData = featRes.data?.data || featRes.data;
        if (Array.isArray(featData) && featData.length > 0) {
          setFeaturedPlaylists(featData);
        }
      } catch {
        setFeaturedPlaylists(CURATED_PLAYLISTS);
      }
    };
    fetchFeatured();
  }, []);

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist._id || playlist.id}`);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const created = createPlaylist({
      name: newPlaylistName.trim(),
      description: newPlaylistDesc.trim() || 'Created by you'
    });

    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setIsCreateOpen(false);

    if (created && (created._id || created.id)) {
      navigate(`/playlist/${created._id || created.id}`);
    }
  };

  return (
    <Container>
      <HeaderRow>
        <PageHeader title="Playlists" />
        <CreateBtn onClick={() => setIsCreateOpen(true)}>
          <FaPlus /> Create Playlist
        </CreateBtn>
      </HeaderRow>
      
      <PageContent>
        <PlaylistGrid
          title="My Playlists"
          playlists={userPlaylists}
          onPlaylistClick={handlePlaylistClick}
          onCreatePlaylist={() => setIsCreateOpen(true)}
          onDeletePlaylist={deletePlaylist}
          showCreateCard={true}
        />
        
        <PlaylistGrid
          title="Featured Playlists"
          playlists={featuredPlaylists}
          onPlaylistClick={handlePlaylistClick}
        />
      </PageContent>
      
      {isCreateOpen && (
        <ModalOverlay onClick={() => setIsCreateOpen(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h3>Create New Playlist</h3>
              <button className="close-btn" onClick={() => setIsCreateOpen(false)} title="Close">
                <FaTimes />
              </button>
            </ModalHeader>
            <form onSubmit={handleCreateSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                    Playlist Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tollywood Favorites, Workout Energy, Late Night Vibe..." 
                    value={newPlaylistName}
                    onChange={e => setNewPlaylistName(e.target.value)}
                    autoFocus
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
                    Description (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Give your playlist a cool description..." 
                    value={newPlaylistDesc}
                    onChange={e => setNewPlaylistDesc(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsCreateOpen(false)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      padding: '10px 20px',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{
                      background: 'var(--primary-color)',
                      border: 'none',
                      color: '#000000',
                      fontWeight: '800',
                      padding: '10px 24px',
                      borderRadius: '25px',
                      cursor: 'pointer'
                    }}
                  >
                    Create Playlist
                  </button>
                </div>
              </div>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Playlists; 