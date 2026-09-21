import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import SongList from '../components/songs/SongList';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const AlbumCover = styled.div`
  width: 300px;
  height: 300px;
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Info = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
`;

const ArtistName = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await axios.get(`/api/albums/${id}`);
        setAlbum(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load album');
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!album) return <div>Album not found</div>;

  return (
    <Container>
      <Header>
        <AlbumCover>
          <img src={album.coverImage || '/default-album.jpg'} alt={album.title} />
        </AlbumCover>
        <Info>
          <Title>{album.title}</Title>
          <ArtistName>{album.artist?.name || 'Unknown Artist'}</ArtistName>
          <Description>{album.description}</Description>
          <MetaInfo>
            <span>{album.releaseDate}</span>
            <span>•</span>
            <span>{album.songs?.length || 0} songs</span>
          </MetaInfo>
        </Info>
      </Header>

      {album.songs && album.songs.length > 0 && (
        <SongList songs={album.songs} />
      )}
    </Container>
  );
};

export default AlbumDetails; 