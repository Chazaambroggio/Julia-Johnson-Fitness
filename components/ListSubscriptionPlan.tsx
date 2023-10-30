'use client'
import React from 'react'
import { SessionInterface, SubscriptionInterface } from '@/common.types'
import CardSubscription from './CardSubscription'
import ButtonFloatingIcon from './ButtonFloatingIcon'
import { useRouter } from 'next/navigation'

type Props = {
    subscriptionPlanList: SubscriptionInterface[],
    session: SessionInterface
}


const ListSubscriptionPlan = ({subscriptionPlanList, session} : Props) => {

  const router  = useRouter()

  function handleClick() {
      router.push(`/subscriptions/create`)
      }

  return (
    <div className='flex flex-col items-center w-full gap-4'>

      {subscriptionPlanList.map((subscriptionPlan) => (
          <CardSubscription 
              key={subscriptionPlan._id}
              subscriptionPlan={subscriptionPlan}
              session={session}
          />
              
      ))}

      {session?.user?.role == 'trainer' && (
        <ButtonFloatingIcon
          iconName='faPlusCircle'
          handleClick={handleClick}
        />
      )}  
    </div>
  )
}

export default ListSubscriptionPlan