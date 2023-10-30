'use client'
import React from 'react'
import CardWorkout from './CardWorkout';
import { CompletionHistoryInterface, SessionInterface, UserInterface, WorkoutInterface } from '@/common.types';
import ButtonFloatingIcon from './ButtonFloatingIcon';
import { useRouter } from 'next/navigation';

type Props = {
    type: 'free' | 'paid';
    user: UserInterface;
    workouts: {
      workoutPlainData: WorkoutInterface,
      logPlainData?: CompletionHistoryInterface,
    }[];
    session: SessionInterface;
    displayButton: boolean
  };

const ListWorkout = ({type, user, workouts, session, displayButton }: Props) => {
  const router = useRouter();

  function handleClick() {
      router.push(`/workout/create/${user?._id}`)
  }

  return (
    <section className='flex flex-col justify-center items-center w-full'>

      <h2 className='w-full text-left font-medium text-blue-800'>
        {(type == 'paid') 
          ? 'Premium Workouts'
          : 'Free Workouts'
          }
        
      
      </h2>

      {workouts.map((item) => (
        <>
          { item && (
            <CardWorkout 
              key={item.workoutPlainData._id}
              user={user}
              workout={item.workoutPlainData}
              log={item.logPlainData}
              />
            )}
        </>
      ))}
        
      {(workouts.length < 1 && session?.user?.role == 'client') && (<p> Your workouts are coming soon!</p>) } 
          
      {session?.user?.role == 'trainer' && displayButton && (
        <ButtonFloatingIcon
            iconName='faPlusCircle'
            handleClick={handleClick}
          />
      )}
    </section> 
  )
}

export default ListWorkout