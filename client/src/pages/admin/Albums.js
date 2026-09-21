import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCompactDisc, FaPlus } from 'react-icons/fa';
import { getAlbums, deleteAlbum, createAlbum, updateAlbum } from '../../services/adminService';
import { getArtists } from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import AlbumModal from '../../components/admin/AlbumModal';

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

const AlbumCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .album-cover {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    object-fit: cover;
    background: #1c1c24;
    flex-shrink: 0;
  }

  .album-title {
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const DEFAULT_ALBUM_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albumsData, artistsData] = await Promise.all([
          getAlbums(),
          getArtists(),
        ]);
        setAlbums(albumsData);
        setArtists(artistsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (album) => {
    if (window.confirm(`Are you sure you want to delete album "${album.title}"?`)) {
      try {
        await deleteAlbum(album._id);
        setAlbums(albums.filter(a => a._id !== album._id));
      } catch (error) {
        console.error('Error deleting album:', error);
        setError('Failed to delete album. Please try again.');
      }
    }
  };

  const handleEdit = (album) => {
    setSelectedAlbum(album);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedAlbum(null);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedAlbum) {
        const updatedAlbum = await updateAlbum(selectedAlbum._id, formData);
        setAlbums(albums.map(a => 
          a._id === selectedAlbum._id ? updatedAlbum : a
        ));
      } else {
        const newAlbum = await createAlbum(formData);
        setAlbums([...albums, newAlbum]);
      }
      setModalOpen(false);
      setSelectedAlbum(null);
    } catch (error) {
      throw new Error('Failed to save album. Please try again.');
    }
  };

  const resolveArtistName = (album) => {
    if (album.artist?.name) return album.artist.name;
    if (album.artistName) return album.artistName;
    const found = artists.find(a => a._id === (album.artist?._id || album.artist));
    return found ? found.name : '—';
  };

  const columns = [
    { 
      header: 'Title', 
      key: 'title',
      render: (a) => (
        <AlbumCell>
          <img 
            src={a.coverImage || DEFAULT_ALBUM_COVER} 
            alt={a.title} 
            className="album-cover" 
            onError={(e) => { e.target.src = DEFAULT_ALBUM_COVER; }} 
          />
          <span className="album-title">{a.title}</span>
        </AlbumCell>
      )
    },
    { 
      header: 'Artist', 
      key: 'artist',
      render: (a) => <span style={{ color: '#c4c4cc' }}>{resolveArtistName(a)}</span>
    },
    { 
      header: 'Release Date', 
      key: 'releaseDate',
      render: (a) => <span style={{ color: '#8e8e93', fontSize: '13px' }}>{formatDate(a.releaseDate)}</span>
    },
    { 
      header: 'Songs', 
      key: 'songs',
      render: (a) => <CountBadge>{Array.isArray(a.songs) ? a.songs.length : 0} songs</CountBadge>
    },
  ];

  if (loading) {
    return <Container><div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading albums catalog...</div></Container>;
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <FaCompactDisc style={{ color: 'var(--primary-color)', fontSize: '24px' }} />
          <h1>Albums</h1>
          <span className="badge">{albums.length} Official Albums</span>
        </TitleWrapper>
        <AddButton onClick={handleCreate}>
          <FaPlus /> Add Album
        </AddButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AdminTable
        columns={columns}
        data={albums}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <AlbumModal
          album={selectedAlbum}
          artists={artists}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setSelectedAlbum(null);
          }}
        />
      )}
    </Container>
  );
};

export default Albums;