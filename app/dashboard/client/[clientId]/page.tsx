import React from 'react'
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import NextWorkout from '@/components/NextWorkout';
import CompletedWorkoutCounter from '@/components/CompletedWorkoutCounter';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { fetchUser } from '@/lib/users/userActions';


const page = async ({params: { clientId }}: {params: { clientId: string }}) => {
     const session = await  getCurrentUser();
     if (!session?.user || session?.user?.role != 'client' ) {
          redirect('/');
     }

     const user = await fetchUser(clientId);

     function capitalizeFirstLetters(username : string) {
          return username.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
     }
    const capitalizedUsername = capitalizeFirstLetters(user?.username);
    const firstName = capitalizedUsername.split(' ')[0];

     
    return (
            <div className="flex flex-col self-center h-full w-full items-center justify-start gap-8 max-w-[1024px]">
                <h1 className='font-semibold text-xl'>Welcome, {firstName}</h1>

                {user?.subscription == 'paid' && (
                    <NextWorkout 
                        user={user}
                    />
                )}

               <SubscriptionPlans 
                    user={user}
               />

               <CompletedWorkoutCounter 
                    user={user}
               />
          </div>
    )
}

export default page