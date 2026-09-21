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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  min-height: 100px;
  resize: vertical;
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

const ArtistModal = ({ artist, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [imageFileName, setImageFileName] = useState('');

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name || '',
        bio: artist.bio || '',
        image: null,
      });
    }
  }, [artist]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file,
      }));
      setImageFileName(file ? file.name : '');
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
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
        <Title>{artist ? 'Edit Artist' : 'Create Artist'}</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter artist name"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="bio">Bio</Label>
            <TextArea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Enter artist bio"
            />
          </FormGroup>

          <FormGroup>
            <Label>Profile Image</Label>
            <FileInput>
              <FileInputButton
                as="label"
                htmlFor="image"
                variant="secondary"
              >
                Choose Image
              </FileInputButton>
              <Input
                type="file"
                id="image"
                name="image"
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
              {artist ? 'Save Changes' : 'Create Artist'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ArtistModal; 