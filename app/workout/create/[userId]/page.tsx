import React from 'react'
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import WorkoutForm from '@/components/WorkoutForm';
import { fetchAllExercises } from '@/lib/exercises/exerciseActions';
import { ExerciseInterface } from '@/common.types';
import { convertExerciseToPlainData } from '@/lib/exercises/exerciseHelpers';


const page = async ({params: { userId }}: {params: { userId: string }}) => {

    const session = await getCurrentUser();
    if (session?.user?.role !== 'trainer') redirect('/') 

    const exerciseList = await fetchAllExercises(session?.user?.id);

    const exerciseListPlainData = await Promise.all(exerciseList.map(async (exercise : ExerciseInterface) => {
        const exercisePlainData = await convertExerciseToPlainData(exercise)
        return exercisePlainData;
    }));

  return (
    <section className='flex w-full justify-center self-center max-w-[1024px]'>
        <WorkoutForm 
            type='create' 
            userId={userId}
            session={session}
            exercises={exerciseListPlainData}
            />
    </section >
  )
}

export default page