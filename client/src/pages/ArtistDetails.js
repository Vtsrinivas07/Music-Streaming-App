import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import SongList from '../components/songs/SongList';
import { Button } from '../components/common/Button';
import { FaPlay, FaPause, FaHeart, FaRegHeart } from 'react-icons/fa';
import AlbumGrid from '../components/albums/AlbumGrid';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ArtistHeader = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ArtistImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
`;

const ArtistInfo = styled.div`
  flex: 1;
`;

const ArtistName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Bio = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.error};
`;

const ArtistDetails = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/artists/${id}`);
        if (!response.ok) throw new Error('Failed to fetch artist');
        const data = await response.json();
        setArtist(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) {
    return <LoadingContainer>Loading artist details...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>Error: {error}</ErrorContainer>;
  }

  if (!artist) {
    return <ErrorContainer>Artist not found</ErrorContainer>;
  }

  return (
    <Container>
      <ArtistHeader>
        <ArtistImage src={artist.image} alt={artist.name} />
        <ArtistInfo>
          <ArtistName>{artist.name}</ArtistName>
          <Bio>{artist.bio}</Bio>
          <Stats>
            <StatItem>
              <StatValue>{artist.songs?.length || 0}</StatValue>
              <StatLabel>Songs</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{artist.albums?.length || 0}</StatValue>
              <StatLabel>Albums</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{artist.followers || 0}</StatValue>
              <StatLabel>Followers</StatLabel>
            </StatItem>
          </Stats>
          <ActionButtons>
            <Button variant="primary" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <FaPause /> : <FaPlay />}
              {isPlaying ? 'Pause' : 'Play All'}
            </Button>
            <Button
              variant={isLiked ? 'danger' : 'secondary'}
              onClick={() => setIsLiked(!isLiked)}
            >
              {isLiked ? <FaHeart /> : <FaRegHeart />}
              {isLiked ? 'Liked' : 'Like'}
            </Button>
          </ActionButtons>
        </ArtistInfo>
      </ArtistHeader>

      <SectionTitle>Popular Songs</SectionTitle>
      <SongList songs={artist.songs || []} />

      <SectionTitle>Albums</SectionTitle>
      <AlbumGrid albums={artist.albums || []} />
    </Container>
  );
};

export default ArtistDetails; 