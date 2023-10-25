import React from 'react'
import { SubscriptionInterface, SubscriptionRequestInterface } from '@/common.types'
import CardSubscriptionrequest from './CardSubscriptionrequest'
import { convertSubscriptionRequestToPlainData } from '@/lib/subscriptionRequests/subscriptionRequestHelpers'
import { fetchSubscriptionPlan } from '@/lib/subscriptionPlans/subscriptionPlanActions'
import { convertSubscriptionPlanToPlainData } from '@/lib/subscriptionPlans/subscriptionPlanHelpers'


type Props = {
    requestList: SubscriptionRequestInterface[],
}

const ListSubscriptionRequest = async({requestList} : Props) => {

  const subscriptionRequestData = await Promise.all(requestList.map(async (request: SubscriptionRequestInterface) => {

    const requestPlainData = await convertSubscriptionRequestToPlainData(request);

    const subscriptionPlan = await fetchSubscriptionPlan(request.subscriptionPlanId) as SubscriptionInterface;
    const subscriptionPlanPlainData = await convertSubscriptionPlanToPlainData(subscriptionPlan);

    return {requestPlainData, subscriptionPlanPlainData}
  
  }))

  let trainerId;
  if (requestList[0].trainerId) {
    trainerId = requestList[0].trainerId
  }

  return (
    <section className='flex flex-col justify-center items-center w-full'>
        
        <h2 className='w-full text-left font-medium text-blue-800'>Requests</h2>

        {subscriptionRequestData.reverse().map((request) => (
            <CardSubscriptionrequest
                key={request?.requestPlainData._id} 
                request={request}
            />
        ))}

    </section>
  )
}

export default ListSubscriptionRequest