import React, { useState } from 'react';
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

const FileInput = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FileName = styled.span`
  color: ${props => props.theme.colors.textSecondary};
`;

const CreateArtist = () => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    image: null
  });

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
      const response = await fetch(`${API_BASE}/api/admin/artists`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formDataToSend
      });

      if (response.ok) {
        window.location.href = '/admin/artists';
      } else {
        console.error('Error creating artist');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Create New Artist</Title>
        <Button variant="secondary" onClick={() => window.history.back()}>
          <FaArrowLeft /> Back
        </Button>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Bio</Label>
          <TextArea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Profile Image</Label>
          <FileInput>
            <Button variant="secondary" as="label">
              <FaUpload /> Choose Image
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
                required
              />
            </Button>
            <FileName>
              {formData.image ? formData.image.name : 'No file chosen'}
            </FileName>
          </FileInput>
        </FormGroup>

        <Button type="submit" variant="primary">
          Create Artist
        </Button>
      </Form>
    </Container>
  );
};

export default CreateArtist; 