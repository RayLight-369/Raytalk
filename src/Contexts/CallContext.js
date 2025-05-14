'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { socket } from '@/socketio';

const CallContext = createContext();

export const useCall = () => useContext( CallContext );

export const CallProvider = ( { children } ) => {
  const [ localStream, setLocalStream ] = useState( null );
  const [ remoteStreams, setRemoteStreams ] = useState( {} );
  const peersRef = useRef( {} );
  const roomId = 'global-room'; // fixed room for now

  useEffect( () => {
    socket.on( 'user-joined-call', async ( { socketId } ) => {
      const peer = createPeer( socketId, socket.id, localStream );
      peersRef.current[ socketId ] = peer;
    } );

    socket.on( 'receive-signal', async ( { signal, from } ) => {
      const peer = addPeer( signal, from, localStream );
      peersRef.current[ from ] = peer;
    } );

    socket.on( 'user-left-call', ( { socketId } ) => {
      if ( peersRef.current[ socketId ] ) {
        peersRef.current[ socketId ].close();
        delete peersRef.current[ socketId ];
        setRemoteStreams( prev => {
          const updated = { ...prev };
          delete updated[ socketId ];
          return updated;
        } );
      }
    } );

    return () => {
      socket.off( 'user-joined-call' );
      socket.off( 'receive-signal' );
      socket.off( 'user-left-call' );
    };
  }, [ localStream ] );

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia( { audio: true } );
    setLocalStream( stream );
    socket.emit( 'join-call', { roomId } );
  };

  const leaveCall = () => {
    if ( localStream ) {
      localStream.getTracks().forEach( t => t.stop() );
      setLocalStream( null );
    }
    socket.emit( 'leave-call', { roomId } );
    Object.values( peersRef.current ).forEach( p => p.close() );
    peersRef.current = {};
    setRemoteStreams( {} );
  };

  const createPeer = ( userToSignal, callerId, stream ) => {
    const peer = new RTCPeerConnection();

    stream.getTracks().forEach( track => peer.addTrack( track, stream ) );

    peer.ontrack = event => {
      setRemoteStreams( prev => ( {
        ...prev,
        [ userToSignal ]: event.streams[ 0 ],
      } ) );
    };

    peer.onicecandidate = event => {
      if ( event.candidate ) {
        socket.emit( 'send-signal', {
          userToSignal,
          from: callerId,
          signal: peer.localDescription,
        } );
      }
    };

    peer
      .createOffer()
      .then( offer => peer.setLocalDescription( offer ) );

    return peer;
  };

  const addPeer = ( incomingSignal, callerId, stream ) => {
    const peer = new RTCPeerConnection();

    stream.getTracks().forEach( track => peer.addTrack( track, stream ) );

    peer.ontrack = event => {
      setRemoteStreams( prev => ( {
        ...prev,
        [ callerId ]: event.streams[ 0 ],
      } ) );
    };

    peer.onicecandidate = event => {
      if ( event.candidate ) {
        socket.emit( 'send-signal', {
          userToSignal: callerId,
          from: socket.id,
          signal: peer.localDescription,
        } );
      }
    };

    peer.setRemoteDescription( new RTCSessionDescription( incomingSignal ) );
    peer.createAnswer()
      .then( answer => peer.setLocalDescription( answer ) );

    return peer;
  };

  return (
    <CallContext.Provider value={ { startCall, leaveCall, localStream, remoteStreams } }>
      { children }
    </CallContext.Provider>
  );
};
