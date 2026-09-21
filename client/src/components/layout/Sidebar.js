import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaHome, 
  FaSearch, 
  FaMusic, 
  FaHeart, 
  FaListUl, 
  FaUser, 
  FaSignOutAlt, 
  FaCompass,
  FaCompactDisc,
  FaChartBar,
  FaCrown,
  FaUsers,
  FaUserCheck
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { PlayerContext } from '../../context/PlayerContext';

const SidebarContainer = styled.aside`
  width: 250px;
  background: rgba(12, 12, 18, 0.95);
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
    background: linear-gradient(135deg, #fc3c44 0%, #b8336a 50%, #1db954 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(252, 60, 68, 0.35);
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
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.03em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .brand-badge {
    font-size: 9px;
    font-weight: 700;
    background: rgba(29, 185, 84, 0.2);
    color: #1db954;
    padding: 2px 6px;
    border-radius: 6px;
    letter-spacing: 0.05em;
    border: 1px solid rgba(29, 185, 84, 0.3);
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
    color: var(--text-muted);
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
    background: linear-gradient(90deg, rgba(29, 185, 84, 0.18) 0%, rgba(29, 185, 84, 0.04) 100%);
    border: 1px solid rgba(29, 185, 84, 0.25);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

    .nav-icon {
      color: var(--primary-color);
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 25%;
      height: 50%;
      width: 3px;
      background: var(--primary-color);
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
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;

    &.admin-avatar {
      background: linear-gradient(135deg, #f5af19, #f12711);
      box-shadow: 0 0 10px rgba(245, 175, 25, 0.4);
    }
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
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    margin-top: 2px;
    font-weight: 500;
    max-width: 140px;
  }

  .logout-btn {
    color: var(--text-muted);
    padding: 6px;
    border-radius: 6px;

    &:hover {
      color: #fc3c44;
      background: rgba(252, 60, 68, 0.1);
    }

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const SignInButton = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1db954 0%, #169b45 100%);
  color: #000000;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(29, 185, 84, 0.45);
  }

  @media (max-width: 768px) {
    padding: 10px 0;
    span { display: none; }
  }
`;

const Sidebar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { currentSong } = useContext(PlayerContext);
  const isAdmin = user?.role === 'admin' || user?.username?.toLowerCase() === 'admin';

  return (
    <SidebarContainer $hasPlayer={!!currentSong}>
      <Brand to="/">
        <div className="brand-icon-wrapper">
          <FaMusic className="brand-icon" />
        </div>
        <div className="brand-text">
          <div className="brand-title">
            MUSICBOX
          </div>
          <span className="brand-subtitle">Stream Global Music</span>
        </div>
      </Brand>

      {isAdmin ? (
        <>
          <NavSection>
            <div className="section-label" style={{ color: '#ffd700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaCrown style={{ color: '#ffd700' }} /> Platform Admin
            </div>
            <NavList>
              <NavItem to="/admin" end>
                <FaChartBar className="nav-icon" style={{ color: '#ffd700' }} />
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

          <NavSection>
            <div className="section-label">Player Preview</div>
            <NavList>
              <NavItem to="/" end>
                <FaHome className="nav-icon" />
                <span className="nav-text">Stream Player</span>
              </NavItem>
              <NavItem to="/browse">
                <FaCompass className="nav-icon" />
                <span className="nav-text">Browse 80M+ Hits</span>
              </NavItem>
              <NavItem to="/profile">
                <FaUser className="nav-icon" />
                <span className="nav-text">Admin Profile</span>
              </NavItem>
            </NavList>
          </NavSection>
        </>
      ) : (
        <>
          <NavSection>
            <div className="section-label">Discover</div>
            <NavList>
              <NavItem to="/" end>
                <FaHome className="nav-icon" />
                <span className="nav-text">Home</span>
              </NavItem>
              <NavItem to="/browse">
                <FaCompass className="nav-icon" />
                <span className="nav-text">Browse Genres</span>
              </NavItem>
              <NavItem to="/search">
                <FaSearch className="nav-icon" />
                <span className="nav-text">Search Hits</span>
              </NavItem>
            </NavList>
          </NavSection>

          <NavSection>
            <div className="section-label">Your Library</div>
            <NavList>
              <NavItem to="/playlists">
                <FaListUl className="nav-icon" />
                <span className="nav-text">Playlists</span>
              </NavItem>
              <NavItem to="/favorites">
                <FaHeart className="nav-icon" />
                <span className="nav-text">Liked Songs</span>
              </NavItem>
              {user && (
                <NavItem to="/profile">
                  <FaUser className="nav-icon" />
                  <span className="nav-text">Profile</span>
                </NavItem>
              )}
            </NavList>
          </NavSection>
        </>
      )}

      <BottomUserContainer>
        {user ? (
          <UserCard>
            <div className={`avatar ${isAdmin ? 'admin-avatar' : ''}`}>
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.username} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              ) : (
                user.username ? user.username.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <div className="user-info">
              <div className="username">{user.username}</div>
              <div className="user-email" title={user.email || (isAdmin ? 'admin@musicbox.com' : 'user@musicbox.com')}>
                {user.email || (isAdmin ? 'admin@musicbox.com' : 'user@musicbox.com')}
              </div>
            </div>
            <button className="logout-btn" onClick={logoutUser} title="Sign Out">
              <FaSignOutAlt />
            </button>
          </UserCard>
        ) : (
          <SignInButton to="/login">
            <FaUser />
            <span>Sign In</span>
          </SignInButton>
        )}
      </BottomUserContainer>
    </SidebarContainer>
  );
};

export default Sidebar;