import { socket } from '@/socketio';
import { createContext, useContext, useEffect, useState } from 'react';

const MessagesContext = createContext();

export const useMessages = () => useContext( MessagesContext );

const Messages = ( { children } ) => {
  const [ msgs, setMsgs ] = useState( [] );

  useEffect( () => {

    socket.on( "msg", ( msg ) => {
      setMsgs( prev => ( [ ...prev, msg ] ) );
      console.log( msg );
    } );

    return () => socket.off( "msg" );

  }, [] );

  return (
    <MessagesContext.Provider value={ { msgs, setMsgs } }>
      { children }
    </MessagesContext.Provider>
  );

};

export default Messages;