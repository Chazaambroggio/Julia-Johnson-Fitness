import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { QuestionInterface } from '@/common.types';
import FormSubscriptionRequest from '@/components/FormSubscriptionRequest';
import { fetchSubscriptionPlan } from '@/lib/subscriptionPlans/subscriptionPlanActions';


const page = async ({params: { subscriptionId }}: {params: { subscriptionId: string }}) => {
    
   const session = await  getCurrentUser();
    if (!session?.user) redirect('/');

    const subscriptionPlan = await fetchSubscriptionPlan(subscriptionId);
    
    const subscriptionPlanPlainData = {
      _id: subscriptionPlan?._id.toString(),
      trainerId: subscriptionPlan?.trainerId.toString(),
      title: subscriptionPlan?.title,
      price: subscriptionPlan?.price,
      benefits: subscriptionPlan?.benefits,
      frequency: subscriptionPlan?.frequency,
      questionnaire: subscriptionPlan?.questionnaire.map((question : QuestionInterface) => ({
        _id: question?._id?.toString(),
        title: question?.title,
        question: question?.question,
      }
      ))
    }

    
  return (
    <div className='flex flex-col justify-center items-center w-full h-full px-10'>
        <FormSubscriptionRequest 
            session={session}
            subscriptionPlan={subscriptionPlanPlainData}

        />
        
    </div>
  )
}

export default page