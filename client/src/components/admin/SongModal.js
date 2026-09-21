import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../common/Button';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.background};
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  color: ${props => props.theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const FileInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  input[type="file"] {
    display: none;
  }
`;

const FileInputButton = styled(Button)`
  width: fit-content;
`;

const FileName = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.text};
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SongModal = ({ song, artists, albums, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    genre: '',
    releaseDate: '',
    featured: false,
    audioFile: null,
    coverImage: null,
  });
  const [error, setError] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [imageFileName, setImageFileName] = useState('');

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title || '',
        artist: song.artist?._id || '',
        album: song.album?._id || '',
        duration: song.duration || '',
        genre: song.genre || '',
        releaseDate: song.releaseDate ? new Date(song.releaseDate).toISOString().split('T')[0] : '',
        featured: song.featured || false,
        audioFile: null,
        coverImage: null,
      });
    }
  }, [song]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file,
      }));
      if (name === 'audioFile') {
        setAudioFileName(file ? file.name : '');
      } else if (name === 'coverImage') {
        setImageFileName(file ? file.name : '');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.artist) {
      setError('Title and artist are required');
      return;
    }

    if (!song && !formData.audioFile) {
      setError('Audio file is required for new songs');
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>{song ? 'Edit Song' : 'Create Song'}</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter song title"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="artist">Artist</Label>
            <Select
              id="artist"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
            >
              <option value="">Select Artist</option>
              {artists?.map(artist => (
                <option key={artist._id} value={artist._id}>
                  {artist.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="album">Album</Label>
            <Select
              id="album"
              name="album"
              value={formData.album}
              onChange={handleChange}
            >
              <option value="">Select Album</option>
              {albums?.map(album => (
                <option key={album._id} value={album._id}>
                  {album.title}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="genre">Genre</Label>
            <Input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="Enter genre"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="releaseDate">Release Date</Label>
            <Input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <Input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Featured Song
            </Label>
          </FormGroup>

          <FormGroup>
            <Label>Audio File</Label>
            <FileInput>
              <FileInputButton
                as="label"
                htmlFor="audioFile"
                variant="secondary"
              >
                Choose Audio File
              </FileInputButton>
              <Input
                type="file"
                id="audioFile"
                name="audioFile"
                accept="audio/*"
                onChange={handleChange}
              />
              {audioFileName && <FileName>{audioFileName}</FileName>}
            </FileInput>
          </FormGroup>

          <FormGroup>
            <Label>Cover Image</Label>
            <FileInput>
              <FileInputButton
                as="label"
                htmlFor="coverImage"
                variant="secondary"
              >
                Choose Cover Image
              </FileInputButton>
              <Input
                type="file"
                id="coverImage"
                name="coverImage"
                accept="image/*"
                onChange={handleChange}
              />
              {imageFileName && <FileName>{imageFileName}</FileName>}
            </FileInput>
          </FormGroup>

          {error && <ErrorText>{error}</ErrorText>}

          <ButtonGroup>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {song ? 'Save Changes' : 'Create Song'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SongModal; 