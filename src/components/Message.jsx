import React from 'react';
import { AvatarContainer } from './AvatarContainer';
import { cn } from '@/lib/utils';

const Message = ( { msg, socket, displayMode, previousMsgFromSameUser } ) => {

  if ( displayMode.toLowerCase() === "casual" )
    return (
      <div className={ cn( 'flex relative gap-4 w-full max-w-[60%] py-4', msg.fromID == socket.id ? "flex-row-reverse float-right" : "", previousMsgFromSameUser ? "pt-0 pb-2" : "" ) }>
        <AvatarContainer className={ previousMsgFromSameUser ? "invisible h-0" : "visible" } />
        <div className={ cn( 'flex flex-col gap-1', msg.fromID == socket.id ? "items-end" : "" ) }>
          { !previousMsgFromSameUser && <p className="name text-sm">{ msg.fromName }</p> }
          <p className="msg text-[0.8rem] leading-[1.24rem] rounded-md py-1 px-2 bg-muted break-all max-w-full">{ msg.value }</p>
        </div>
      </div>
    );
  else
    return (
      <div className={ cn( 'flex relative gap-3 w-full max-w-full px-4 py-[0.35rem] border-t first:border-none', previousMsgFromSameUser ? "border-none pt-0" : "" ) }>
        <AvatarContainer className={ previousMsgFromSameUser ? "invisible h-0" : "visible" } />
        <div className={ cn( 'flex flex-col gap-1' ) }>
          { !previousMsgFromSameUser && <p className="name text-sm italic">{ msg.fromName }</p> }
          <p className="msg text-[0.75rem] leading-[1.225rem] rounded-md break-all max-w-full">{ msg.value }</p>
        </div>
      </div>
    );
};

export default Message;