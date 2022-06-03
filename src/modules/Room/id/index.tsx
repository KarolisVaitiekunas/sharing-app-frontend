import React, { useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { RoomContext } from '../../context/RoomContext';
import VideoPlayer from './components/VideoPlayer';
import { PeerState } from '../../context/peerReducer';
import { Box } from '@mui/system';
import EVENTS from '../../../../config/events';
import ControlBox from './components/ControlBox';
import { NextPage } from 'next';

const Root = styled(Box)(({ theme }) => ({
  height: `calc(100vh - ${theme.layout.NavBar} - ${theme.layout.ControlBox})`,
}));

const Wrapper = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gridTemplateRows: 'repeat(auto, 1fr)',
  gridGap: 5,
  height: '100%',
  maxHeight: '1200px',
  overflowY: 'auto',

  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
  },
}));

const IdIndex: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { ws, me, stream, peers, screenSharingId, setRoomId, screenStream } = useContext(RoomContext);

  useEffect(() => {
    if (id && me) {
      ws.emit(EVENTS.CLIENT.JOIN_ROOM, { roomId: id, peerId: me.id });
    }
  }, [id, me, ws]);

  useEffect(() => {
    setRoomId(id);
  }, [id, setRoomId]);

  return (
    <Root>
      <Wrapper>
        {screenSharingId !== me?.id && <VideoPlayer stream={stream || null} userId={me?.id || 'You'} />}

        {screenSharingId === me?.id && screenStream && (
          <VideoPlayer stream={screenStream || null} userId={me?.id || 'Your stream'} />
        )}

        {Object.entries(peers as PeerState).map((entry) => (
          <VideoPlayer key={stream?.id} stream={entry[1].stream} userId={entry[0]} />
        ))}
      </Wrapper>
      <ControlBox />
    </Root>
  );
};

export default IdIndex;
