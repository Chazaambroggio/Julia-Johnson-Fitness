import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import ListSubscriptionPlan from './ListSubscriptionPlan';
import { fetchTrainerSubscriptionPlans } from '@/lib/subscriptionPlans/subscriptionPlanActions';
import { SessionInterface, SubscriptionInterface } from '@/common.types';
import { convertSubscriptionPlanToPlainData } from '@/lib/subscriptionPlans/subscriptionPlanHelpers';


type Props = {
    trainerId: string,
    session: SessionInterface,
}

const TrainerSubscriptionPlans = async({trainerId, session} : Props) => {

    const allSubscriptionPlans = await fetchTrainerSubscriptionPlans(trainerId)
    
    const AllSubscriptionPlansPlainData = await Promise.all(allSubscriptionPlans.map(async (plan : SubscriptionInterface) => {
      const subscriptionPlainData = await convertSubscriptionPlanToPlainData(plan);
      return subscriptionPlainData;
    }));

  return (
    <div className='flex flex-col justify-start items-center w-full h-full'>
                     
        <ListSubscriptionPlan 
            subscriptionPlanList={AllSubscriptionPlansPlainData}
            session={session}
        />


    </div>
  )
}

export default TrainerSubscriptionPlans