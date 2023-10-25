import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ListExercise from '@/components/ListExercise';
import { fetchAllExercises } from '@/lib/exercises/exerciseActions';
import { convertExerciseToPlainData } from '@/lib/exercises/exerciseHelpers';
import { ExerciseInterface } from '@/common.types';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const Exercises = async () => {

  const session = await  getCurrentUser();
  if (!session?.user) redirect('/') 

  const exercises = await fetchAllExercises(session?.user?.id);
  const exercisesData = await Promise.all(exercises.map(async (exercise : ExerciseInterface) => {
    const exercisePlainData = await convertExerciseToPlainData(exercise)
    return exercisePlainData;
  }));

  return (
    <div className='flex flex-col self-center justify-start items-center h-full w-full max-w-[1024px] gap-8'>   
      <h1 className='text-3xl'>Exercises</h1>
     
      {session?.user?.id && (
        <ListExercise
          session={session}
          exercises={exercisesData}
        />
      )}

    </div>
  )
}

export default Exercises