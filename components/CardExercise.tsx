'use client';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { CompletionHistoryInterface, ExerciseInterface, SessionInterface, WorkoutInterface } from '@/common.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';


type Props = {
    exercise: ExerciseInterface;
    session?: SessionInterface;
    workout?: WorkoutInterface;
    workoutLog?: CompletionHistoryInterface;
  };

const CardExercise = ({ exercise, session, workout, workoutLog}: Props) => {


    const router = useRouter();
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sets, setSets] = useState<number | null>(null);
    const [reps, setReps] = useState<number | string | null>(null);
    const [weigth, setWeigth] = useState<number | null>(null);


    const modifiedCoverImage =`${exercise?.coverImage?.link.replace(
        '/upload/',
        `/upload/w_500,h_500,c_fill/`
        )}`   

    // Check for when exercise was complete.
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];

        if (workoutLog?.date.toISOString().split('T')[0] === today) {
            const isExerciseIdPresent = workoutLog?.exercises?.some(
                (log) => log?.exerciseId.toString() === exercise._id
            );
            setIsCompleted(isExerciseIdPresent);
        } else {
            setIsCompleted(false);
        }
    }, [workoutLog, exercise]);    

    useEffect(() => {
        if (workout && workout.exercises) {
            const matchingExercise = workout.exercises.find((workoutExercise) => workoutExercise.exerciseId === exercise._id);
            // If a matching exercise is found, return its sets and reps
            if (matchingExercise) {
                setSets(matchingExercise.sets)
                setReps(matchingExercise.reps)
                setWeigth(matchingExercise.weight)
            }
        }
    }, [])

    const handleIconClick = async () => {
        setIsSubmitting(prev => !prev);
        try {
            const currentTime = new Date();
            const currentDate = currentTime.toISOString().split('T')[0];

            if (!isCompleted) {
                const response = await axios.put(`/api/exercise/markCompleted`, {
                    exerciseId: exercise?._id,
                    workout: workout,
                    session: session,
                    completedAt: currentDate,
                });
            } else {
                const response = await axios.put(`/api/exercise/markIncompleted`, {
                    exerciseId: exercise?._id,
                    workout: workout,
                    session: session,
                    completedAt: currentDate,
                }); 
            }
                
          } catch (error) {
            console.log(error);
          } finally {
              setIsSubmitting(prev => !prev);
              setIsCompleted(!isCompleted);
          }
      };

    function handleClick() {
        router.push(`/exercise/${exercise?._id}`)
    }


  return (
        <div className='flex w-full gap-4 m-1 rounded bg-white overflow-hidden shadow hover:border-slate-300/50'>
            <div 
                onClick={handleClick}
                className='flex w-full gap-2 cursor-pointer'
            >
                {modifiedCoverImage && (
                    <Image
                        src={modifiedCoverImage}
                        width={75}
                        height={75}
                        alt={`${exercise?.title}cover image`}
                    />
                )}
                <div className='flex flex-col justify-center'>
                    <p className='text-lg font-semibold'>{exercise?.title}</p>
                    { sets && reps &&  (
                        <p className=' font-light text-gray-400'> <span> {sets} x {reps} | {weigth} </span></p>
                    )}
                </div>
            </div>
            
            {session?.user?.role == 'client' && (
                <div className='flex justify-center items-center px-2'>
                    {isSubmitting ? (
                        // Render a loading icon or spinner while submitting
                        <div className='animate-spin w-6 h-6 border-t-4 border-blue-500' />
                        ) : (
                    <FontAwesomeIcon  
                        icon={faCheckCircle}
                        className={`flex text-3xl ${isCompleted ? 'text-green-600/75' : 'text-gray-400/30'} rounded-full cursor-pointer`}
                        onClick={handleIconClick}
                    />
                    )}
                </div>
            )}
    </div>

  )
}

export default CardExercise