import React from 'react'
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import WorkoutForm from '@/components/WorkoutForm';
import { ExerciseInterface } from '@/common.types';
import { fetchWorkout } from '@/lib/workouts/workoutActions';
import { fetchAllExercises } from '@/lib/exercises/exerciseActions';
import { convertWorkoutToPlainData } from '@/lib/workouts/workoutHelpers';
import { convertExerciseToPlainData } from '@/lib/exercises/exerciseHelpers';

  
const page = async ({params: { workoutId  }} : {params: { workoutId: string }}) => {

    const session = await getCurrentUser();
    if (!session?.user) redirect('/') 

    // Workout
    const workout = await fetchWorkout(workoutId);
    const workoutPlainData = await convertWorkoutToPlainData(workout);

    // Exercises
    const exercises = await fetchAllExercises(workout?.createdBy.toString());
    const exercisesPlainData = await Promise.all(exercises.map(async (exercise : ExerciseInterface) => {
        const exercisePlainData = await convertExerciseToPlainData(exercise)
        return exercisePlainData;
    }));


  return (
    <section className='flex w-full justify-center'>
        {workoutPlainData && exercisesPlainData && (
            <WorkoutForm 
                type='edit' 
                userId={workoutPlainData?.user }
                session={session}
                exercises={exercisesPlainData}
                workout={workoutPlainData}
                />
        )}
    </section >
  )
}

export default page