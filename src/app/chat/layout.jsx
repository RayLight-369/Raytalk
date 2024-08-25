"use client";

import { AvatarContainer } from '@/components/AvatarContainer';
import { ResizableSidebar } from '@/components/ResizeableSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMessages } from '@/Contexts/Messages';
import { cn } from '@/lib/utils';
import { ChevronRight, EllipsisVertical } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';


const AccountsSection = () => {

  const pathName = usePathname();
  const { name, msgs, unseenMessages } = useMessages();

  useEffect( () => {
    console.log( unseenMessages );
  }, [ unseenMessages ] );

  return (
    <div className='w-full h-full'>
      <div className='header w-full max-w-full py-6 px-6 flex justify-between items-center'>
        <h1 className='text-lg'>Messages</h1>
        <EllipsisVertical />
      </div>
      <div className='w-full max-w-full pt-7 pb-6 flex flex-col'>
        { name.trim().length && (
          <ScrollArea className={ "overflow-auto" }>
            <Link href={ "/chat/global" } className={ cn( 'flex relative group items-center w-full max-w-full gap-5 hover:bg-muted px-6 py-2', pathName.includes( "global" ) ? "bg-muted" : "" ) }>
              <AvatarContainer />
              <p className='relative'>Global</p>
              { !!unseenMessages &&
                <span class="absolute right-14 top-1/2 -translate-y-1/2 flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75"></span>
                  <span class="animate-pulse relative inline-flex rounded-full h-3 w-3 bg-foreground"></span>
                </span> }
              <ChevronRight className='absolute right-6 translate-x-[30px] invisible p-[2px] opacity-0 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100' />
            </Link>
          </ScrollArea>
        ) }
      </div>
    </div>
  );

};

const layout = ( { children } ) => {
  return (
    <ResizableSidebar left={ <AccountsSection /> } right={ children } />
  );
};

export default layout;