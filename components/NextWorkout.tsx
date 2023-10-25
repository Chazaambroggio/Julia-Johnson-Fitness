import { UserInterface, WorkoutExerciseInterface } from '@/common.types';

import React from 'react';
import CardWorkout from './CardWorkout';
import { fetchUserWorkouts } from '@/lib/workouts/workoutActions';
import { fetchLatestUserWorkoutLog } from '@/lib/completionHistory/completionHistoryActions';


type Props = {
//    session: SessionInterface;
    user: UserInterface
  };

const NextWorkout = async({ user }: Props) => {

    const workoutList = await fetchUserWorkouts(user?._id);
    const workoutsPlainData = workoutList.map((workout) => ({
      _id: workout?._id.toString(),
      workout_name: workout?.workout_name,
      user: workout?.user.toString(),
      exercises: workout?.exercises.map((exercise : WorkoutExerciseInterface) => ({
        exerciseId: exercise.exerciseId.toString(),
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight
    })),
      createdBy: workout?.createdBy.toString(),
      isFree: workout?.isFree,
    }))

    const latestWorkout = await fetchLatestUserWorkoutLog(user?._id);

    let nextWorkoutIndex;

    function getNextWorkoutIndex (){
        if (!latestWorkout) {
           return 0;
       } else {
            // Check if the latest workout exists in the workoutList
            const index = workoutList.findIndex((workout) => workout._id.toString() === latestWorkout?.workout.toString());

            if (index !== -1) {
                if (workoutList.length === index + 1) {
                    return 0;
                } else {
                    return index + 1;
                }
           } else {
               return 0 // Latest workout not in list.
           }
        }
    }
    
    nextWorkoutIndex = await getNextWorkoutIndex();

  return (
    <section className='flex flex-col w-full p-2 bg-slate-100 rounded'>
        <h2 className='text-xl '>Next Workout</h2>

        {workoutList && (workoutList.length > 0) ? (
            <CardWorkout 
                workout={workoutsPlainData[nextWorkoutIndex]}
                user={user}
            />
        ) : (
            <div className="flex w-full gap-4 m-1 rounded overflow-hidden shadow p-4">
                <div className="animate-spin w-6 h-6 border-t-4 border-blue-500 mx-auto"></div>
            </div>
        )}

    </section>
  )
}

export default NextWorkout