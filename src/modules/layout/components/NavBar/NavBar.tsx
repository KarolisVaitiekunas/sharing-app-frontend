import React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';

const Bar = styled(AppBar)(({ theme }) => ({
  height: theme.layout.NavBar,
  justifyContent: 'center',
}));

const NavBar: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Bar position='static'>
        <Toolbar>
          <IconButton size='large' edge='start' color='inherit' aria-label='open drawer' sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant='h5' noWrap component='div' sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            i love mui
          </Typography>
        </Toolbar>
      </Bar>
    </Box>
  );
};

export default NavBar;
