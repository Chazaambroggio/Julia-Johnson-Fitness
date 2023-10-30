import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import FormSubscriptionRequest from '@/components/FormSubscriptionRequest';
import { fetchSubscriptionPlan } from '@/lib/subscriptionPlans/subscriptionPlanActions';
import { convertSubscriptionPlanToPlainData } from '@/lib/subscriptionPlans/subscriptionPlanHelpers';


const page = async ({params: { subscriptionId }}: {params: { subscriptionId: string }}) => {
    
   const session = await  getCurrentUser();
    if (!session?.user) redirect('/');

    const subscriptionPlan = await fetchSubscriptionPlan(subscriptionId);
    const subscriptionPlainData = await convertSubscriptionPlanToPlainData(subscriptionPlan)
    
  return (
    <div className='flex flex-col justify-center items-center w-full h-full px-10'>
        <FormSubscriptionRequest 
            session={session}
            subscriptionPlan={subscriptionPlainData}
        />
    </div>
  )
}

export default page