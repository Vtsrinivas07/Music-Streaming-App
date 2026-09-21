import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from '../player/MusicPlayer';
import AddToPlaylistModal from '../playlists/AddToPlaylistModal';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at 15% 15%, rgba(252, 60, 68, 0.04) 0%, transparent 45%),
              radial-gradient(circle at 85% 85%, rgba(29, 185, 84, 0.04) 0%, transparent 45%),
              #0b0b0f;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.75rem 2.5rem 130px 2.5rem;
  scroll-behavior: smooth;

  @media (max-width: 768px) {
    padding: 1rem 1rem 130px 1rem;
  }
`;

const Layout = () => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent id="main-content-scroll">
        <Outlet />
      </MainContent>
      <Player />
      <AddToPlaylistModal />
    </LayoutContainer>
  );
};

export default Layout;