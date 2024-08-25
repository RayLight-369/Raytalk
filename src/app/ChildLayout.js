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

export default function ChildLayout () {

  const { msgs, unseenMessages, setUnseenMessages } = useMessages();
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
      const newMessages = msgs.length - ( lastSeenMessageIndex + 1 );

      if ( ( !visibility || !pathName.includes( "global" ) ) && newMessages > 0 ) {
        playSound();
        setUnseenMessages( newMessages ); // Optionally update unseen messages count
      }

      if ( visibility ) {
        const timeout = setTimeout( () => {
          setUnseenMessages( 0 );
          clearTimeout( timeout );
        }, 2000 );
      };

      setLastSeenMessageIndex( msgs.length - 1 );
    }
  }, [ msgs, visibility ] );

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
