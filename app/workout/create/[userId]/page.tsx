import React from 'react'
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import WorkoutForm from '@/components/WorkoutForm';
import { fetchAllExercises } from '@/lib/exercises/exerciseActions';


const page = async ({params: { userId }}: {params: { userId: string }}) => {

    const session = await getCurrentUser();
    if (session?.user?.role !== 'trainer') redirect('/') 

    const exerciseList = await fetchAllExercises(session?.user?.id);

    const exerciseListPlainData = exerciseList.map((exercise) => ({
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