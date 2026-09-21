import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/axios';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaMusic, 
  FaUserCheck, 
  FaCompactDisc, 
  FaListUl, 
  FaPlus, 
  FaShieldAlt, 
  FaCheckCircle 
} from 'react-icons/fa';

const DashboardContainer = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(29, 185, 84, 0.15);
  color: var(--primary-color);
  border: 1px solid rgba(29, 185, 84, 0.3);
  padding: 5px 14px;
  border-radius: 20px;

  span.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary-color);
    box-shadow: 0 0 10px var(--primary-color);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.75rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 14px 35px rgba(0, 0, 0, 0.45);
  }

  .stat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const StatIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${props => props.gradient || 'linear-gradient(135deg, #1db954, #1ed760)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #000000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const StatTitle = styled.h3`
  color: var(--text-muted);
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const StatValue = styled.h2`
  color: #ffffff;
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0;
`;

const StatNote = styled.span`
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
`;

const SectionHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-top: 1rem;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const ActionCard = styled(Link)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.75rem;
  border-radius: 20px;
  text-decoration: none;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 18px;
  transition: all 0.25s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);

  &:hover {
    transform: translateY(-4px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.04) 100%);
    border-color: ${props => props.accent || 'var(--primary-color)'};
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  }

  .action-icon-box {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: ${props => props.bg || 'rgba(29, 185, 84, 0.15)'};
    color: ${props => props.accent || 'var(--primary-color)'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  .action-text {
    display: flex;
    flex-direction: column;
    gap: 4px;

    h4 {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    span {
      font-size: 12px;
      color: var(--text-muted);
    }
  }
`;

const CatalogHubCard = styled.div`
  background: linear-gradient(135deg, rgba(29, 185, 84, 0.12) 0%, rgba(0, 242, 254, 0.05) 100%);
  border: 1px solid rgba(29, 185, 84, 0.25);
  border-radius: 22px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;

  .hub-info {
    h3 {
      font-size: 1.3rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 13.5px;
      max-width: 650px;
      line-height: 1.5;
    }
  }

  .hub-stats {
    display: flex;
    gap: 1.5rem;
    align-items: center;

    .hub-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      span.val {
        font-size: 22px;
        font-weight: 800;
        color: var(--primary-color);
      }
      span.lbl {
        font-size: 11px;
        color: var(--text-muted);
        text-transform: uppercase;
      }
    }
  }
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 2,
    totalSongs: 13,
    totalArtists: 5,
    totalAlbums: 5,
    totalPlaylists: 2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardContainer>
      <HeaderRow>
        <Title>
          <FaShieldAlt style={{ color: '#ffd700' }} />
          MUSICBOX Admin Console
        </Title>
        <LiveBadge>
          <span className="dot" /> Platform Telemetry Active
        </LiveBadge>
      </HeaderRow>

      {/* Global Catalog Integration Card */}
      <CatalogHubCard>
        <div className="hub-info">
          <h3>
            <FaCheckCircle style={{ color: 'var(--primary-color)' }} />
            80,000,000+ Song Catalog Online
          </h3>
          <p>
            Connected to high-definition 320kbps full-song streaming APIs across Tollywood, Bollywood, Kollywood, Hollywood, and global music. Local database songs & playlists are synced.
          </p>
        </div>
        <div className="hub-stats">
          <div className="hub-stat">
            <span className="val">80M+</span>
            <span className="lbl">API Tracks</span>
          </div>
          <div className="hub-stat">
            <span className="val">320kbps</span>
            <span className="lbl">Bitrate HQ</span>
          </div>
          <div className="hub-stat">
            <span className="val">100%</span>
            <span className="lbl">Uptime</span>
          </div>
        </div>
      </CatalogHubCard>

      <StatsGrid>
        <StatCard>
          <div className="stat-top">
            <StatTitle>Platform Users</StatTitle>
            <StatIcon gradient="linear-gradient(135deg, #4facfe, #00f2fe)">
              <FaUsers />
            </StatIcon>
          </div>
          <StatValue>{stats.totalUsers}</StatValue>
          <StatNote>Registered listeners & admins</StatNote>
        </StatCard>

        <StatCard>
          <div className="stat-top">
            <StatTitle>Platform Songs</StatTitle>
            <StatIcon gradient="linear-gradient(135deg, #f5af19, #f12711)">
              <FaMusic />
            </StatIcon>
          </div>
          <StatValue>{stats.totalSongs}</StatValue>
          <StatNote>Uploaded library tracks</StatNote>
        </StatCard>

        <StatCard>
          <div className="stat-top">
            <StatTitle>Artists Catalog</StatTitle>
            <StatIcon gradient="linear-gradient(135deg, #fc3c44, #b8336a)">
              <FaUserCheck />
            </StatIcon>
          </div>
          <StatValue>{stats.totalArtists}</StatValue>
          <StatNote>Verified platform musicians</StatNote>
        </StatCard>

        <StatCard>
          <div className="stat-top">
            <StatTitle>Curated Albums</StatTitle>
            <StatIcon gradient="linear-gradient(135deg, #8A2387, #E94057)">
              <FaCompactDisc />
            </StatIcon>
          </div>
          <StatValue>{stats.totalAlbums}</StatValue>
          <StatNote>Official album releases</StatNote>
        </StatCard>

        <StatCard>
          <div className="stat-top">
            <StatTitle>User Playlists</StatTitle>
            <StatIcon gradient="linear-gradient(135deg, #11998e, #38ef7d)">
              <FaListUl />
            </StatIcon>
          </div>
          <StatValue>{stats.totalPlaylists}</StatValue>
          <StatNote>Created listener collections</StatNote>
        </StatCard>
      </StatsGrid>

      <SectionHeader>Platform Operations</SectionHeader>
      <ActionsGrid>
        <ActionCard to="/admin/users" bg="rgba(79, 172, 254, 0.15)" accent="#4facfe">
          <div className="action-icon-box">
            <FaUsers />
          </div>
          <div className="action-text">
            <h4>Manage Users</h4>
            <span>View accounts & roles</span>
          </div>
        </ActionCard>

        <ActionCard to="/admin/songs/create" bg="rgba(245, 175, 25, 0.15)" accent="#f5af19">
          <div className="action-icon-box">
            <FaPlus />
          </div>
          <div className="action-text">
            <h4>Add New Song</h4>
            <span>Upload music file & artwork</span>
          </div>
        </ActionCard>

        <ActionCard to="/admin/artists/create" bg="rgba(252, 60, 68, 0.15)" accent="#fc3c44">
          <div className="action-icon-box">
            <FaUserCheck />
          </div>
          <div className="action-text">
            <h4>Add New Artist</h4>
            <span>Create verified musician</span>
          </div>
        </ActionCard>

        <ActionCard to="/admin/albums/create" bg="rgba(138, 35, 135, 0.15)" accent="#E94057">
          <div className="action-icon-box">
            <FaCompactDisc />
          </div>
          <div className="action-text">
            <h4>Add New Album</h4>
            <span>Release collection package</span>
          </div>
        </ActionCard>
      </ActionsGrid>
    </DashboardContainer>
  );
};

export default Dashboard;