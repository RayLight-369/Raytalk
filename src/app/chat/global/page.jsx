"use client";

import { AvatarContainer } from '@/components/AvatarContainer';
import Message from '@/components/Message';
import TotalUsersSideSheet from '@/components/TotalUsersSideSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessages } from '@/Contexts/Messages';
import { cn } from '@/lib/utils';
import { socket } from '@/socketio';
import { EllipsisVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const page = () => {

  const [ inputValue, setInput ] = useState( "" );
  const [ typingUsers, setTypingUsers ] = useState( [] );
  const { msgs, name, CONFIG, totalUsers } = useMessages();
  const router = useRouter();
  const msgRef = useRef();
  const typingTimeoutRef = useRef( null );

  const handleTyping = ( e ) => {
    setInput( e.target.value );

    socket.emit( "typing", name );

    if ( typingTimeoutRef.current ) {
      clearTimeout( typingTimeoutRef.current );
    }

    typingTimeoutRef.current = setTimeout( () => {
      socket.emit( "stop typing", name );
    }, 1200 );
  };

  useEffect( () => {
    const timeout = setTimeout( () => {
      if ( !name.trim().length ) router.push( "/chat" );
      clearTimeout( timeout );
    }, 2000 );


    socket.on( "typing", ( user ) => {
      setTypingUsers( ( prev ) => {
        if ( !prev.includes( user ) ) {
          return [ ...prev, user ];
        }
        return prev;
      } );
    } );

    socket.on( "stop typing", ( user ) => {
      setTypingUsers( ( prev ) => prev.filter( ( u ) => u !== user ) );
    } );

    return () => {
      socket.off( "typing" );
      socket.off( "stop typing" );
    };
  }, [] );

  useEffect( () => {

    const isNearBottom = msgRef.current.scrollHeight - msgRef.current.clientHeight - msgRef.current.scrollTop <= 250;

    if ( isNearBottom ) msgRef?.current?.scrollTo( 0, msgRef?.current?.scrollHeight );

  }, [ msgs ] );

  return (
    <div className='w-full h-full relative overflow-y-hidden flex flex-col'>
      <div className='header w-full max-w-full flex justify-between items-center py-3 px-6 border-b'>
        <div className='w-full h-full flex gap-6 items-center'>
          <AvatarContainer />
          <h1 className='text-[1.05rem]'>Global</h1>
        </div>
        <div className='flex gap-3 items-center'>
          <TotalUsersSideSheet totalUsers={ totalUsers } />
          <EllipsisVertical />
        </div>
      </div>


      {/* <div className="chat-section relative w-full px-6"> */ }
      <ScrollArea className={ cn( "chat-section relative w-full max-w-full flex-1 max-h-full pt-[2px] pb-1", CONFIG.displayMode == "casual" ? "px-5" : "" ) } divref={ msgRef }>
        { msgs.map( ( msg, i ) => (
          // <div className={ cn( 'relative w-full h-full', msg.fromID == socket.id ? "float-right" : "" ) } key={ i }>
          <>
            { msg.type == "msg" ? (
              <Message msg={ msg } socket={ socket } displayMode={ CONFIG.displayMode } key={ i } previousMsgFromSameUser={ i > 0 && !!( msgs[ i - 1 ]?.fromID == msg.fromID ) } />
            ) : (
              <div className={ 'flex relative gap-4 w-full max-w-[100%] py-4 border-t first:border-none' } key={ i }>
                <div className={ 'flex justify-center pt-1 w-full' }>
                  <p className="name text-sm text-center text-muted-foreground">{ msg.name } just { msg.type }</p>
                </div>
              </div>
            ) }
          </>
          // </div>
        ) ) }
      </ScrollArea>
      {/* </div> */ }


      <div className='w-full h-[calc(75px)] py-2 mt-2 px-6 relative bottom-2 flex flex-col justify-end items-center'>
        <div id='typing' className={ cn( 'px-1 text-sm w-full transition-all translate-y-[30px] z-[8] outline-none bg-muted text-muted-foreground flex gap-2',
          typingUsers.length ? "translate-y-0" : ""
        ) }>
          { typingUsers.length < 3 ? (
            <>
              { typingUsers.map( ( user, i ) => (
                <p className='text-[0.785rem]' key={ i }>{ user } is typing...</p>
              ) ) }
            </>
          ) : (
            <p className='text-[0.785rem]'>A lot of people are tying...</p>
          ) }
        </div>
        <input onKeyDown={ ( e ) => {
          if ( e.key == "Enter" && e.target.value.trim().length ) {
            socket.emit( "msg", inputValue, socket.id, name );
            socket.emit( "stop typing", name );
            setInput( "" );
          }
        } } onChange={ handleTyping } value={ inputValue } type="text" placeholder='Type Message' className='px-3 py-2 z-10 text-sm w-full rounded-md border outline-none bg-background text-foreground' />
      </div>
    </div>
  );
};

export default page;