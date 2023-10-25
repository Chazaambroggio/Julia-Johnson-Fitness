'use client';
import { SessionInterface, SubscriptionInterface } from '@/common.types'
import React, { useEffect, useState } from 'react'
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';


type Props = {
    subscriptionPlan: SubscriptionInterface;
    session: SessionInterface
    subscriptionRequestStatus?: string; 
    subscribedTo?: string;
}

const CardSubscription = ({subscriptionPlan, session, subscriptionRequestStatus, subscribedTo}: Props) => {

    // Fix the buttons to have proper functionality for all subscription status.


    const router = useRouter();
    const [buttonText, setButtonText] = useState('Subscribe');
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
      if (subscribedTo == subscriptionPlan._id) {
        if (subscriptionRequestStatus == 'pending') {
            setButtonText('Cancel Subscription Request');
        } else if (subscriptionRequestStatus == 'completed') {
            setButtonText('Manage Subscription');
        }
      }
    
    }, [])
    
 
    const handleClick = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (subscriptionRequestStatus == 'pending') {
                // Cancel subscription reuqest via API.
                const response = await axios.put('/api/subscriptionRequest/edit', {
                    session: session,
                });
                console.log('Subscription request successfully canceled:', response.data);
                setButtonText('Subscribe');
                
    
            } else if (subscriptionRequestStatus == 'completed') {
                // Manage subscription.
    
            } else {
                router.push(`/subscription/subscriptionRequest/${subscriptionPlan._id}`)
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = () => {
        router.push(`/subscription/${subscriptionPlan?._id}/edit`)
    }

  return (
    <div 
        className="flex flex-col w-full justify-between items-center gap-2 
        my-1 p-2 rounded bg-white overflow-hidden shadow-lg hover:shadow-blue-600/50" 
    >
        <h4 className="text-lg font-semibold">
            {subscriptionPlan.title}
        </h4>

        <p>
            <span className='text-6xl font-bold'> 
                {subscriptionPlan.price} 
            </span> 
            <span>/{subscriptionPlan?.frequency}</span>
        </p>
        
        <div className='flex flex-col w-full justify-between items-center p-2 max-w-[824px]'>
            <p className="w-full align-left font-medium">
                What you get
            </p>

            <ul className='mx-4 list-disc'>
                {subscriptionPlan.benefits.map((benefit) => (
                <li 
                    key={benefit}
                    className='text-sm'
                >
                    {benefit}
                </li>

                ))}
            </ul>
        </div>
        
        {!session?.user?.subscriptionId && (
            <Button
                title={buttonText}
                handleClick={handleClick}
                isSubmitting={isSubmitting}
                />
        )}

        {session?.user?.role == 'trainer' && (
            <div className='flex w-full justify-end items-center'>
                <button 
                    onClick={handleEdit}
                    className='p-2 rounded-full hover:bg-gray-100'>
                    <FontAwesomeIcon  
                        icon={faPenToSquare}
                        className='w-5 h-5 text-slate-400 cursor-pointer hover:text-blue-600'
                    />

                </button>
                
            </div>
        )}

    </div>
  )
}

export default CardSubscription