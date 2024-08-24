'use client';

import { PopUp } from '@/components/PopUp';
import { useMessages } from '@/Contexts/Messages';
import React from 'react';

const page = () => {

  const { name, setName } = useMessages();

  return (
    <div>
      <PopUp setName={ setName } />
    </div>
  );
};

export default page;