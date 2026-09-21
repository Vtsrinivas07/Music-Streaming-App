import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaRegImage, FaTimes } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #282828;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  padding: 24px;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #b3b3b3;
`;

const Input = styled.input`
  background-color: #3e3e3e;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 12px;
  color: white;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #1DB954;
  }
`;

const TextArea = styled.textarea`
  background-color: #3e3e3e;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 12px;
  color: white;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #1DB954;
  }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const ImagePreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 4px;
  background-color: #3e3e3e;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #3e3e3e;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  min-width: 120px;
  height: 120px;
  border: 1px dashed #b3b3b3;
  
  input {
    display: none;
  }
  
  svg {
    font-size: 24px;
    margin-bottom: 8px;
    color: #b3b3b3;
  }
  
  span {
    font-size: 12px;
    color: #b3b3b3;
    text-align: center;
  }
  
  &:hover {
    background-color: #4e4e4e;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: white;
  border: 1px solid #b3b3b3;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SaveButton = styled(Button)`
  background-color: #1DB954;
  color: white;
  
  &:hover {
    background-color: #1ed760;
  }
`;

const EditPlaylistModal = ({ playlist, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isPublic: true
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  useEffect(() => {
    if (playlist) {
      setFormData({
        name: playlist.name || '',
        description: playlist.description || '',
        imageUrl: playlist.imageUrl || '',
        isPublic: playlist.isPublic !== false
      });
      
      if (playlist.imageUrl) {
        setImagePreview(playlist.imageUrl);
      }
    }
  }, [playlist]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let imageUrl = formData.imageUrl;
    
    // In a real app, you would upload the image to a server/cloud storage here
    // and get back the URL to use
    if (imageFile) {
      // This is just a placeholder - in a real app, you'd handle the file upload here
      // and get back the URL to use
      console.log('Image would be uploaded here');
      imageUrl = imagePreview; // Using the data URL for demonstration
    }
    
    const playlistData = {
      ...formData,
      imageUrl
    };
    
    onSave(playlistData);
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{playlist ? 'Edit Playlist' : 'Create Playlist'}</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="My Awesome Playlist"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add an optional description"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Cover Image</Label>
            <ImageUploadContainer>
              <ImagePreview>
                {imagePreview ? (
                  <img src={imagePreview} alt="Playlist cover" />
                ) : (
                  <FaRegImage size={40} color="#b3b3b3" />
                )}
              </ImagePreview>
              
              <UploadButton>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <FaRegImage />
                <span>Choose image</span>
              </UploadButton>
            </ImageUploadContainer>
          </FormGroup>
          
          <FormGroup>
            <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              Make playlist public
            </Label>
          </FormGroup>
          
          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SaveButton type="submit">
              {playlist ? 'Save Changes' : 'Create'}
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditPlaylistModal; 