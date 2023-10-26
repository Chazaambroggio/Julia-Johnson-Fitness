import React from 'react'
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { fetchUser } from '@/lib/users/userActions';
import { convertUserToPlainData } from '@/lib/users/userHelpers';
import { fetchFreeWorkouts } from '@/lib/workouts/workoutActions';
import { WorkoutInterface } from '@/common.types';
import { convertWorkoutToPlainData } from '@/lib/workouts/workoutHelpers';
import { fetchLatestWorkoutLog } from '@/lib/completionHistory/completionHistoryActions';
import { convertWorkoutCompletionHistoryToPlainData } from '@/lib/completionHistory/completionHistoryHelpers';
import ListWorkout from '@/components/ListWorkout';

const page = async () => {

    // Edit or make a button that transition to the next page
    // Add isSubmitting so the button disappears or becomes desable 

    const session = await  getCurrentUser();
    if (session?.user?.role !== 'trainer') redirect('/') 

    const user = await fetchUser(session?.user?.id);
    const userPlainData = await convertUserToPlainData(user)

    const workoutList = await fetchFreeWorkouts(user?._id);
    const workoutsData = await Promise.all(workoutList.map(async (workout : WorkoutInterface) => {
        const workoutPlainData = await convertWorkoutToPlainData(workout)
      
        const latestWorkoutLog = await fetchLatestWorkoutLog(user?._id, workout?._id);
        let logPlainData;
        if (latestWorkoutLog) {
          logPlainData = await convertWorkoutCompletionHistoryToPlainData(latestWorkoutLog)
        }
  
        return {workoutPlainData, logPlainData}
      }));

  return (
    <section className='flex flex-col justify-center items-center self-center max-w-[1024px] w-full gap-8'>
        <div className='flex flex-col justify-center items-center gap-4'>
            <h2 className='font-semibold text-xl'>Free workouts</h2>
        </div>

        <ListWorkout
            type='free'
            user={userPlainData}
            workouts={workoutsData}
            session={session}
            displayButton={true}
        />

    </section>
  )
}

export default page