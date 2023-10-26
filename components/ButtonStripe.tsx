'use client';
import React from 'react'
import { formatAmountForDisplay } from '@/utils/stripe-helpers'
import { createCheckoutSession } from '@/lib/actions/stripe'
import { useRouter } from 'next/navigation';

type Props = {
    amount: number,
    title: string,
}

const ButtonStripe = ({amount, title}: Props) => {
  
  const router = useRouter();
  
  const handleClick = async () => {
    const response = await createCheckoutSession(amount, title)
    console.log('Response checkoutURL: ', response.checkoutSessionUrl)
    router.push(response.checkoutSessionUrl); 
  }

  return (
   
    <button
      className="flex justify-center items-center gap-3 px-3 py-2 
                text-white bg-blue-600 rounded-xl text-sm font-medium max-md:w-full
                transition duration-300 ease-out"
      onClick={handleClick}
    >
        Checkout {formatAmountForDisplay(amount, 'usd')}
    </button>

  )
}

export default ButtonStripe