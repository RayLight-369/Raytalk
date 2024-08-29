"use client";

import { AvatarContainer } from '@/components/AvatarContainer';
import Message from '@/components/Message';
import TotalUsersSideSheet from '@/components/TotalUsersSideSheet';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useMessages } from '@/Contexts/Messages';
import { cn } from '@/lib/utils';
import { socket } from '@/socketio';
import { EllipsisVertical, Link, Mic, MicIcon, Send, Square, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import imageCompression from "browser-image-compression";
import { Button, buttonVariants } from '@/components/ui/button';



const page = () => {

  const [ inputValue, setInput ] = useState( "" );
  const [ typingUsers, setTypingUsers ] = useState( [] );
  const { msgs, name, CONFIG, totalUsers, showNotification } = useMessages();
  const router = useRouter();
  const msgRef = useRef();
  const typingTimeoutRef = useRef( null );
  const [ media, setMedia ] = useState( [] );
  const [ audio, setAudio ] = useState( [] );
  const [ isRecording, setIsRecording ] = useState( false );
  const [ audioBlob, setAudioBlob ] = useState( null );
  const mediaRecorderRef = useRef( null );

  const streamRef = useRef( null ); // Store the media stream

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia( { audio: true } )
      .then( stream => {
        streamRef.current = stream; // Save the stream reference
        mediaRecorderRef.current = new MediaRecorder( stream );
        mediaRecorderRef.current.ondataavailable = event => {
          if ( event.data && event.data.size > 0 ) {
            // const reader = new FileReader();
            // reader.onloadend = () => {
            // const arrayBuffer = reader.result;
            setAudio( prev => ( [ ...prev, event.data ] ) );
            // };
            // reader.readAsArrayBuffer( event.data );
          }
        };
        mediaRecorderRef.current.start();
        setIsRecording( true );
      } )
      .catch( error => {
        console.error( 'Error accessing microphone:', error );
      } );
  };

  const stopRecording = () => {
    if ( mediaRecorderRef.current ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        if ( streamRef.current ) {
          streamRef.current.getTracks().forEach( track => track.stop() ); // Stop all tracks
        }
        setIsRecording( false );
      };
    }
  };


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
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        try {
          const compressedFile = await imageCompression( imageFile, options );
          // const reader = new FileReader();
          // reader.onload = ( e ) => {
          //   console.log( e.target.result );
          if ( media.length < 9 ) {
            setMedia( prev => {
              if ( prev.length < 9 ) {
                return [ compressedFile, ...prev ];
              } else {
                alert( "vey bas kar de..." );
                return [ ...prev ];
              }
            } );
          }
          // };
          // reader.readAsDataURL( compressedFile );
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
    if ( e.key == "Enter" && ( ( e.target?.value?.trim()?.length || inputValue.trim().length ) || media.length || audio.length ) ) {
      socket.emit( "msg", inputValue, socket.id, name, media, audio, new Date().toISOString() );
      socket.emit( "stop typing", name );
      setMedia( [] );
      setAudio( [] );
      setInput( "" );
    }
  };

  const scrollToBottom = ( offset = 250 ) => {

    const isNearBottom = msgRef.current.scrollHeight - msgRef.current.clientHeight - msgRef.current.scrollTop <= offset;

    if ( isNearBottom ) {
      msgRef?.current?.scrollTo( 0, msgRef?.current?.scrollHeight );
    } else {

    }

  };



  useEffect( () => {
    // const timeout = setTimeout( () => {
    if ( !name.trim().length ) router.push( "/chat" );
    // clearTimeout( timeout );
    // }, 000 );

    const handleGlobalTyping = e => {

      const input = document.querySelector( "input#input" );

      if ( document.activeElement != input ) {
        input.focus();
      }

      handleInput( e );

    };


    document.addEventListener( "paste", handlePaste );
    document.addEventListener( "keydown", handleGlobalTyping );
    // window.addEventListener( "unload", () => localStorage.removeItem( "joined" ) );
    // window.addEventListener( "beforeunload", () => localStorage.removeItem( "joined" ) );



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
      document.removeEventListener( "keydown", handleGlobalTyping );
    };
  }, [] );

  useEffect( () => {
    if ( msgs[ msgs.length - 1 ]?.media?.length ) {
      scrollToBottom( 400 );
    } else {
      scrollToBottom();
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
                      <Image width={ 170 } height={ 145 } src={ URL.createObjectURL( new Blob( [ img ], { type: img.type } ) ) } className='w-full h-20 p-2 object-contain rounded-md bg-muted' />
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
          { !!audio.length && (
            <div className='flex items-center gap-3 p-3 px-4 rounded-lg h-32 w-fit max-w-full'>
              <ScrollArea className="w-full h-full whitespace-nowrap rounded-md [&>*>*]:h-full">
                <div className='flex h-full gap-3 py-3 px-4 items-center'>
                  { audio.map( ( item, i ) => (
                    <div id="audio" className='w-36 h-full relative' key={ i }>
                      <audio controls src={ URL.createObjectURL( new Blob( [ item ], { type: item.type } ) ) } className='w-[calc(100%-25px)]' />
                      <X className='text-background bg-foreground rounded-full border p-1 absolute top-1 right-1 hover:scale-105' onClick={ () => {
                        setAudio( prev => prev.filter( ( _, j ) => i != j ) );
                      } } />
                    </div>
                  ) ) }
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          ) }
          <div className='w-full flex gap-3 relative z-10'>
            <label htmlFor="media-input" className={ "p-0 h-full flex items-center justify-center w-auto aspect-square rounded-full bg-foreground text-background cursor-pointer" }>
              <Link className='text-sm w-[20px] aspect-square text-background' />
            </label>
            <input type="file" name="media-input" id="media-input" className='hidden' multiple accept='image/*' max={ 9 - media.length } onChange={ handlePaste } />
            <div className='relative w-full flex items-center'>
              <input
                onKeyDown={ handleInput }
                onChange={ handleTyping }
                value={ inputValue }
                type="text"
                placeholder='Type Message'
                id='input'
                className='px-3 py-[0.55rem] z-10 text-sm w-full rounded-ss-md rounded-es-md border outline-none bg-background text-foreground'
              />
              <Button variant="outline" className="relative right-0 z-20 text-sm rounded-ss-none rounded-es-none" onClick={ () => handleInput( { key: "Enter" } ) }>
                <Send className='h-[85%]' />
              </Button>
            </div>
            { isRecording ? (
              <Button onClick={ stopRecording } className="p-0 h-full flex justify-center items-center w-auto aspect-square rounded-full bg-foreground text-background cursor-pointer">
                <Square className='fill-background' />
              </Button>
            ) : (
              <Button onClick={ startRecording } className="p-0 h-full flex justify-center items-center w-auto aspect-square rounded-full bg-foreground text-background cursor-pointer">
                <MicIcon />
              </Button>
            ) }
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;