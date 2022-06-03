import React from 'react';
import Box from '@mui/material/Box';
import ShareScreenButton from './MediaButtons';

const ControlBox: React.FC = () => {
  return (
    <Box
      sx={{
        height: '10vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'primary.main',
        zIndex: 0,
      }}
    >
      <ShareScreenButton />
    </Box>
  );
};

export default ControlBox;
