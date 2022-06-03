import React, { useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Video from './Video';

const Root = styled('div')(() => ({
  minHeight: 300,
  marginBottom: 10,
  marginTop: 10,
}));

const VideoPlayer: React.FC<{
  stream: MediaStream | null;
  isScreenSharing?: boolean;
  userId: string;
}> = ({ stream, userId }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <Root>
      <Video videoRef={videoRef} userId={userId} />
    </Root>
  );
};

export default VideoPlayer;
