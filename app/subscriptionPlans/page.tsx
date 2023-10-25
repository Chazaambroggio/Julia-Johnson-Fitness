import React from 'react'
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { fetchUser } from '@/lib/users/userActions';
import TrainerSubscriptionPlans from '@/components/TrainerSubscriptionPlans';

const page = async ({params: { trainerId }}: {params: { trainerId: string }}) => {
     const session = await  getCurrentUser();
     if (!session?.user || session?.user?.role != 'trainer' ) {
          redirect('/');
     }

     const user = await fetchUser(trainerId);

     function capitalizeFirstLetters(username : string) {
          return username.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
     }
    const capitalizedUsername = capitalizeFirstLetters(user?.username);
    const firstName = capitalizedUsername.split(' ')[0];

     
    return (
            <div className="flex flex-col self-center h-full w-full items-center justify-start gap-8 max-w-[1024px]">
                <h1 className='font-semibold text-xl'>Welcome, {firstName}</h1>

                <TrainerSubscriptionPlans 
                    trainerId={trainerId}
                    session={session}
                />

          </div>
    )
}

export default page