import { socket } from '@/socketio';
import { createContext, useContext, useEffect, useState } from 'react';

const MessagesContext = createContext();

export const useMessages = () => useContext( MessagesContext );

const Messages = ( { children } ) => {
  const [ msgs, setMsgs ] = useState( [] );
  const [ name, setName ] = useState( "" );

  useEffect( () => {

    socket.on( "msg", ( msg, fromID, fromName ) => {
      setMsgs( prev => ( [ ...prev, { value: msg, fromID, fromName } ] ) );
      console.log( msg );
    } );

    return () => socket.off( "msg" );

  }, [] );

  return (
    <MessagesContext.Provider value={ { msgs, setMsgs, name, setName } }>
      { children }
    </MessagesContext.Provider>
  );

};

export default Messages;