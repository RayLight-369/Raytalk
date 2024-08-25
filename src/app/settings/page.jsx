"use client";

import Selection from '@/components/Selection';
import { Label } from '@/components/ui/label';
import { useMessages } from '@/Contexts/Messages';
import { useEffect } from 'react';

const page = () => {

  const { CONFIG, setCONFIG } = useMessages();

  const handleDisplayValueChange = ( value ) => setCONFIG( prev => ( { ...prev, displayMode: value } ) );

  return (
    <section id="settings" className='w-full h-full py-6 px-10 flex flex-col gap-5'>
      <h1 className='text-4xl font-bold'>Settings</h1>
      <div id="properties" className='w-full'>
        <div id="display-mode" className={ "flex gap-3 items-center" }>
          <Label htmlFor="displayMode">Display Mode: </Label>
          <Selection onChange={ handleDisplayValueChange } value={ CONFIG.displayMode } id="displayMode" name="displayMode" />
        </div>
      </div>
    </section>
  );
};

export default page;