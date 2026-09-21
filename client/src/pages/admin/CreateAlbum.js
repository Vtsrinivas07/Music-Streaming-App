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

const CreateAlbum = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    releaseDate: '',
    description: '',
    coverImage: null
  });
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_BASE}/api/admin/artists`, { headers });
        const data = await response.json();
        setArtists(Array.isArray(data) ? data : (data?.data || []));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setLoading(false);
      }
    };

    fetchArtists();
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
      const response = await fetch(`${API_BASE}/api/admin/albums`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formDataToSend
      });

      if (response.ok) {
        window.location.href = '/admin/albums';
      } else {
        console.error('Error creating album');
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
        <Title>Create New Album</Title>
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
          <Label>Release Date</Label>
          <Input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
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
                required
              />
            </Button>
            <FileName>
              {formData.coverImage ? formData.coverImage.name : 'No file chosen'}
            </FileName>
          </FileInput>
        </FormGroup>

        <Button type="submit" variant="primary">
          Create Album
        </Button>
      </Form>
    </Container>
  );
};

export default CreateAlbum; 