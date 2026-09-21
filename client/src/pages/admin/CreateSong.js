import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../../components/common/Button';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import { API_BASE } from '../../utils/apiUrl';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const FileInput = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FileName = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const CreateSong = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    lyrics: '',
    audioFile: null,
    coverImage: null
  });
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const [artistsRes, albumsRes] = await Promise.all([
          fetch(`${API_BASE}/api/admin/artists`, { headers }),
          fetch(`${API_BASE}/api/admin/albums`, { headers })
        ]);
        const artistsData = await artistsRes.json();
        const albumsData = await albumsRes.json();
        setArtists(Array.isArray(artistsData) ? artistsData : (artistsData?.data || []));
        setAlbums(Array.isArray(albumsData) ? albumsData : (albumsData?.data || []));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/admin/songs`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formDataToSend
      });

      if (response.ok) {
        // Redirect to songs list or show success message
        window.location.href = '/admin/songs';
      } else {
        console.error('Error creating song');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>Create New Song</Title>
        <Button variant="secondary" onClick={() => window.history.back()}>
          <FaArrowLeft /> Back
        </Button>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title</Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Artist</Label>
          <Select
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            required
          >
            <option value="">Select an artist</option>
            {artists.map(artist => (
              <option key={artist._id} value={artist._id}>
                {artist.name}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Album</Label>
          <Select
            name="album"
            value={formData.album}
            onChange={handleChange}
          >
            <option value="">Select an album (optional)</option>
            {albums.map(album => (
              <option key={album._id} value={album._id}>
                {album.title}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Duration (mm:ss)</Label>
          <Input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            pattern="[0-9]{1,2}:[0-9]{2}"
            placeholder="3:45"
          />
        </FormGroup>

        <FormGroup>
          <Label>Lyrics</Label>
          <TextArea
            name="lyrics"
            value={formData.lyrics}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Audio File</Label>
          <FileInput>
            <Button variant="secondary" as="label">
              <FaUpload /> Choose File
              <input
                type="file"
                name="audioFile"
                onChange={handleFileChange}
                accept="audio/*"
                style={{ display: 'none' }}
                required
              />
            </Button>
            <FileName>
              {formData.audioFile ? formData.audioFile.name : 'No file chosen'}
            </FileName>
          </FileInput>
        </FormGroup>

        <FormGroup>
          <Label>Cover Image</Label>
          <FileInput>
            <Button variant="secondary" as="label">
              <FaUpload /> Choose Image
              <input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </Button>
            <FileName>
              {formData.coverImage ? formData.coverImage.name : 'No file chosen'}
            </FileName>
          </FileInput>
        </FormGroup>

        <Button type="submit" variant="primary">
          Create Song
        </Button>
      </Form>
    </Container>
  );
};

export default CreateSong; 