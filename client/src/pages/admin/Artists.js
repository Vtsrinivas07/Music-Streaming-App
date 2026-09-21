import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { FaUserCheck, FaPlus } from 'react-icons/fa';
import { getArtists, deleteArtist, createArtist, updateArtist } from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import ArtistModal from '../../components/admin/ArtistModal';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  h1 {
    font-size: 1.85rem;
    font-weight: 800;
    color: #ffffff;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .badge {
    background: rgba(29, 185, 84, 0.15);
    color: var(--primary-color);
    border: 1px solid rgba(29, 185, 84, 0.3);
    font-size: 11px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
  }
`;

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1db954 0%, #169b45 100%);
  color: #000000;
  font-weight: 700;
  font-size: 13.5px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(29, 185, 84, 0.45);
  }
`;

const ArtistCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .artist-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    background: #202028;
    flex-shrink: 0;
  }

  .artist-name {
    font-weight: 700;
    color: #ffffff;
  }
`;

const CountBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #a0a0aa;
`;

const ErrorMessage = styled.div`
  color: #fc3c44;
  padding: 1rem 1.25rem;
  background: rgba(252, 60, 68, 0.1);
  border: 1px solid rgba(252, 60, 68, 0.25);
  border-radius: 10px;
  font-size: 13.5px;
`;

const DEFAULT_ARTIST_IMG = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300';

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchArtists = async () => {
      try {
        const data = await getArtists();
        setArtists(data);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [user, navigate]);

  const handleDelete = async (artist) => {
    if (window.confirm(`Are you sure you want to delete artist "${artist.name}"?`)) {
      try {
        await deleteArtist(artist._id);
        setArtists(artists.filter(a => a._id !== artist._id));
      } catch (error) {
        console.error('Error deleting artist:', error);
        setError('Failed to delete artist. Please try again.');
      }
    }
  };

  const handleEdit = (artist) => {
    setSelectedArtist(artist);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedArtist(null);
    setModalOpen(true);
  };

  const handleSave = async (artistData) => {
    try {
      if (!user || !user._id) {
        setError('You must be logged in to perform this action.');
        navigate('/login');
        return;
      }

      const data = {
        ...artistData,
        addedBy: user._id,
        genres: []
      };
      
      if (selectedArtist) {
        const updatedArtist = await updateArtist(selectedArtist._id, data);
        setArtists(artists.map(a => a._id === selectedArtist._id ? updatedArtist : a));
      } else {
        const newArtist = await createArtist(data);
        setArtists([...artists, newArtist]);
      }
      setModalOpen(false);
      setSelectedArtist(null);
      setError(null);
    } catch (error) {
      console.error('Error saving artist:', error);
      setError(error.message || 'Failed to save artist. Please try again.');
    }
  };

  const columns = [
    { 
      header: 'Name', 
      key: 'name',
      render: (a) => (
        <ArtistCell>
          <img 
            src={a.image || DEFAULT_ARTIST_IMG} 
            alt={a.name} 
            className="artist-avatar" 
            onError={(e) => { e.target.src = DEFAULT_ARTIST_IMG; }} 
          />
          <span className="artist-name">{a.name}</span>
        </ArtistCell>
      )
    },
    { 
      header: 'Bio', 
      key: 'bio',
      render: (a) => (
        <span style={{ color: '#a0a0aa', fontSize: '12.5px', maxWidth: '380px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {a.bio || '—'}
        </span>
      )
    },
    { 
      header: 'Songs', 
      key: 'songs',
      render: (a) => <CountBadge>{Array.isArray(a.songs) ? a.songs.length : 0} songs</CountBadge>
    },
    { 
      header: 'Albums', 
      key: 'albums',
      render: (a) => <CountBadge>{Array.isArray(a.albums) ? a.albums.length : 0} albums</CountBadge>
    },
  ];

  if (loading) {
    return <Container><div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading artists catalog...</div></Container>;
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <FaUserCheck style={{ color: 'var(--primary-color)', fontSize: '24px' }} />
          <h1>Artists</h1>
          <span className="badge">{artists.length} Verified Artists</span>
        </TitleWrapper>
        <AddButton onClick={handleCreate}>
          <FaPlus /> Add Artist
        </AddButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AdminTable
        columns={columns}
        data={artists}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <ArtistModal
          artist={selectedArtist}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setSelectedArtist(null);
          }}
        />
      )}
    </Container>
  );
};

export default Artists;