import React from 'react'
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import ExerciseForm from '@/components/ExerciseForm';

const page = async() => {
    const session = await getCurrentUser();
    if (!session?.user) redirect('/') 
  return (
    <section className='flex w-full justify-center px-8'>
        
        <ExerciseForm 
            type='create' 
            session={session}
            />
    </section >
  )
}

export default page