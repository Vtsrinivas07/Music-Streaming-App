import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  FaEnvelope, 
  FaShieldAlt, 
  FaCalendarAlt, 
  FaCamera, 
  FaTimes, 
  FaCheck, 
  FaUpload, 
  FaLink, 
  FaCrown 
} from 'react-icons/fa';
import PlaylistGrid from '../components/playlists/PlaylistGrid';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding-bottom: 3rem;
`;

const ProfileCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 1.75rem;
    gap: 1.5rem;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const AvatarWrapper = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1db954 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  font-weight: 800;
  color: #000000;
  box-shadow: 0 10px 30px rgba(29, 185, 84, 0.35);
  border: 4px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const EditAvatarBadge = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--primary-color);
  color: #000000;
  border: 3px solid #121212;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(29, 185, 84, 0.5);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: #1ed760;
  }
`;

const Info = styled.div`
  flex: 1;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: ${props => props.isAdmin ? 'rgba(255, 215, 0, 0.15)' : 'rgba(29, 185, 84, 0.15)'};
  color: ${props => props.isAdmin ? '#ffd700' : '#1db954'};
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid ${props => props.isAdmin ? 'rgba(255, 215, 0, 0.3)' : 'rgba(29, 185, 84, 0.3)'};
  margin-bottom: 0.75rem;
`;

const Username = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const MetaGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1.25rem;
  color: var(--text-secondary);
  font-size: 13.5px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: var(--text-muted);
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
`;

// Modal Styling
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #181822;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 2rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-size: 1.3rem;
    font-weight: 800;
    color: #ffffff;
  }

  button {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 18px;
    cursor: pointer;
    &:hover { color: #ffffff; }
  }
`;

const PreviewAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  .preview-img {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--primary-color);
    box-shadow: 0 0 20px rgba(29, 185, 84, 0.3);
  }
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 8px 0;
`;

const PresetItem = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 3px solid ${props => props.selected ? 'var(--primary-color)' : 'transparent'};
  transition: all 0.2s ease;
  box-shadow: ${props => props.selected ? '0 0 12px var(--primary-color)' : 'none'};

  &:hover {
    transform: scale(1.08);
    border-color: var(--primary-color);
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  input {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    padding: 10px 14px;
    color: #ffffff;
    font-size: 14px;
    outline: none;

    &:focus {
      border-color: var(--primary-color);
    }
  }
`;

const FileUploadBtn = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px dashed rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  padding: 12px;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: var(--primary-color);
  }

  input {
    display: none;
  }
`;

const SaveBtn = styled.button`
  background: var(--primary-color);
  color: #000000;
  border: none;
  border-radius: 30px;
  padding: 12px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 18px rgba(29, 185, 84, 0.4);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #1ed760;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Curated avatar presets
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'
];

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const [profile, setProfile] = useState(currentUser || null);
  const [loading, setLoading] = useState(!currentUser);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (id) {
          const res = await axios.get(`/api/users/${id}`);
          setProfile(res.data.data || res.data);
        } else if (currentUser) {
          setProfile(currentUser);
        }
      } catch (err) {
        if (currentUser) {
          setProfile(currentUser);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id, currentUser]);

  const activeUser = profile || currentUser;

  useEffect(() => {
    if (activeUser?.profilePicture) {
      setSelectedAvatar(activeUser.profilePicture);
    }
  }, [activeUser]);

  if (loading && !activeUser) {
    return <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading user profile...</div>;
  }

  if (!activeUser) {
    return (
      <Container>
        <ProfileCard>
          <Info>
            <Username>User Profile</Username>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Please sign in to view your account details and customized music preferences.
            </p>
          </Info>
        </ProfileCard>
      </Container>
    );
  }

  const isAdmin = activeUser.role === 'admin' || activeUser.username?.toLowerCase() === 'admin';
  const avatarUrl = activeUser.profilePicture || activeUser.avatar || selectedAvatar;
  const initial = (activeUser.username || 'U').charAt(0).toUpperCase();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedAvatar(reader.result);
      setCustomUrl('');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url) => {
    setSelectedAvatar(url);
    setCustomUrl('');
  };

  const handleCustomUrlChange = (e) => {
    const url = e.target.value;
    setCustomUrl(url);
    if (url.trim()) {
      setSelectedAvatar(url.trim());
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) return;
    setSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({ profilePicture: selectedAvatar });
      } else {
        await axios.put('/api/users/profile', { profilePicture: selectedAvatar });
      }
      setProfile(prev => ({ ...prev, profilePicture: selectedAvatar }));
      setSuccessMsg('Profile picture updated successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        setShowModal(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to update avatar:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <ProfileCard>
        <AvatarContainer>
          <AvatarWrapper>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={activeUser.username} 
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
            ) : (
              initial
            )}
          </AvatarWrapper>
          <EditAvatarBadge onClick={() => setShowModal(true)} title="Edit Profile Picture">
            <FaCamera />
          </EditAvatarBadge>
        </AvatarContainer>

        <Info>
          <RoleBadge isAdmin={isAdmin}>
            {isAdmin ? <FaCrown /> : <FaShieldAlt />}
            {isAdmin ? 'PLATFORM ADMIN' : 'LISTENER ACCOUNT'}
          </RoleBadge>
          <Username>{activeUser.username}</Username>
          <MetaGrid>
            <MetaItem>
              <FaEnvelope />
              <span>{activeUser.email || `${activeUser.username}@musicbox.com`}</span>
            </MetaItem>
            <MetaItem>
              <FaCalendarAlt />
              <span>MUSICBOX Member since {new Date().getFullYear()}</span>
            </MetaItem>
          </MetaGrid>
        </Info>
      </ProfileCard>

      {activeUser.playlists && activeUser.playlists.length > 0 && (
        <Section>
          <SectionTitle>Your Playlists</SectionTitle>
          <PlaylistGrid playlists={activeUser.playlists} />
        </Section>
      )}

      {/* Edit Profile Picture Modal */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Edit Profile Picture</h3>
              <button onClick={() => setShowModal(false)}><FaTimes /></button>
            </ModalHeader>

            <PreviewAvatar>
              <img 
                className="preview-img" 
                src={selectedAvatar || PRESET_AVATARS[0]} 
                alt="Preview" 
                onError={(e) => { e.target.src = PRESET_AVATARS[0]; }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Avatar Preview</span>
            </PreviewAvatar>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Choose Avatar Preset:
              </span>
              <PresetGrid>
                {PRESET_AVATARS.map((pUrl, idx) => (
                  <PresetItem 
                    key={idx}
                    src={pUrl}
                    selected={selectedAvatar === pUrl}
                    onClick={() => handleSelectPreset(pUrl)}
                    alt={`Preset ${idx + 1}`}
                  />
                ))}
              </PresetGrid>
            </div>

            <InputGroup>
              <label><FaLink style={{ marginRight: '6px' }} /> Or Enter Image URL:</label>
              <input 
                type="text" 
                placeholder="https://images.unsplash.com/..." 
                value={customUrl}
                onChange={handleCustomUrlChange}
              />
            </InputGroup>

            <FileUploadBtn>
              <FaUpload /> Upload Image from Device
              <input type="file" accept="image/*" onChange={handleFileUpload} />
            </FileUploadBtn>

            {successMsg && (
              <div style={{ color: 'var(--primary-color)', fontSize: '13.5px', fontWeight: '700', textAlign: 'center' }}>
                <FaCheck style={{ marginRight: '6px' }} /> {successMsg}
              </div>
            )}

            <SaveBtn onClick={handleSaveAvatar} disabled={saving || !selectedAvatar}>
              <FaCheck /> {saving ? 'Saving Picture...' : 'Save Profile Picture'}
            </SaveBtn>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Profile;