"use client";

import { AvatarContainer } from '@/components/AvatarContainer';
import Message from '@/components/Message';
import TotalUsersSideSheet from '@/components/TotalUsersSideSheet';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useMessages } from '@/Contexts/Messages';
import { cn } from '@/lib/utils';
import { socket } from '@/socketio';
import { EllipsisVertical, Link, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import imageCompression from "browser-image-compression";
import { Button, buttonVariants } from '@/components/ui/button';



const page = () => {

  const [ inputValue, setInput ] = useState( "" );
  const [ typingUsers, setTypingUsers ] = useState( [] );
  const { msgs, name, CONFIG, totalUsers } = useMessages();
  const router = useRouter();
  const msgRef = useRef();
  const typingTimeoutRef = useRef( null );
  const [ media, setMedia ] = useState( [] );

  const handlePaste = async ( e ) => {

    const items = e.type == "paste" ? e.clipboardData.items : e.target.files;

    if ( e.type != "paste" && items.length > 9 - media.length ) {
      alert( "You can send a total of 9 images." );
      return;
    }

    if ( media.length > 9 ) {
      alert( "vey bas kar de hon..." );
      return;
    }

    for ( let item of items ) {
      if ( item.type.startsWith( 'image/' ) ) {
        const imageFile = e.type == "paste" ? item.getAsFile() : item;

        const options = {
          maxSizeMB: 2,
          maxWidthOrHeight: 1248,
          useWebWorker: true,
        };

        try {
          const compressedFile = await imageCompression( imageFile, options );

          const reader = new FileReader();
          reader.onload = ( e ) => {
            console.log( e.target.result );
            if ( media.length < 9 ) {
              setMedia( prev => {
                if ( prev.length < 9 ) {
                  return [ e.target.result, ...prev ];
                } else {
                  alert( "vey bas kar de..." );
                  return [ ...prev ];
                }
              } );
            }
          };
          reader.readAsDataURL( compressedFile );
        } catch ( error ) {
          console.error( "Error compressing the image:", error );
        }
      }
    }
  };

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

  const handleInput = ( e ) => {
    if ( e.key == "Enter" && ( e.target.value.trim().length || media.length ) ) {

      socket.emit( "msg", inputValue, socket.id, name, media, new Date().toISOString() );
      socket.emit( "stop typing", name );
      setMedia( [] );
      setInput( "" );
    }
  };



  useEffect( () => {
    // const timeout = setTimeout( () => {
    if ( !name.trim().length ) router.push( "/chat" );
    // clearTimeout( timeout );
    // }, 000 );



    document.addEventListener( "paste", handlePaste );
    // document.addEventListener( "keydown", handleInput );



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
      document.removeEventListener( "paste", handlePaste );
      // document.removeEventListener( "keydown", handleInput );
    };
  }, [] );

  useEffect( () => {

    const isNearBottom = msgRef.current.scrollHeight - msgRef.current.clientHeight - msgRef.current.scrollTop <= 250;

    if ( isNearBottom ) {
      msgRef?.current?.scrollTo( 0, msgRef?.current?.scrollHeight );
    } else {

    }

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
              <div className={ 'message flex relative gap-4 w-full max-w-[100%] py-4 border-t first:border-none' } key={ i }>
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


      <div className='w-full h-[75px] pt-1 pb-2 mt-2 px-6 relative bottom-2 flex flex-col justify-end items-center'>
        <div id='typing' className={ cn( 'px-1 text-sm w-full transition-all translate-y-[30px] z-[8] outline-none text-muted-foreground flex gap-2',
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
        <div className='flex flex-col gap-3 w-full'>
          { !!media.length && (
            <div className='flex items-center gap-3 p-3 px-4 rounded-lg h-32 w-fit max-w-full'>
              <ScrollArea className="w-full h-full whitespace-nowrap rounded-md [&>*>*]:h-full">
                <div className='flex h-full gap-3 py-3 px-4 items-center'>
                  { media.map( ( img, i ) => (
                    <div id="img" className='w-36 h-full relative' key={ i }>
                      <Image width={ 170 } height={ 145 } src={ img } className='w-full h-20 p-2 object-contain rounded-md bg-muted' />
                      <X className='text-foreground rounded-md border p-1 absolute top-1 right-1 hover:bg-background' onClick={ () => {
                        setMedia( prev => prev.filter( ( _, j ) => i != j ) );
                      } } />
                    </div>
                  ) ) }
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          ) }
          <div className='w-full flex gap-3 relative z-10'>
            {/* <Button className="text-sm"> */ }
            <label htmlFor="media-input" className={ cn( buttonVariants( { variant: "default" } ), "cursor-pointer" ) }>
              <Link className='text-sm w-[20px] aspect-square' />
            </label>
            {/* </Button> */ }
            <input type="file" name="media-input" id="media-input" className='hidden' multiple accept='image/*' max={ 9 - media.length } onChange={ handlePaste } />
            <input
              onKeyDown={ handleInput }
              onChange={ handleTyping }
              value={ inputValue }
              type="text"
              placeholder='Type Message'
              className='px-3 py-2 z-10 text-sm w-full rounded-md border outline-none bg-background text-foreground'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;