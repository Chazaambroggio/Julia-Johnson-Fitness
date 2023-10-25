import React from 'react'
import { getCurrentUser } from '@/lib/session';
import { fetchSubscriptionRequest } from '@/lib/subscriptionRequests/subscriptionRequestActions'
import { redirect } from 'next/navigation';
import { fetchUser } from '@/lib/users/userActions';
import { fetchSubscriptionPlan } from '@/lib/subscriptionPlans/subscriptionPlanActions';
import { SubscriptionInterface, SubscriptionRequestInterface, UserInterface } from '@/common.types';
import { getCapitalizedFirstName } from '@/lib/actions';

const page = async ({params: { subscriptionRequestId }} : {params: { subscriptionRequestId: string }}) => {
  const session = await  getCurrentUser();
  if (!session?.user) {
      redirect('/') 
  }

  const subscriptionRequest = await fetchSubscriptionRequest(subscriptionRequestId) as SubscriptionRequestInterface

  const user = await fetchUser(subscriptionRequest.userId) as UserInterface
  const firstName = getCapitalizedFirstName(user?.username)

  const subscriptionPlan = await fetchSubscriptionPlan(subscriptionRequest.subscriptionPlanId) as SubscriptionInterface

  console.log('subscriptionRequest: ', subscriptionRequest)

  return (
    <section className='flex flex-col justify-center items-center self-center max-w-[1024px] w-full gap-8'>
      <h1 className='font-semibold text-xl'>{firstName}'s Subscription Request</h1>

    <div className='flex flex-col w-full gap-2'>
      <h2 className='w-full text-left font-medium text-blue-800'>
        Details
      </h2>
      <div className='flex flex-col w-full gap p-2 border rounded'>
        <div className='flex w-full gap-2'>
          <p>User: </p>
          <p>{user?.username}</p>
        </div>

        <div className='flex w-full gap-2'>
          <p>Subscription Plan: </p>
          <p>{subscriptionPlan?.title}</p>
        </div>

        <div className='flex w-full gap-2'>
          <p>Status: </p>
          <p>{subscriptionRequest?.status}</p>
        </div>

        <div className='flex w-full gap-2'>
          <p>Created At: </p>
          <p>{subscriptionRequest?.createdAt?.toISOString().split('T')[0]}</p>
        </div>
        {subscriptionRequest?.completedAt && (
          <div className='flex w-full gap-2'>
            <p>Completed At: </p>
            <p>{subscriptionRequest?.completedAt?.toISOString().split('T')[0]}</p>
          </div>
        )}

        {subscriptionRequest?.canceledAt && (
          <div className='flex w-full gap-2'>
            <p>Canceled At: </p>
            <p>{subscriptionRequest?.canceledAt?.toISOString().split('T')[0]}</p>
          </div>
        )}
        
      </div>
    </div>

    <div className='flex flex-col w-full gap-2'>
      <h2 className='w-full text-left font-medium text-blue-800'>
        Questionnaire
      </h2>

      <div className='flex flex-col w-full gap-2 p-2'>
       {subscriptionRequest?.questionnaireAnswer.map((question) => (

        <div className='flex flex-col w-full gap-2 p-2 border rounded'>
          <div className='flex flex-col w-full'>
            <p className='font-medium text-slate-900'>{question?.title}</p>
            <p className='text-sm font-light text-slate-500'>{question?.question}</p>
          </div>
          <p className='text-sm text-slate-800'>{question?.answer}</p>

        </div>

       ))}
      </div>
    </div>

    </section>
  )
}

export default page