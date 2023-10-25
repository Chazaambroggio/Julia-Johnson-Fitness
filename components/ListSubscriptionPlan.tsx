import React from 'react'
import { SessionInterface, SubscriptionInterface } from '@/common.types'
import CardSubscription from './CardSubscription'

type Props = {
    subscriptionPlanList: SubscriptionInterface[],
    session: SessionInterface
}


const ListSubscriptionPlan = ({subscriptionPlanList, session} : Props) => {

  return (
    <div className='flex flex-col w-full gap-4'>
        {subscriptionPlanList.map((subscriptionPlan) => (
            
            <CardSubscription 
                key={subscriptionPlan._id}
                subscriptionPlan={subscriptionPlan}
                session={session}
            />
                
        ))}  
    </div>
  )
}

export default ListSubscriptionPlan