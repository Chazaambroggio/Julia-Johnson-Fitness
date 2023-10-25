'use client'
import React from 'react'
import { CompletionHistoryInterface, ExerciseInterface, SessionInterface, WorkoutInterface } from '@/common.types';
import SearchExercise from './SearchExercise';
import CardExercise from './CardExercise';
import ButtonFloatingIcon from './ButtonFloatingIcon';
import { useRouter } from 'next/navigation';

type Props = {
    session: SessionInterface;
    exercises: ExerciseInterface[]; 
    workout?: WorkoutInterface;
    workoutLog?: CompletionHistoryInterface;
  };

const ListExercise = ({ session, workout, exercises, workoutLog }: Props) => {
    
    const router  = useRouter()

    function handleClick() {
        router.push(`/exercises/create`)
        }

  return (
    <section className='flex flex-col justify-center items-center w-full my-4 px-2'>
        { workout 
            ? (
                <>
                    {exercises.map((item) => (
                        <CardExercise 
                            key={item._id}
                            exercise={item}
                            session={session}
                            workout={workout}
                            workoutLog={workoutLog}
                        />    
                    ))}  
                </>
            ) : (
                <>
                    < SearchExercise 
                        exercises={exercises}
                        />
                    {session?.user?.role == 'trainer' && (
                        <ButtonFloatingIcon
                            iconName='faPlusCircle'
                            handleClick={handleClick}
                        />
                    )}
                </>
                )
        }


    </section> 
  )
}

export default ListExercise