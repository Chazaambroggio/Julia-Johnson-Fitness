import { UserInterface } from '@/common.types';
import { fetchUserActiveDays, fetchUserCompleteExercises, fetchUserCompleteWorkouts } from '@/lib/completionHistory/completionHistoryActions';
import React from 'react';

type Props = {
    user: UserInterface;
  };

const CompletedWorkoutCounter = async({ user }: Props) => {

  
    const completedWorkouts = await fetchUserCompleteWorkouts(user?._id)
    const completedExercises = await fetchUserCompleteExercises(user?._id)
    const activeDays = await fetchUserActiveDays(user?._id)

  return (
    <section className='flex flex-col w-full p-2 bg-slate-100 rounded'>
      <h2 className='text-xl'>Achivements</h2>

      <div className="flex items-center w-full gap-2 my-1 bg-white rounded overflow-hidden cursor-pointer shadow hover:border-slate-300/50" >
        <div className='relative w-20 min-w-min h-16'>
            <div className='absolute inset-0 flex items-center justify-center font-bold text-3xl transition-colors duration-500 text-green-500 bg-green-200 animate-pulse'>
            {completedExercises}
            </div>
        </div>
        <h2 className='text-lg'>Completed Exercises</h2>
      </div>

      <div className="flex items-center w-full gap-2 my-1 bg-white rounded overflow-hidden cursor-pointer shadow hover:border-slate-300/50" >
        <div className='relative w-20 min-w-min h-16'>
            <div className='absolute inset-0 flex items-center justify-center font-bold text-3xl transition-colors duration-500 text-green-500 bg-green-200 animate-pulse'>
            {activeDays}
            </div>
        </div>
        <h2 className='text-lg'>Active Days</h2>
      </div>


      <div className="flex items-center w-full gap-2 my-1 bg-white rounded overflow-hidden cursor-pointer shadow hover:border-slate-300/50" >
        <div className='relative w-20 min-w-min h-16'>
            <div className='absolute inset-0 flex items-center justify-center font-bold text-3xl transition-colors duration-500 text-green-500 bg-green-200 animate-pulse'>
            {completedWorkouts}
            </div>
        </div>
        <h2 className='text-lg'>Completed Workouts</h2>
      </div>

</section>
  )
}

export default CompletedWorkoutCounter