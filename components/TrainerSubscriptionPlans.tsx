import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import ListSubscriptionPlan from './ListSubscriptionPlan';
import { fetchTrainerSubscriptionPlans } from '@/lib/subscriptionPlans/subscriptionPlanActions';
import { QuestionInterface, SessionInterface, SubscriptionInterface } from '@/common.types';


type Props = {
    trainerId: string,
    session: SessionInterface,
}

const TrainerSubscriptionPlans = async({trainerId, session} : Props) => {

    const allSubscriptionPlans = await fetchTrainerSubscriptionPlans(trainerId)
    
    const AllSubscriptionPlansPlainData = await Promise.all(allSubscriptionPlans.map(async (plan : SubscriptionInterface) => {
        return {
          _id: plan?._id.toString(),
          trainerId: plan?.trainerId.toString(),
          title: plan?.title,
          price: plan?.price,
          benefits: plan?.benefits,
          frequency: plan?.frequency,
          questionnaire: plan?.questionnaire.map((question : QuestionInterface) => ({
            _id: question?._id?.toString(),
            title: question?.title,
            question: question?.question,
          }))
        }
      }));

  return (
    <div className='flex flex-col justify-start items-center w-full h-full'>
                     
        <div className='flex w-full justify-center'>
            <Link 
                href= {`/subscription/plans/create`}
                className='flex w-10 h-10'
            >
                <FontAwesomeIcon  
                icon={faPlusCircle}
                className='flex w-10 h-10 text-xl text-blue-600 rounded-full shadow-md'
                />
            </Link>

        </div>

        <ListSubscriptionPlan 
            subscriptionPlanList={AllSubscriptionPlansPlainData}
            session={session}
        />


    </div>
  )
}

export default TrainerSubscriptionPlans