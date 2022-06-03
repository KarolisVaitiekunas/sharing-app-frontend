import { Button, ButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useContext, useState } from 'react';
import { RoomContext } from '../../../../context/RoomContext';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicIcon from '@mui/icons-material/Mic';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const Buttons = styled(ButtonGroup)(() => ({
  margin: '0 auto 0 auto',
  zIndex: 0,
  position: 'relative',
}));

const ShareScreenButton: React.FC = () => {
  const [enabledScreen, setEnabledScreen] = useState(true);
  const [enabledAudio, setEnabledAudio] = useState(true);
  const [enabledCamera, setEnabledCamera] = useState(true);
  const { shareScreen, handleAudio, handleCamera, screenSharingId, me } = useContext(RoomContext);

  const handleEnableShareScreen = () => {
    shareScreen(enabledScreen);
    setEnabledScreen((state) => !state);
  };

  const handleEnableShareAudio = () => {
    handleAudio(!enabledAudio);
    setEnabledAudio((state) => !state);
  };

  const handleCameraShare = () => {
    handleCamera(!enabledCamera);
    setEnabledCamera((state) => !state);
  };

  return (
    <Buttons>
      <Button
        startIcon={screenSharingId !== me?.id ? <ScreenShareIcon /> : <StopScreenShareIcon />}
        variant='contained'
        onClick={handleEnableShareScreen}
      >
        Screen
      </Button>

      <Button
        startIcon={enabledAudio ? <MicIcon /> : <MicNoneIcon />}
        variant='contained'
        onClick={handleEnableShareAudio}
      >
        Mute
      </Button>
      <Button
        startIcon={enabledCamera ? <CameraAltIcon /> : <CameraEnhanceIcon />}
        variant='contained'
        onClick={handleCameraShare}
      >
        Camera
      </Button>
    </Buttons>
  );
};

export default ShareScreenButton;
