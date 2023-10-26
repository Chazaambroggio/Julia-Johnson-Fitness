import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import ListExercise from '@/components/ListExercise';
import CRUDButton from '@/components/ButtonCRUD';
import { ExerciseInterface } from '@/common.types';
import { fetchWorkout, fetchWorkoutExercises } from '@/lib/workouts/workoutActions';
import { fetchLatestWorkoutLog } from '@/lib/completionHistory/completionHistoryActions';
import { convertWorkoutToPlainData } from '@/lib/workouts/workoutHelpers';
import { convertExerciseToPlainData } from '@/lib/exercises/exerciseHelpers';
import { convertWorkoutCompletionHistoryToPlainData } from '@/lib/completionHistory/completionHistoryHelpers';


const page = async ({params: { workoutId  }} : {params: { workoutId: string }}) => {

    const session = await  getCurrentUser();
    if (!session?.user) redirect('/') 

    const workout = await fetchWorkout(workoutId);
    const workoutPlainData = await convertWorkoutToPlainData(workout)

    const exercises = await fetchWorkoutExercises(workoutId);
    const exercisesData = await Promise.all(exercises.map(async (exercise : ExerciseInterface) => {
      const exercisePlainData = await convertExerciseToPlainData(exercise)
      return exercisePlainData;
    }));
    
    const workoutLog = await fetchLatestWorkoutLog(session?.user?.id, workoutId); 
    let workoutLogPlainData;
    if (workoutLog) {
      workoutLogPlainData = await convertWorkoutCompletionHistoryToPlainData(workoutLog)
    }

  return (
    <div className='flex flex-col justify-start items-center self-center w-full max-w-[1024px]'>
        
      <h1 className='text-3xl'>{workout?.workout_name}</h1>
      
      {session?.user?.id && workoutPlainData && (
        <ListExercise
          session={session}
          workout = {workoutPlainData}
          exercises = {exercisesData}
          workoutLog = {workoutLogPlainData}
        />
      )}

      <div className='flex w-full justify-center items-center mt-2 py-6 px-4 gap-6'>
        {workoutPlainData && session?.user?.role == 'trainer' && (
          <>
            <CRUDButton 
                title='Delete'
                bgColor='bg-red-600'
                functionality='delete'
                element={workoutPlainData}
                elementType='workout'
                session={session}
                /> 
    
            <CRUDButton 
                title='Edit'
                bgColor='bg-blue-600'
                functionality='edit'
                element={workoutPlainData}
                elementType='workout'
                session={session}
                /> 
          </>
        )}
      </div>

    </div>
  )
}

export default page