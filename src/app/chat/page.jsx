'use client';

import { PopUp } from '@/components/PopUp';
import { useMessages } from '@/Contexts/Messages';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const page = () => {

  const { name, setName } = useMessages();
  const router = useRouter();

  useEffect( () => {
    router.prefetch( "/chat/global" );
    if ( name.trim().length ) {
      router.push( "/chat/global" );
    }
  }, [] );

  return (
    <div>
      { !name.trim().length && (
        <PopUp setName={ setName } />
      ) }
    </div>
  );
};

export default page;