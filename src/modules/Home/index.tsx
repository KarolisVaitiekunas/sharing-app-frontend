import { Typography } from '@mui/material';
import { Container, Box } from '@mui/system';
import CreateButton from '../Room/id/components/CreateButton';
import EmptyIcon from '../layout/components/NavBar/EmptyIcon';

const HomeIndex: React.FC = () => {
  return (
    <Container maxWidth='md' sx={{ paddingTop: 15 }}>
      <EmptyIcon />
      <Box display='flex' flexDirection='column' alignItems='center'>
        <Typography align='center'>It is empty here... How about starting a new meeting?</Typography>
        <CreateButton />
      </Box>
    </Container>
  );
};

export default HomeIndex;
