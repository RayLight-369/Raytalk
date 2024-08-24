import { socket } from '@/socketio';
import { createContext, useContext, useEffect, useState } from 'react';

const MessagesContext = createContext();

export const useMessages = () => useContext( MessagesContext );

const Messages = ( { children } ) => {
  const [ msgs, setMsgs ] = useState( [] );
  const [ name, setName ] = useState( "" );

  useEffect( () => {

    socket.connect();

    socket.on( "msg", ( msg, fromID, fromName ) => {
      setMsgs( prev => ( [ ...prev, { value: msg, fromID, fromName, type: "msg" } ] ) );
      console.log( msg );
    } );

    socket.on( "joined", ( id, name ) => {
      setMsgs( prev => ( [ ...prev, { id, name, type: "note" } ] ) );
    } );

    return () => {
      socket.off( "msg" );
      socket.off( "joined" );
      socket.disconnect();
    };

  }, [] );

  return (
    <MessagesContext.Provider value={ { msgs, setMsgs, name, setName } }>
      { children }
    </MessagesContext.Provider>
  );

};

export default Messages;