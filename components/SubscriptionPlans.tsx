import { UserInterface } from '@/common.types';
import React from 'react'
import Button from './Button';
import Link from 'next/link';
import { getStripeSubscriptionAndProduct } from '@/lib/actions/stripe';


type Props = {
    user: UserInterface;
  };

const SubscriptionPlans = async({ user }: Props) => {

    let stripeSubscription = null;
    if (user?.subscriptionId) {
        stripeSubscription = await getStripeSubscriptionAndProduct(user?.subscriptionId)
    }

    return (
    <section className='flex flex-col w-full p-2 bg-slate-100'>
        <h2 className='text-xl '>My Subscription Plan</h2>

        <div 
            className="flex w-full justify-between items-center gap-2 my-1 p-2 rounded bg-white overflow-hidden 
                cursor-pointer shadow hover:border-slate-300/50" 
            >

            <h3 className="text-lg font-semibold">
                    {user?.subscriptionId && stripeSubscription?.subscription.status == 'active'
                        ? `${stripeSubscription?.product?.name}`
                        : 'Free Plan' 
                    }
            </h3>
            <div>
                <Link            
                    href={`/subscription/plans`}
                    className='flex w-full'
                    >
                    <Button
                        title='View Subscription Plans'
                    />
                </Link>

            </div>
        </div>
    </section>
  )
}

export default SubscriptionPlans