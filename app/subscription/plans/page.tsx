import React from 'react'
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import CardSubscription from '@/components/CardSubscription';
import { SubscriptionInterface} from '@/common.types';
import { fetchAllSubscriptionPlans } from '@/lib/subscriptionPlans/subscriptionPlanActions';
import { fetchUserLatestSubscriptionRequest } from '@/lib/subscriptionRequests/subscriptionRequestActions';
import { convertSubscriptionPlanToPlainData } from '@/lib/subscriptionPlans/subscriptionPlanHelpers';


const page = async () => {
   const session = await  getCurrentUser();
   
    if (!session?.user) redirect('/');

    const allSubscriptionPlans = await fetchAllSubscriptionPlans();
    const subscriptionPlainData = await Promise.all(allSubscriptionPlans.map(async (plan: SubscriptionInterface) => {
      const subscriptionPlainData = await convertSubscriptionPlanToPlainData(plan);
      return subscriptionPlainData
    }))


    const subscriptionRequest = await fetchUserLatestSubscriptionRequest(session?.user?.id, 'pending');

  return (
    <section className='flex flex-col h-full justify-start items-center gap-8'>
        <h2 className='text-3xl'>Subscription Plans</h2>

        <div className='flex flex-col w-full p-4 bg-slate-100 rounded md:max-w-max gap-4'>
            <h3 className="text-lg">
                    Compare Plans 
            </h3>

            { subscriptionPlainData.map((subscriptionPlan : SubscriptionInterface) => (
                
                <CardSubscription 
                    key={subscriptionPlan.title}
                    subscriptionPlan={subscriptionPlan}
                    session={session}
                    subscriptionRequestStatus={subscriptionRequest?.status}
                    subscribedTo={subscriptionRequest?.subscriptionPlanId?.toString()} 
                />

            ))}

        </div>
    </section>
  )
}

export default page