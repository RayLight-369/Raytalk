"use client";

import Messages, { useMessages } from "@/Contexts/Messages";
import usePageVisibility from "@/Hooks/usePageVisibility";
import { socket } from "@/socketio";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const playSound = () => {
  const audio = new Audio( "/sound.mp3" );
  audio.play();
};

const updateFavicon = ( count ) => {
  const canvas = document.createElement( 'canvas' );
  canvas.width = 48;
  canvas.height = 48;

  const ctx = canvas.getContext( '2d' );
  const img = new Image();
  img.src = '/favicon.ico';  // Replace with your original favicon path
  img.onload = () => {
    ctx.drawImage( img, 0, 0, 48, 48 );

    if ( count > 0 ) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc( 32, 12, 12, 0, 2 * Math.PI );
      ctx.fill();

      ctx.font = '20px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText( count, 32, 12 );
    }

    const link = document.querySelector( "link[rel*='icon']" ) || document.createElement( 'link' );
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL( 'image/x-icon' );
    document.getElementsByTagName( 'head' )[ 0 ].appendChild( link );
  };
};

export default function ChildLayout () {

  const { msgs, unseenMessages, setUnseenMessages, showNotification } = useMessages();
  const [ lastSeenMessageIndex, setLastSeenMessageIndex ] = useState( null );
  const pathName = usePathname();
  const visibility = usePageVisibility();

  useEffect( () => {
    if ( msgs.length > 0 ) {
      setLastSeenMessageIndex( msgs.length - 1 );
    }
  }, [] );

  useEffect( () => {
    if ( msgs.length > 0 ) {
      const msg = msgs[ msgs.length - 1 ];
      const newMessages = msgs.length - ( lastSeenMessageIndex + 1 );

      if ( ( !visibility || !pathName.includes( "global" ) ) && newMessages > 0 ) {
        playSound();
        setUnseenMessages( newMessages ); // Optionally update unseen messages count
        showNotification( `${ msgs[ msgs.length - 1 ]?.fromName || "New Message" }`, {
          body: `${ msg?.value || "Check Your Messages" }`,
          icon: `${ document.querySelector( "link[rel*='icon']" )?.href || "/favicon.ico" }`
        } );
      }

      if ( visibility ) {
        // const timeout = setTimeout( () => {
        setLastSeenMessageIndex( msgs.length - 1 );
        setUnseenMessages( 0 );
        // clearTimeout( timeout );
        // }, 1200 );
      };

    }
  }, [ msgs, visibility ] );

  useEffect( () => {
    updateFavicon( unseenMessages );
  }, [ unseenMessages ] );

  return null;
}




// useEffect( () => {
//   const handleVisibilityChange = () => {
//     if ( document.visibilityState === 'visible' ) {

//       console.log( unseenMessages );

//       const timeOut = setTimeout( () => {

//         setLastSeenMessageIndex( msgs.length - 1 );
//         setUnseenMessages( 0 );

//         clearTimeout( timeOut );

//       }, 2000 );

//     }
//     // else {
//     //   if ( msgs.length > lastSeenMessageIndex + 1 ) {
//     //     setUnseenMessages( msgs.length - lastSeenMessageIndex - 1 );
//     //   }
//     // }
//   };

//   document.addEventListener( 'visibilitychange', handleVisibilityChange );

//   return () => {
//     document.removeEventListener( 'visibilitychange', handleVisibilityChange );
//   };
// }, [ msgs, lastSeenMessageIndex ] );

// useEffect( () => {
//   if ( msgs.length > lastSeenMessageIndex + 1 ) {
//     const newMessages = msgs.slice( lastSeenMessageIndex + 1 );
//     const hasNewUnseenMessages = newMessages.some( msg => msg.fromID !== socket.id );

//     if ( hasNewUnseenMessages ) {
//       playSound();
//       setUnseenMessages( newMessages.length );
//       setLastSeenMessageIndex( msgs.length - 1 );
//     } else {
//       setUnseenMessages( 0 );
//       setLastSeenMessageIndex( msgs.length - 1 );
//     }
//   }
// }, [ msgs, lastSeenMessageIndex ] );
