import React from 'react';
import { styled } from '@mui/material/styles';
import NameTag from './NameTag';
import { IconButton } from '@mui/material';
import UseModal from '../../../../hooks/UseModal';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Box } from '@mui/system';

const CustomVideo = styled('video')(() => ({
  backgroundColor: 'black',
  height: '100%',
  width: '100%',
}));

const ModalButton = styled(IconButton)(() => ({
  position: 'absolute',
  zIndex: 2,
  bottom: 0,
  left: 0,
  margin: 5,
}));

const Video: React.FC<{ videoRef: React.MutableRefObject<HTMLVideoElement | null>; userId: string }> = ({
  videoRef,
  userId,
}) => {
  const { handleCloseModal, handleOpenModal, open } = UseModal();

  const fullScreen = {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    left: '0px',
    top: '0px',
    zIndex: 10000,
  };

  const normalScreen = {
    position: 'relative',
    height: '100%',
  };

  return (
    <Box sx={open ? fullScreen : normalScreen}>
      <CustomVideo ref={videoRef} autoPlay />
      <NameTag nameTag={userId} />
      <ModalButton
        size='small'
        color='primary'
        onClick={() => {
          open ? handleCloseModal() : handleOpenModal();
        }}
      >
        <FullscreenIcon />
      </ModalButton>
    </Box>
  );
};

export default Video;
