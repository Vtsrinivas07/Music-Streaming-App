import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { PlayerContext } from '../../context/PlayerContext';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp, 
  FaVolumeMute, 
  FaHeart,
  FaRandom,
  FaRedoAlt,
  FaPlus
} from 'react-icons/fa';

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 94px;
  background: rgba(14, 14, 20, 0.92);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  z-index: 1000;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    padding: 0 14px;
    height: 84px;
  }
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 28%;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 45%;
    min-width: 140px;
    gap: 10px;
  }
`;

const SongImage = styled.img`
  width: 58px;
  height: 58px;
  border-radius: 10px;
  object-fit: cover;
  background-color: #202028;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
  transition: transform 0.2s ease;

  @media (max-width: 768px) {
    width: 46px;
    height: 46px;
  }
`;

const SongDetails = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
`;

const SongTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SongTitle = styled.div`
  font-size: 14.5px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
`;

const SongArtist = styled.div`
  font-size: 12.5px;
  color: var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  max-width: 580px;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 6px;

  @media (max-width: 576px) {
    gap: 10px;
  }
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    transform: scale(1.15);
  }

  &.play-pause {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #ffffff;
    color: #000000;
    font-size: 16px;
    box-shadow: 0 4px 18px rgba(255, 255, 255, 0.25);

    &:hover {
      background: var(--primary-color);
      color: #000000;
      transform: scale(1.08);
      box-shadow: 0 4px 20px var(--primary-glow);
    }
  }

  &.secondary-btn {
    font-size: 13px;
    color: var(--text-muted);
    position: relative;
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const ActiveDot = styled.span`
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--primary-color);
  box-shadow: 0 0 6px var(--primary-glow);
`;

const RepeatOneBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -6px;
  font-size: 9px;
  font-weight: 800;
  color: var(--primary-color);
  line-height: 1;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const ProgressBarWrapper = styled.div`
  height: 16px;
  flex: 1;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;

  &:hover .progress-fill {
    background: var(--primary-color);
  }

  &:hover .progress-thumb {
    opacity: 1;
  }
`;

const ProgressBarTrack = styled.div`
  height: 4px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #ffffff;
  border-radius: 3px;
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
`;

const TimeDisplay = styled.span`
  font-size: 11.5px;
  color: var(--text-muted);
  font-weight: 600;
  min-width: 36px;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 28%;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: auto;
  }
`;

const AudioBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: ${props => props.$isFull ? '#00f2fe' : 'var(--primary-color)'};
  background: ${props => props.$isFull ? 'rgba(0, 242, 254, 0.12)' : 'rgba(29, 185, 84, 0.12)'};
  border: 1px solid ${props => props.$isFull ? 'rgba(0, 242, 254, 0.35)' : 'rgba(29, 185, 84, 0.25)'};
  padding: 2px 7px;
  border-radius: 6px;
  text-transform: uppercase;

  @media (max-width: 900px) {
    display: none;
  }
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 90px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.18);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    transition: transform 0.1s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.3);
    background: var(--primary-color);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const LikeButton = styled.button`
  background: none;
  border: none;
  color: ${props => (props.liked ? '#fc3c44' : 'var(--text-muted)')};
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: #fc3c44;
    transform: scale(1.2);
  }
`;

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300';

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolumeLevel,
    isLiked,
    toggleLikeSong,
    openAddToPlaylist,
    isShuffle,
    repeatMode,
    toggleShuffle,
    toggleRepeat,
  } = useContext(PlayerContext);
  
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume || 1);

  const songIsLiked = isLiked(currentSong?._id || currentSong?.id);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const clickPercentage = clickPosition / rect.width;
    const seekTime = duration * clickPercentage;
    seekTo(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (setVolumeLevel) setVolumeLevel(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      if (setVolumeLevel) setVolumeLevel(prevVolume > 0 ? prevVolume : 0.8);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      if (setVolumeLevel) setVolumeLevel(0);
      setIsMuted(true);
    }
  };

  const handleLikeToggle = () => {
    if (currentSong) {
      toggleLikeSong(currentSong);
    }
  };

  if (!currentSong) return null;

  const getImageSrc = () => {
    const img = currentSong.coverImage || currentSong.image;
    if (!img) return DEFAULT_COVER;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/uploads')) return img;
    if (img.startsWith('uploads/')) return `/${img}`;
    return `/uploads/${img}`;
  };

  return (
    <PlayerContainer>
      <SongInfo>
        <SongImage 
          src={getImageSrc()} 
          alt={currentSong.title}
          onError={(e) => { e.target.src = DEFAULT_COVER; }}
        />
        <SongDetails>
          <SongTitleRow>
            <SongTitle title={currentSong.title}>{currentSong.title}</SongTitle>
            {isPlaying && (
              <span className="equalizer-bar" style={{ height: 10, width: 2, background: 'var(--primary-color)' }} />
            )}
          </SongTitleRow>
          <SongArtist>{currentSong.artist?.name || currentSong.artistName || 'Unknown Artist'}</SongArtist>
        </SongDetails>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <LikeButton 
            onClick={handleLikeToggle} 
            liked={songIsLiked} 
            title={songIsLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          >
            <FaHeart />
          </LikeButton>
          <LikeButton 
            onClick={() => openAddToPlaylist(currentSong)} 
            title="Add to Playlist"
            style={{ fontSize: '14px' }}
          >
            <FaPlus />
          </LikeButton>
        </div>
      </SongInfo>

      <Controls>
        <ControlButtons>
          <ControlButton 
            className="secondary-btn" 
            onClick={toggleShuffle} 
            title={isShuffle ? "Shuffle On" : "Shuffle Off"}
            style={{ 
              color: isShuffle ? 'var(--primary-color)' : undefined, 
              position: 'relative' 
            }}
          >
            <FaRandom />
            {isShuffle && <ActiveDot />}
          </ControlButton>
          <ControlButton onClick={playPrevious} title="Previous">
            <FaStepBackward />
          </ControlButton>
          <ControlButton className="play-pause" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <FaPause /> : <FaPlay style={{ marginLeft: 2 }} />}
          </ControlButton>
          <ControlButton onClick={playNext} title="Next">
            <FaStepForward />
          </ControlButton>
          <ControlButton 
            className="secondary-btn" 
            onClick={toggleRepeat} 
            title={repeatMode === 'one' ? "Repeat One" : repeatMode === 'all' ? "Repeat All" : "Repeat Off"}
            style={{ 
              color: repeatMode !== 'off' ? 'var(--primary-color)' : undefined, 
              position: 'relative' 
            }}
          >
            <FaRedoAlt />
            {repeatMode === 'one' && <RepeatOneBadge>1</RepeatOneBadge>}
            {repeatMode !== 'off' && <ActiveDot />}
          </ControlButton>
        </ControlButtons>

        <ProgressContainer>
          <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
          <ProgressBarWrapper onClick={handleProgressClick}>
            <ProgressBarTrack>
              <ProgressFill className="progress-fill" progress={progress} />
            </ProgressBarTrack>
          </ProgressBarWrapper>
          <TimeDisplay>{formatTime(duration)}</TimeDisplay>
        </ProgressContainer>
      </Controls>

      <VolumeContainer>
        <AudioBadge $isFull={currentSong.isFullSong}>
          {currentSong.quality || (currentSong.isFullSong ? '320kbps HQ' : 'HQ')}
        </AudioBadge>
        <ControlButton onClick={handleVolumeToggle} title={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </ControlButton>
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
        />
      </VolumeContainer>
    </PlayerContainer>
  );
};

export default MusicPlayer;