"use client";

import { socket } from '@/socketio';
import { createContext, useContext, useEffect, useState } from 'react';

const MessagesContext = createContext();

export const useMessages = () => useContext( MessagesContext );

const Messages = ( { children } ) => {
  const [ msgs, setMsgs ] = useState( [] );
  const [ name, setName ] = useState( "" );
  const [ CONFIG, setCONFIG ] = useState( {
    displayMode: "classic",
  } );
  const [ unseenMessages, setUnseenMessages ] = useState( 0 );

  useEffect( () => {

    socket.connect();

    socket.on( "msg", ( msg, fromID, fromName ) => {
      setMsgs( prev => ( [ ...prev, { value: msg, fromID, fromName, type: "msg" } ] ) );
      console.log( msg );
    } );

    socket.on( "note", ( id, name, type ) => {
      setMsgs( prev => ( [ ...prev, { id, name, type } ] ) );
    } );

    return () => {
      socket.off( "msg" );
      socket.off( "joined" );
      socket.disconnect();
    };

  }, [] );

  return (
    <MessagesContext.Provider value={ { msgs, setMsgs, name, setName, CONFIG, setCONFIG, unseenMessages, setUnseenMessages } }>
      { children }
    </MessagesContext.Provider>
  );

};

export default Messages;