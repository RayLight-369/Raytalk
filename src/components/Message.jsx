import React from 'react';
import { AvatarContainer } from './AvatarContainer';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const Message = ( { msg, socket, displayMode, previousMsgFromSameUser } ) => {

  const formatMessageDate = ( timestamp ) => {
    const now = new Date();
    const messageDate = new Date( timestamp );

    const isToday = now.toDateString() === messageDate.toDateString();
    const isYesterday =
      new Date( now.setDate( now.getDate() - 1 ) ).toDateString() ===
      messageDate.toDateString();

    const options = { hour: 'numeric', minute: 'numeric', hour12: true };

    if ( isToday ) {
      return `Today at ${ messageDate.toLocaleTimeString( [], options ) }`;
    } else if ( isYesterday ) {
      return `Yesterday at ${ messageDate.toLocaleTimeString( [], options ) }`;
    } else {
      return `${ messageDate.toLocaleDateString() } at ${ messageDate.toLocaleTimeString( [], options ) }`;
    }
  };



  if ( displayMode.toLowerCase() === "casual" )
    return (
      <div className={ cn( 'message flex relative gap-4 w-full min-w-[60%] max-w-[75%] md:min-w-[auto] md:max-w-[60%] py-4', msg.fromID == socket.id ? "flex-row-reverse float-right" : "", previousMsgFromSameUser ? "pt-0 pb-2" : "" ) }>
        <AvatarContainer className={ previousMsgFromSameUser ? "invisible h-0" : "visible" } />
        <div className={ cn( 'flex flex-col gap-1', msg.fromID == socket.id ? "items-end" : "items-start" ) }>
          { !previousMsgFromSameUser && (
            <div className={ cn( 'flex gap-5 items-center', socket.id != msg.fromID ? "flex-row-reverse" : "" ) }>
              <p className="date text-[0.62rem] text-muted-foreground">{ formatMessageDate( msg.date ) }</p>
              <p className="name text-sm">{ msg.fromName }</p>
            </div>
          ) }
          <div className={ cn( 'flex flex-col gap-5 bg-muted rounded-md py-1 px-2', msg.fromID == socket.id ? "items-end" : "items-start" ) }>
            { !!msg.media?.length && (
              <div className='flex flex-col gap-4 p-3'>
                { msg.media.map( ( item, i ) => (
                  <>
                    <Image width={ 300 } height={ 400 } src={ URL.createObjectURL( new Blob( [ item ], { type: item?.type } ) ) } key={ i } className='rounded-md' />
                  </>
                ) ) }
              </div>
            ) }
            { !!msg.audio?.length && (
              <div className='flex flex-col gap-4 p-3'>
                { msg.audio.map( ( item, i ) => (
                  <>
                    <audio controls src={ URL.createObjectURL( new Blob( [ item ], { type: item?.type } ) ) } key={ i } />
                  </>
                ) ) }
              </div>
            ) }
            <div className='relative flex items-start group max-w-full'>
              <p className="msg text-[0.8rem] leading-[1.24rem] break-all max-w-full">{ msg.value }</p>
              { previousMsgFromSameUser && (
                <p className="date absolute w-fit pt-[3px] whitespace-nowrap right-[calc(100%+25px)] text-[0.61rem] text-muted-foreground hidden group-hover:inline">{ formatMessageDate( msg.date ) }</p>
              ) }
            </div>
          </div>
        </div>
      </div>
    );
  else
    return (
      <div className={ cn( 'message flex relative gap-3 w-full max-w-full px-4 py-[0.35rem] border-t first:border-none', previousMsgFromSameUser ? "border-none pt-0" : "" ) }>
        <AvatarContainer className={ previousMsgFromSameUser ? "invisible h-0" : "visible" } />
        <div className={ cn( 'flex flex-col gap-1 w-full max-w-full' ) }>
          { !previousMsgFromSameUser && (
            <div className='flex gap-5 items-baseline'>
              <p className="name text-sm italic">{ msg.fromName }</p>
              <p className="date text-[0.62rem] text-muted-foreground">{ formatMessageDate( msg.date ) }</p>
            </div>
          ) }
          <div className={ cn( 'flex flex-col gap-4 w-full max-w-full' ) }>
            { !!msg.media?.length && (
              <div className='flex flex-col gap-4 p-3 rounded-md'>
                { msg.media.map( ( item, i ) => (
                  // <>
                  <Image width={ 150 } height={ 150 } src={ URL.createObjectURL( new Blob( [ item ], { type: item?.type } ) ) } key={ i } className='w-full md:w-[60%] h-auto max-h-[250px] md:max-h-[300px] rounded-md object-contain' />
                  // </>
                ) ) }
              </div>
            ) }
            { !!msg.audio?.length && (
              <div className='flex flex-col gap-4 p-3 rounded-md'>
                { msg.audio.map( ( item, i ) => (
                  // <>
                  <audio controls src={ URL.createObjectURL( new Blob( [ item ], { type: item?.type } ) ) } key={ i } />
                  // </>
                ) ) }
              </div>
            ) }
            <div className='relative flex items-start group max-w-full'>
              <p className="msg text-[0.75rem] leading-[1.225rem] rounded-md break-all max-w-full">{ msg.value }</p>
              { previousMsgFromSameUser && (
                <p className="date absolute w-fit pt-[3px] whitespace-nowrap right-[calc(100%+15px)] text-[0.6rem] text-muted-foreground hidden group-hover:inline">{ formatMessageDate( msg.date ).split( " at " )[ 1 ] }</p>
              ) }
            </div>
          </div>
        </div>
      </div>
    );
};

export default Message;