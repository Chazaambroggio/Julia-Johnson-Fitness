import React from 'react'
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import WorkoutForm from '@/components/WorkoutForm';
import { WorkoutExerciseInterface } from '@/common.types';
import { fetchWorkout } from '@/lib/workouts/workoutActions';
import { fetchAllExercises } from '@/lib/exercises/exerciseActions';

  
const page = async ({params: { workoutId  }} : {params: { workoutId: string }}) => {

    const session = await getCurrentUser();
    if (!session?.user) redirect('/') 

    let workout;
    let workoutPlainData;

    let exercises = []
    let exercisesPlainData;
    try {

        workout = await fetchWorkout(workoutId);
        workoutPlainData = {
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
        }

        exercises = await fetchAllExercises(workout?.createdBy.toString());
        exercisesPlainData = exercises.map((exercise) => ({
            _id: exercise?._id.toString(),
            title: exercise?.title,
            coverImage: {
                public_id: exercise?.coverImage?.public_id,
                link: exercise?.coverImage?.link,
            }, 
            video: {
                public_id: exercise?.video?.public_id,
                link: exercise?.video?.link,
            },
            instructions: exercise?.instructions,
            createdBy: exercise?.createdBy.toString(),
            }));

    } catch (error) {
        
    }

  return (
    <section className='flex w-full justify-center'>
        {workoutPlainData && exercisesPlainData && (
            <WorkoutForm 
                type='edit' 
                userId={workoutPlainData?.user}
                session={session}
                exercises={exercisesPlainData}
                workout={workoutPlainData}
                />
        ) }

    </section >
  )
}

export default page