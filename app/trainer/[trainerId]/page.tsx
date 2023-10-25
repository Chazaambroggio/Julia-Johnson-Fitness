import React from 'react'
import Image from 'next/image';
import AuthProviders from '@/components/AuthProviders';



const page = ({params: { trainerId }}: {params: { trainerId: string }}) => {

    // Create a page for each trainer.
    // The trainer page will have a login button with the id of the trainer.
    // This will redirect you to the trainer page after signup/signin
    // This trainer page can update the user's trainerId in the database.

  return (

    <main className="flex flex-col h-full justify-center items-center p-4">
        <div className='flex flex-col w-full justify-center items-center'>
            <Image
                src="/assets/logo/logo-bg-transperent.png"
                width={128}
                height={128}
                alt='Fitness logo'
            />
            <h1 
                className='text-xl font-bold text-center md:text-5xl'
                > 
                Julia Johnson Fitness
            </h1>
        </div>
        {/* <div className='flex w-full justify-center items-center'>
            <AuthProviders 
                trainerId={trainerId}
            />
        </div> */}
    </main>

   
  )
}

export default page