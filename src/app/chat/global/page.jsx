"use client";

import { AvatarContainer } from '@/components/AvatarContainer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessages } from '@/Contexts/Messages';
import { cn } from '@/lib/utils';
import { socket } from '@/socketio';
import { EllipsisVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const page = () => {

  const [ inputValue, setInput ] = useState( "" );
  const { msgs, name } = useMessages();
  const router = useRouter();

  useEffect( () => {
    setTimeout( () => {
      if ( !name.trim().length ) router.push( "/chat" );
    }, 2000 );
  }, [] );

  return (
    <div className='w-full h-full relative overflow-y-hidden flex flex-col'>
      <div className='header w-full max-w-full flex justify-between items-center py-3 px-6 border-b'>
        <div className='w-full h-full flex gap-6 items-center'>
          <AvatarContainer />
          <h1 className='text-[1.05rem]'>Global</h1>
        </div>
        <EllipsisVertical />
      </div>


      {/* <div className="chat-section relative w-full px-6"> */ }
      <ScrollArea className="chat-section relative w-full max-w-full flex-1 max-h-full px-5 pt-[2px] pb-1">
        { msgs.map( ( msg, i ) => (
          // <div className={ cn( 'relative w-full h-full', msg.fromID == socket.id ? "float-right" : "" ) } key={ i }>
          <>
            { msg.type != "note" ? (
              <div className={ cn( 'flex relative gap-4 w-full max-w-[60%] py-4', msg.fromID == socket.id ? "flex-row-reverse float-right" : "" ) } key={ i }>
                <AvatarContainer />
                <div className={ cn( 'flex flex-col gap-1 pt-1', msg.fromID == socket.id ? "items-end" : "" ) }>
                  <p className="name text-sm">{ msg.fromName }</p>
                  <p className="msg text-[0.8rem] leading-[1.24rem] rounded-md p-2 bg-muted break-all max-w-full">{ msg.value }</p>
                </div>
              </div>
            ) : (
              <div className={ 'flex relative gap-4 w-full max-w-[100%] py-4' } key={ i }>
                <div className={ 'flex justify-center pt-1' }>
                  <p className="name text-sm text-center text-muted-foreground">{ msg.name } just joined</p>
                </div>
              </div>
            ) }
          </>
          // </div>
        ) ) }
      </ScrollArea>
      {/* </div> */ }


      <div className='w-full py-2 mt-2 px-6 relative bottom-2 flex justify-center items-center'>
        <input onKeyDown={ ( e ) => {
          if ( e.key == "Enter" && e.target.value.trim().length ) {
            socket.emit( "msg", inputValue, socket.id, name );
            setInput( "" );
          }
        } } onChange={ ( e ) => setInput( e.target.value ) } value={ inputValue } type="text" placeholder='Type Message' className='px-3 py-2 text-sm w-full md:w-2/3 rounded-md border outline-none bg-background text-foreground' />
      </div>
    </div>
  );
};

export default page;