import FormSubscription from '@/components/FormSubscription'
import { getCurrentUser } from '@/lib/session';
import { fetchSubscriptionPlan } from '@/lib/subscriptionPlans/subscriptionPlanActions';
import { convertSubscriptionPlanToPlainData } from '@/lib/subscriptionPlans/subscriptionPlanHelpers';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async({params: { subscriptionPlanId }}: {params: { subscriptionPlanId: string }}) => {

  const session = await getCurrentUser();
  if (session?.user?.role !== 'trainer') redirect('/') 


  const subscriptionPlan = await fetchSubscriptionPlan(subscriptionPlanId)
  const subscriptionPlainData = await convertSubscriptionPlanToPlainData(subscriptionPlan)

  return (
    <div className='flex w-full justify-center self-center max-w-[1024px]'>
        <FormSubscription
            type='edit' 
            session={session}
            subscription={subscriptionPlainData}

            />
    </div>
  )
}
export default page