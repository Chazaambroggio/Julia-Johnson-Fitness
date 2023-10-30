import React from 'react'
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import CRUDButton from '@/components/ButtonCRUD';
import { fetchExercise } from '@/lib/exercises/exerciseActions';
import { convertExerciseToPlainData } from '@/lib/exercises/exerciseHelpers';


const page = async ({params: { exerciseId  }} : {params: { exerciseId: string }}) => {

    const session = await  getCurrentUser();
    if (!session?.user) redirect('/') 

    let exercise;
    let exercisePlainData;
    try {
        exercise = await fetchExercise(exerciseId);
        exercisePlainData = await convertExerciseToPlainData(exercise);

    } catch (error) {
        
    }

  return (
    <section className='flex flex-col w-full'>
        <div className='flex flex-col w-full justify-center items-center'>
            <h3 className='text-xl font-semibold mb-2 text-gray-900'>{exercise?.title}</h3>
            <video controls width="640" height="360" loop className='m-2 rounded-lg'>
              <source 
                  src={exercise?.video?.link} 
                  type="video/mp4" 
                  className='sm:p-10 object-contain z-20 w-full object-cover rounded-md'
                  />
                  Your browser does not support the video tag.
            </video>

            <p className='mx-2 my-4 text-gray-600'>{exercise?.instructions}</p>
        </div>

        <div className='flex w-full justify-center items-center mt-2 py-6 px-4 gap-6'>
            {exercisePlainData && session?.user?.role == 'trainer' && (
                <>
                    <CRUDButton 
                        title='Delete'
                        bgColor='border-2 border-red-600'
                        textColor='text-red-600'
                        functionality='delete'
                        element={exercisePlainData}
                        elementType='exercise'
                        session={session}
                        /> 
        
                    <CRUDButton 
                        title='Edit'
                        bgColor='bg-blue-600'
                        functionality='edit'
                        element={exercisePlainData}
                        elementType='exercise'
                        session={session}
                        /> 
                </>

            )}

        </div>

   
    </section>
  )
}

export default page