import React from 'react'
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import ExerciseForm from '@/components/ExerciseForm';
import { fetchExercise } from '@/lib/exercises/exerciseActions';



const page = async({params: { exerciseId  }} : {params: { exerciseId: string }}) => {
    const session = await getCurrentUser();
    if (!session?.user) redirect('/') 

    const exercise = await fetchExercise(exerciseId);

    const exercisePlainData = {
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
      };

  return (
    <section className='flex w-full justify-center px-8'>
        
        <ExerciseForm 
            type='edit' 
            session={session}
            exercise={exercisePlainData}
            />
    </section >
  )
}

export default page