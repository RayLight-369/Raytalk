"use client";

import { socket } from '@/socketio';
import { createContext, useContext, useEffect, useState } from 'react';

const MessagesContext = createContext();

export const useMessages = () => useContext( MessagesContext );

const Messages = ( { children } ) => {
  const [ msgs, setMsgs ] = useState( [] );
  const [ name, setName ] = useState( "" );
  const [ isMobile, setIsMobile ] = useState( false );
  const [ CONFIG, setCONFIG ] = useState( {
    displayMode: "classic",
  } );
  const [ unseenMessages, setUnseenMessages ] = useState( 0 );
  const [ totalUsers, setTotalUsers ] = useState( [] );

  useEffect( () => {

    function requestNotificationPermission () {
      if ( 'Notification' in window ) {
        Notification.requestPermission().then( ( permission ) => {
          if ( permission === 'granted' ) {
            console.log( 'Notification permission granted.' );
          } else {
            console.log( 'Notification permission denied.' );
          }
        } );
      } else {
        console.log( 'Browser does not support notifications.' );
      }
    }

    requestNotificationPermission();

    function showNotification ( title, options ) {
      if ( Notification.permission === 'granted' ) {
        new Notification( title, options );
      } else {
        console.log( 'Notification permission not granted.' );
      }
    }


    socket.connect();

    socket.on( "msg", ( msg, fromID, fromName, media, date ) => {
      setMsgs( prev => ( [ ...prev, { value: msg, fromID, fromName, media, type: "msg", date } ] ) );

      showNotification( `**${ fromName }**`, {
        body: msg,
        icon: document.querySelector( "link[rel*='icon']" )?.href || "/favicon.ico", // Optional: Path to your notification icon
        tag: 'message-notification', // Optional: Tag to uniquely identify the notification
      } );
    } );

    socket.on( "note", ( id, name, type, totalUsers ) => {

      if ( type.includes( "join" ) ) {
        if ( id == socket.id && name.trim().length ) setTotalUsers( totalUsers );
        else if ( name.trim().length ) {
          setTotalUsers( prev => ( [ name, ...prev ] ) );
        }
      } else {
        setTotalUsers( prev => prev.filter( socketName => socketName != name ) );
      }

      setMsgs( prev => ( [ ...prev, { id, name, type } ] ) );
    } );


    const handleResize = () => setIsMobile( window.innerWidth <= 768 );

    handleResize();

    return () => {
      socket.off( "msg" );
      socket.off( "note" );
      socket.disconnect();
    };

  }, [] );

  return (
    <MessagesContext.Provider value={ { msgs, setMsgs, name, setName, CONFIG, setCONFIG, unseenMessages, setUnseenMessages, isMobile, totalUsers, setTotalUsers } }>
      { children }
    </MessagesContext.Provider>
  );

};

export default Messages;