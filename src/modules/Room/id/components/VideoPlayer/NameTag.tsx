import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const Root = styled(Typography)(() => ({
  backgroundColor: 'hsla(360, 0%, 52%, 0.3)',
  width: 'max-content',
  padding: 5,
  margin: 10,
  borderRadius: 3,
  position: 'absolute',
  top: 0,
  zIndex: 2,
}));

const NameTag: React.FC<{ nameTag: string }> = ({ nameTag }) => {
  return <Root color='background.paper'>{nameTag}</Root>;
};

export default NameTag;
