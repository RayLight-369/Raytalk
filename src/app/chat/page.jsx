'use client';

import { PopUp } from '@/components/PopUp';
import { useMessages } from '@/Contexts/Messages';
import { useEffect, useState } from 'react';

const page = () => {

  const { name, setName } = useMessages();

  return (
    <div>
      { !name.trim().length ? (
        <PopUp setName={ setName } />
      ) : (
        <p>Currently there is only global channel</p>
      ) }
    </div>
  );
};

export default page;