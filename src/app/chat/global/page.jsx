import { AvatarContainer } from '@/components/AvatarContainer';
import { EllipsisVertical } from 'lucide-react';
import React from 'react';

const page = () => {
  return (
    <div className='w-full h-full'>
      <div className='header w-full max-w-full flex justify-between items-center py-3 px-6 border-b'>
        <div className='w-full h-full flex gap-6 items-center'>
          <AvatarContainer />
          <h1 className='text-[1.05rem]'>Global</h1>
        </div>
        <EllipsisVertical />
      </div>
    </div>
  );
};

export default page;