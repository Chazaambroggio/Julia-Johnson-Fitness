'use client'
import React from 'react'
import { useRouter } from 'next/navigation';

import { SubscriptionInterface, SubscriptionRequestInterface } from '@/common.types'

type Props = {
    request:{
      requestPlainData: SubscriptionRequestInterface;
      subscriptionPlanPlainData: SubscriptionInterface;
    }
     
}

const CardSubscriptionrequest = ({request} : Props) => {

  // Code a button to email user to facilitate the schedule of a call.

  const router = useRouter();

  function handleClick() {
    router.push(`/subscriptionRequest/${request?.requestPlainData?._id}`) 
  }

  return (
    <div className="flex w-full justify-between gap-2 my-1 p-2 rounded bg-white overflow-hidden 
                    cursor-pointer shadow hover:border-slate-300/50" 
          onClick={handleClick}
        >
        <div className='flex w-wull overflow-hidden gap-2 text-sm'>
            <p> {request?.requestPlainData?.createdAt?.toISOString().split('T')[0]} </p> 
            <p>{request?.subscriptionPlanPlainData?.title}</p>
        </div>
        
        <p className='text-sm'>{request?.requestPlainData?.status}</p>
    </div>
  )
}

export default CardSubscriptionrequest