import { QuestionInterface } from '@/common.types';
import FormSubscription from '@/components/FormSubscription'
import { getCurrentUser } from '@/lib/session';
import { fetchSubscriptionPlan } from '@/lib/subscriptionPlans/subscriptionPlanActions';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async({params: { subscriptionPlanId }}: {params: { subscriptionPlanId: string }}) => {

  const session = await getCurrentUser();
  if (session?.user?.role !== 'trainer') redirect('/') 


  const subscriptionPlan = await fetchSubscriptionPlan(subscriptionPlanId)

  const subscriptionPlainData = {
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
      })),
    }


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