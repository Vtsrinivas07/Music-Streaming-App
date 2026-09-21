import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaMusic, FaPlus } from 'react-icons/fa';
import { getSongs, deleteSong, createSong, updateSong } from '../../services/adminService';
import { getArtists } from '../../services/adminService';
import { getAlbums } from '../../services/adminService';
import AdminTable from '../../components/admin/AdminTable';
import SongModal from '../../components/admin/SongModal';
import { usePlayer } from '../../context/PlayerContext';

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

const SongCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .song-cover {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    object-fit: cover;
    background: #1c1c24;
    flex-shrink: 0;
  }

  .song-meta {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .song-title {
    font-weight: 700;
    color: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const GenreBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #c0c0cc;
  white-space: nowrap;
`;

const ErrorMessage = styled.div`
  color: #fc3c44;
  padding: 1rem 1.25rem;
  background: rgba(252, 60, 68, 0.1);
  border: 1px solid rgba(252, 60, 68, 0.25);
  border-radius: 10px;
  font-size: 13.5px;
`;

const formatSongDuration = (secs) => {
  if (!secs) return '3:30';
  if (typeof secs === 'string' && secs.includes(':')) return secs;
  const num = parseInt(secs, 10) || 200;
  const m = Math.floor(num / 60);
  const s = num % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300';

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  const { playSong } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsData, artistsData, albumsData] = await Promise.all([
          getSongs(),
          getArtists(),
          getAlbums(),
        ]);
        setSongs(songsData);
        setArtists(artistsData);
        setAlbums(albumsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (song) => {
    if (window.confirm(`Are you sure you want to delete "${song.title}"?`)) {
      try {
        await deleteSong(song._id);
        setSongs(songs.filter(s => s._id !== song._id));
      } catch (error) {
        console.error('Error deleting song:', error);
        setError('Failed to delete song. Please try again.');
      }
    }
  };

  const handleEdit = (song) => {
    setSelectedSong(song);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedSong(null);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedSong) {
        const updatedSong = await updateSong(selectedSong._id, formData);
        setSongs(songs.map(s => 
          s._id === selectedSong._id ? updatedSong : s
        ));
      } else {
        const newSong = await createSong(formData);
        setSongs([...songs, newSong]);
      }
      setModalOpen(false);
      setSelectedSong(null);
    } catch (error) {
      throw new Error('Failed to save song. Please try again.');
    }
  };

  // Artist name resolver
  const resolveArtistName = (song) => {
    if (song.artist?.name) return song.artist.name;
    if (song.artistName) return song.artistName;
    const found = artists.find(a => a._id === (song.artist?._id || song.artist));
    return found ? found.name : '—';
  };

  // Album title resolver
  const resolveAlbumTitle = (song) => {
    if (song.album?.title) return song.album.title;
    if (song.albumName) return song.albumName;
    const found = albums.find(a => a._id === (song.album?._id || song.album));
    return found ? found.title : '—';
  };

  const columns = [
    { 
      header: 'Title', 
      key: 'title',
      render: (s) => (
        <SongCell 
          style={{ cursor: 'pointer' }}
          onClick={() => playSong(s)}
          title="Click to stream track"
        >
          <img 
            src={s.coverImage || DEFAULT_COVER} 
            alt={s.title} 
            className="song-cover" 
            onError={(e) => { e.target.src = DEFAULT_COVER; }} 
          />
          <div className="song-meta">
            <span className="song-title">{s.title}</span>
          </div>
        </SongCell>
      )
    },
    { 
      header: 'Artist', 
      key: 'artist',
      render: (s) => <span style={{ color: '#c4c4cc' }}>{resolveArtistName(s)}</span>
    },
    { 
      header: 'Album', 
      key: 'album',
      render: (s) => <span style={{ color: '#a0a0aa' }}>{resolveAlbumTitle(s)}</span>
    },
    { 
      header: 'Genre', 
      key: 'genre',
      render: (s) => <GenreBadge>{s.genre || 'Pop'}</GenreBadge>
    },
    { 
      header: 'Duration', 
      key: 'duration',
      render: (s) => (
        <span style={{ color: '#8e8e93', fontVariantNumeric: 'tabular-nums', fontWeight: '600' }}>
          {formatSongDuration(s.duration)}
        </span>
      )
    },
  ];

  if (loading) {
    return <Container><div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading music catalog...</div></Container>;
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <FaMusic style={{ color: 'var(--primary-color)', fontSize: '24px' }} />
          <h1>Songs</h1>
          <span className="badge">{songs.length} Tracks in Library</span>
        </TitleWrapper>
        <AddButton onClick={handleCreate}>
          <FaPlus /> Add Song
        </AddButton>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AdminTable
        columns={columns}
        data={songs}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <SongModal
          song={selectedSong}
          artists={artists}
          albums={albums}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setSelectedSong(null);
          }}
        />
      )}
    </Container>
  );
};

export default Songs;