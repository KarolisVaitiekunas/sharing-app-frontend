import Peer from 'peerjs';
import { useRouter } from 'next/router';
import { createContext, useEffect, useReducer, useState } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import { peersReducer, PeerState } from './peerReducer';
import { addPeerAction, removePeerAction } from './peerActions';
import EVENTS from '../../../config/events';

export interface IContext {
  ws: Socket;
  me: Peer | null;
  stream: MediaStream | null;
  screenStream: MediaStream | null;
  peers: PeerState;
  shareScreen: Function;
  handleAudio: Function;
  handleCamera: Function;
  screenSharingId: string;
  setRoomId: Function;
}

const WS = 'http://localhost:8080';

const ws = socketIOClient(WS);

export const RoomContext = createContext<IContext>({
  ws: ws,
  me: null,
  peers: {},
  screenSharingId: '',
  shareScreen: () => {},
  handleAudio: () => {},
  handleCamera: () => {},
  setRoomId: () => {},
  stream: null,
  screenStream: null,
});

export const RoomProvider: React.FunctionComponent = ({ children }) => {
  const router = useRouter();

  const [me, setMe] = useState<IContext['me']>(null);
  const [stream, setStream] = useState<IContext['stream']>(null);
  const [screenStream, setScreenStream] = useState<IContext['stream']>(null);
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [screenSharingId, setScreenSharingId] = useState<IContext['screenSharingId']>('');
  const [roomId, setRoomId] = useState('');

  const enterRoom = ({ roomId }: { roomId: string }) => {
    router.replace(`room/${roomId}`);
  };

  const getUsers = ({ participants }: { participants: string[] }) => {
    console.log({ participants });
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId));
  };

  const switchScreen = (stream1: MediaStream | null | undefined, stream2: MediaStream | null | undefined) => {
    // @ts-expect-error: peerJs does not provide connection type
    const changePeerStream = (connection, newTrack: MediaStreamTrack, type: 'audio' | 'video') => {
      connection[0].peerConnection
        .getSenders()
        [type === 'audio' ? 0 : 1].replaceTrack(newTrack)
        .catch((err: Error) => console.error(err));
    };

    // audio from microphone/webcam stream
    const audioTrack = stream1?.getTracks().find((track) => track.kind === 'audio');
    // video from screen stream
    const videoTrack = stream2?.getTracks().find((track) => track.kind === 'video');

    //mapping through every peer connected to me, so that THEY can see our changed screen
    if (me?.connections) {
      Object.values(me?.connections).forEach((connection) => {
        if (stream1 && audioTrack) {
          changePeerStream(connection, audioTrack, 'audio');
        }

        if (stream2 && videoTrack) {
          changePeerStream(connection, videoTrack, 'video');
        }
      });
    }
  };

  const shareScreen = (enabled: boolean) => {
    if (enabled) {
      navigator.mediaDevices.getDisplayMedia({}).then((newScreenStream) => {
        setScreenStream(newScreenStream);
        switchScreen(stream, newScreenStream);
        setScreenSharingId(me?.id || '');
      });
    } else {
      setScreenStream(null);
      switchScreen(stream, stream);
      setScreenSharingId('');
    }
  };

  const handleAudio = (enabled: boolean) => {
    const audio = stream?.getAudioTracks();
    if (audio) {
      audio[0].enabled = enabled;
    }
  };

  const handleCamera = (enabled: boolean) => {
    const video = stream?.getVideoTracks();
    if (video) {
      video[0].enabled = enabled;
    }
  };

  useEffect(() => {
    console.log('HELLO');
    // Bug with Next.Js and peer js
    // https://github.com/peers/peerjs/issues/819#issuecomment-1110823223
    import('peerjs').then(({ default: Peer }) => {
      const meId = uuid();

      const peer = new Peer(meId, {
        host: 'localhost',
        port: 9001,
        path: '/',
      });
      setMe(peer);

      try {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          setStream(stream);
        });
      } catch (error) {
        console.log(error);
      }

      ws.on(EVENTS.SERVER.ROOM_CREATED, enterRoom);
      ws.on(EVENTS.SERVER.GET_USERS, getUsers);
      ws.on(EVENTS.SERVER.USER_DISCONNECTED, removePeer);
      // ws.on(EVENTS.SERVER.USER_SHARED_SCREEN, (peerId) => setScreenSharingId(peerId));
      // ws.on(EVENTS.SERVER.USER_STOPPED_SHARING, () => setScreenSharingId(''));

      //unmounting listeners
      return () => {
        ws.off(EVENTS.SERVER.ROOM_CREATED);
        ws.off(EVENTS.SERVER.GET_USERS);
        ws.off(EVENTS.SERVER.USER_DISCONNECTED);
        // ws.off(EVENTS.SERVER.USER_SHARED_SCREEN);
        // ws.off(EVENTS.SERVER.USER_STOPPED_SHARING);
        ws.off(EVENTS.SERVER.USER_JOINED);
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (screenSharingId) {
      ws.emit(EVENTS.CLIENT.START_SHARING, { peerId: screenSharingId, roomId });
    } else {
      ws.emit(EVENTS.CLIENT.STOP_SHARING);
    }
  }, [screenSharingId, roomId]);

  useEffect(() => {
    if (!me) return; // if no peer return
    if (!stream) return;

    ws.on(EVENTS.SERVER.USER_JOINED, ({ peerId }) => {
      // initiating the call, sending steam to peer
      const call = me.call(peerId, stream);
      call.on('stream', (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream));
      });
    });

    me.on('call', (call) => {
      // answering call with our own stream
      call.answer(stream);
      call.on('stream', (peerStream) => {
        // call.peer = person who is initating the call (caller)
        dispatch(addPeerAction(call.peer, peerStream));
      });
    });
  }, [me, stream]);

  return (
    <RoomContext.Provider
      value={{
        ws,
        me,
        stream,
        peers,
        screenStream,
        shareScreen,
        screenSharingId,
        setRoomId,
        handleAudio,
        handleCamera,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
