import { Box } from '@mui/material';
import React from 'react';
import NavBar from './components/NavBar/NavBar';

const Index: React.FC = ({ children }) => {
  return (
    <Box>
      <NavBar />
      {children}
    </Box>
  );
};

export default Index;
