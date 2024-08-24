"use client";

import { AvatarContainer } from '@/components/AvatarContainer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EllipsisVertical } from 'lucide-react';
import React from 'react';

const page = () => {
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
      <ScrollArea className="chat-section relative w-full max-w-full flex flex-col flex-1 max-h-full px-5 pt-2 pb-1">
        <div className='flex relative gap-4 w-auto max-w-[60%]'>
          <AvatarContainer />
          <div className='flex flex-col gap-1 pt-1'>
            <p className="name text-sm">User</p>
            <p className="msg text-[0.8rem] leading-[1.24rem]">muaahahaha ahaha mauahahah hahahaha uaahahaha ahaha mauahahah hahahaha uaahahaha ahaha mauahahah hahahaha uaahahaha ahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha mauahahah hahahaha</p>
          </div>
        </div>
      </ScrollArea>
      {/* </div> */ }


      <div className='w-full py-2 mt-2 px-6 relative bottom-2 flex justify-center items-center'>
        <input type="text" placeholder='Type Message' className='px-3 py-2 text-sm w-full md:w-2/3 rounded-md border outline-none bg-background text-foreground' />
      </div>
    </div>
  );
};

export default page;