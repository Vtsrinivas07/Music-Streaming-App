import React, { useContext } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaChartBar, 
  FaUsers, 
  FaMusic, 
  FaUserCheck, 
  FaCompactDisc, 
  FaSignOutAlt, 
  FaHeadphones, 
  FaCrown 
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { PlayerContext } from '../../context/PlayerContext';
import Player from '../player/MusicPlayer';
import AddToPlaylistModal from '../playlists/AddToPlaylistModal';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #0a0a0f;
  position: relative;
`;

const AdminSidebar = styled.aside`
  width: 260px;
  background: rgba(12, 12, 18, 0.96);
  backdrop-filter: blur(20px);
  height: 100%;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  z-index: 50;
  padding: ${props => props.$hasPlayer ? '1.5rem 1rem 116px 1rem' : '1.5rem 1rem'};
  overflow-y: auto;
  transition: padding 0.2s ease;

  @media (max-width: 768px) {
    width: 74px;
    padding: ${props => props.$hasPlayer ? '1rem 0.5rem 106px 0.5rem' : '1rem 0.5rem'};
  }
`;

const Brand = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 2rem;
  text-decoration: none;

  .brand-icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #f5af19 0%, #f12711 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(245, 175, 25, 0.4);
    flex-shrink: 0;
  }

  .brand-icon {
    color: white;
    font-size: 18px;
  }

  .brand-text {
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .brand-title {
    font-size: 19px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .brand-badge {
    font-size: 9px;
    font-weight: 800;
    background: rgba(255, 215, 0, 0.15);
    color: #ffd700;
    padding: 2px 7px;
    border-radius: 6px;
    letter-spacing: 0.06em;
    border: 1px solid rgba(255, 215, 0, 0.3);
    text-transform: uppercase;
  }

  .brand-subtitle {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
  }
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;

  .section-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #ffd700;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 0.75rem 0.5rem 0.75rem;

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.06);
    transform: translateX(3px);
  }

  &.active {
    color: #ffffff;
    background: linear-gradient(90deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.03) 100%);
    border: 1px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

    .nav-icon {
      color: #ffd700;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 25%;
      height: 50%;
      width: 3px;
      background: #ffd700;
      border-radius: 0 4px 4px 0;
    }
  }

  .nav-icon {
    font-size: 18px;
    flex-shrink: 0;
    transition: color 0.2s ease;
  }

  .nav-text {
    white-space: nowrap;

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const SwitchPlayerBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 11px 16px;
  border-radius: 12px;
  background: rgba(29, 185, 84, 0.12);
  border: 1px solid rgba(29, 185, 84, 0.3);
  color: #1db954;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-color);
    color: #000000;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(29, 185, 84, 0.35);
  }

  @media (max-width: 768px) {
    padding: 10px 0;
    span { display: none; }
  }
`;

const BottomUserContainer = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f5af19, #f12711);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
    box-shadow: 0 0 10px rgba(245, 175, 25, 0.4);
  }

  .user-info {
    flex: 1;
    min-width: 0;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .username {
    font-size: 13px;
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-email {
    font-size: 11px;
    font-weight: 500;
    color: #ffd700;
    opacity: 0.85;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    margin-top: 2px;
    max-width: 140px;
  }

  .logout-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    padding: 6px;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      color: #fc3c44;
      background: rgba(252, 60, 68, 0.1);
    }

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 2rem 2.5rem;
  background: radial-gradient(circle at top right, rgba(29, 185, 84, 0.05) 0%, transparent 60%), #0d0d14;
`;

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);
  const { currentSong } = useContext(PlayerContext);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <LayoutContainer>
      <AdminSidebar $hasPlayer={!!currentSong}>
        <Brand to="/admin">
          <div className="brand-icon-wrapper">
            <FaCrown className="brand-icon" />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              MUSICBOX
              <span className="brand-badge">ADMIN</span>
            </div>
            <span className="brand-subtitle">Platform Management</span>
          </div>
        </Brand>

        <NavSection>
          <div className="section-label">
            <FaCrown /> Platform Operations
          </div>
          <NavList>
            <NavItem to="/admin" end>
              <FaChartBar className="nav-icon" />
              <span className="nav-text">Dashboard Analytics</span>
            </NavItem>
            <NavItem to="/admin/users">
              <FaUsers className="nav-icon" />
              <span className="nav-text">Manage Users</span>
            </NavItem>
            <NavItem to="/admin/songs">
              <FaMusic className="nav-icon" />
              <span className="nav-text">Manage Songs</span>
            </NavItem>
            <NavItem to="/admin/artists">
              <FaUserCheck className="nav-icon" />
              <span className="nav-text">Manage Artists</span>
            </NavItem>
            <NavItem to="/admin/albums">
              <FaCompactDisc className="nav-icon" />
              <span className="nav-text">Manage Albums</span>
            </NavItem>
          </NavList>
        </NavSection>

        <SwitchPlayerBtn onClick={() => navigate('/')}>
          <FaHeadphones />
          <span>Switch to Player</span>
        </SwitchPlayerBtn>

        <BottomUserContainer>
          <UserCard>
            <div className="avatar">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.username} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              ) : (
                user?.username ? user.username.charAt(0).toUpperCase() : 'A'
              )}
            </div>
            <div className="user-info">
              <div className="username">{user?.username || 'admin'}</div>
              <div className="user-email" title={user?.email || 'admin@musicbox.com'}>
                {user?.email || 'admin@musicbox.com'}
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Sign Out">
              <FaSignOutAlt />
            </button>
          </UserCard>
        </BottomUserContainer>
      </AdminSidebar>

      <MainContent>
        <Outlet />
      </MainContent>

      <Player />
      <AddToPlaylistModal />
    </LayoutContainer>
  );
};

export default AdminLayout;