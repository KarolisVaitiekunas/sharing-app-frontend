import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { RoomContext } from '../../../context/RoomContext';
import EVENTS from '../../../../../config/events';

const CreateButton: React.FC = () => {
  const { ws } = useContext(RoomContext);

  const createRoom = () => {
    ws.emit(EVENTS.CLIENT.CREATE_ROOM);
  };

  return (
    <div>
      <Button variant='contained' onClick={createRoom}>
        Start new meeting
      </Button>
    </div>
  );
};

export default CreateButton;
