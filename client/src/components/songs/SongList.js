import React from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaPlus } from 'react-icons/fa';
import { usePlayer } from '../../context/PlayerContext';

const TableContainer = styled.div`
  width: 100%;
  border-radius: 16px;
  background: rgba(20, 20, 28, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem 1.25rem;
  text-align: left;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
`;

const Tr = styled.tr`
  transition: background 0.2s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.06);

    .play-overlay-btn {
      opacity: 1;
    }

    .track-index {
      display: none;
    }
  }

  &.active-row {
    background: rgba(29, 185, 84, 0.08);

    .song-title {
      color: var(--primary-color);
    }
  }
`;

const Td = styled.td`
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  font-size: 14px;
  vertical-align: middle;
`;

const IndexCell = styled.div`
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-weight: 600;
  color: var(--text-muted);

  .play-overlay-btn {
    display: none;
    background: none;
    border: none;
    color: #ffffff;
    font-size: 13px;
    cursor: pointer;
  }

  ${Tr}:hover & {
    .track-index {
      display: none;
    }
    .play-overlay-btn {
      display: block;
    }
  }
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const CoverImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  background-color: #222;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
`;

const SongTitle = styled.div`
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
  font-size: 14.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 320px;
`;

const ArtistName = styled.div`
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.15);
  }

  &.liked {
    color: #fc3c44;
  }
`;

const EqualizerMini = styled.div`
  display: inline-flex;
  align-items: flex-end;
  height: 14px;
  gap: 2px;
`;

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300';

const formatDurationDisplay = (dur) => {
  if (!dur) return '3:20';
  if (typeof dur === 'string' && dur.includes(':')) return dur;
  const num = parseInt(dur, 10);
  if (isNaN(num)) return '3:20';
  const min = Math.floor(num / 60);
  const sec = num % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const SongList = ({ songs = [] }) => {
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    pauseSong, 
    isLiked, 
    toggleLikeSong, 
    openAddToPlaylist 
  } = usePlayer();

  const handlePlayPause = (song) => {
    if (currentSong?._id === song._id && isPlaying) {
      pauseSong();
    } else {
      playSong(song, songs);
    }
  };

  const getImageSrc = (song) => {
    if (!song.coverImage) return DEFAULT_COVER;
    if (song.coverImage.startsWith('http')) return song.coverImage;
    if (song.coverImage.startsWith('/uploads')) return song.coverImage;
    if (song.coverImage.startsWith('uploads/')) return `/${song.coverImage}`;
    return `/uploads/${song.coverImage}`;
  };

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th style={{ width: '50px' }}>#</Th>
            <Th>Track</Th>
            <Th>Album</Th>
            <Th>Duration</Th>
            <Th style={{ width: '130px', textAlign: 'center' }}>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => {
            const isCurrent = currentSong?._id === song._id;
            const isCurrentPlaying = isCurrent && isPlaying;
            const isSongLiked = isLiked(song._id || song.id);

            return (
              <Tr 
                key={song._id || song.id || index}
                className={isCurrent ? 'active-row' : ''}
                onClick={() => handlePlayPause(song)}
              >
                <Td>
                  <IndexCell>
                    {isCurrentPlaying ? (
                      <EqualizerMini>
                        <span className="equalizer-bar" />
                        <span className="equalizer-bar" />
                        <span className="equalizer-bar" />
                      </EqualizerMini>
                    ) : (
                      <>
                        <span className="track-index">{index + 1}</span>
                        <button className="play-overlay-btn" title="Play">
                          <FaPlay />
                        </button>
                      </>
                    )}
                  </IndexCell>
                </Td>
                <Td>
                  <SongInfo>
                    <CoverImage
                      src={getImageSrc(song)}
                      alt={song.title}
                      onError={(e) => { e.target.src = DEFAULT_COVER; }}
                    />
                    <div>
                      <SongTitle className="song-title">{song.title}</SongTitle>
                      <ArtistName>{song.artist?.name || song.artistName || 'Unknown Artist'}</ArtistName>
                    </div>
                  </SongInfo>
                </Td>
                <Td>{song.album?.title || song.albumName || 'Single'}</Td>
                <Td>{formatDurationDisplay(song.duration)}</Td>
                <Td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <ActionButton 
                      className={isSongLiked ? 'liked' : ''}
                      onClick={() => toggleLikeSong(song)}
                      title={isSongLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
                    >
                      {isSongLiked ? <FaHeart /> : <FaRegHeart />}
                    </ActionButton>

                    <ActionButton
                      onClick={() => openAddToPlaylist(song)}
                      title="Add to playlist"
                    >
                      <FaPlus />
                    </ActionButton>

                    <ActionButton 
                      onClick={() => handlePlayPause(song)}
                      title={isCurrentPlaying ? 'Pause' : 'Play'}
                    >
                      {isCurrentPlaying ? <FaPause /> : <FaPlay />}
                    </ActionButton>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default SongList;