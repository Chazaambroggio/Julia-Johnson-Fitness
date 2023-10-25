import React from 'react'
import ButtonStripe from './ButtonStripe'
import { UserInterface } from '@/common.types'
import { fetchSubscriptionDetailsForPayment } from '@/lib/subscriptionRequests/subscriptionRequestActions'


type Props = {
    user: UserInterface,
}

const CardRequestPayment = async ({user}: Props) => {

    const subscriptionDetails = await fetchSubscriptionDetailsForPayment(user?._id)

  return (
    <div className='flex flex-col justify-center items-center w-full p-4 gap-6 bg-white rounded border shadow hover:border-slate-300/50'>

        <div className='flex flex-col justify-center'>
            <p className='text-center text-lg font-semibold'>
                Your workout is here!            
            </p>
            <p className='text-center'>
            Proceed to checkout to start your subscription!         
            </p>
        </div>

        <ButtonStripe 
            title={subscriptionDetails?.title}
            amount={subscriptionDetails?.price}
        />
    </div>
  )
}

export default CardRequestPayment