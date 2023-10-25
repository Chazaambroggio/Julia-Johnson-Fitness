import FormSubscription from '@/components/FormSubscription'
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async() => {
    const session = await getCurrentUser();
    if (session?.user?.role !== 'trainer') redirect('/') 

  return (
    <div className='flex w-full justify-center self-center max-w-[1024px]'>
        <FormSubscription
            type='create' 
            session={session}
            />
    </div>
  )
}

export default page