'use client';
import React, { useEffect, useState } from 'react'
import { CompletionHistoryInterface, UserInterface, WorkoutInterface } from '@/common.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

type Props = {
    user: UserInterface;
    workout: WorkoutInterface;
    log?: CompletionHistoryInterface
  };


const CardWorkout = ({ user, workout, log }: Props) => {

  const router = useRouter();
  const [ dateColorClass, setDateColorClass ] = useState<string>('');
  const [ isCompleted, setIsCompleted ] = useState(false);

  function checkExerciseComplete(lastActiveDate: Date) {
    const today = new Date().toISOString().split('T')[0]
    if (lastActiveDate.toISOString().split('T')[0] == today && log?.isComplete) {
      setIsCompleted(prev => !prev)
    }
  }

  function calculateDaysDifference(lastActiveDate: Date) {
    const lastActive : Date = new Date(lastActiveDate);
    const today : Date = new Date();

    const timeDifference = today.getTime() - lastActive.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
    return daysDifference;
  }

  useEffect(() => {
    if (log?.date) {
      checkExerciseComplete(log?.date);
      const calculatedDaysDifference = calculateDaysDifference(log?.date);
      let colorClass = '';
      if (calculatedDaysDifference !== null) {
        if (calculatedDaysDifference < 7) {
          colorClass = 'bg-green-600/75';
        } else if (calculatedDaysDifference >= 7 && calculatedDaysDifference <= 14) {
          colorClass = 'bg-yellow-600/75';
        } else {
          colorClass = 'bg-red-600/75';
        }
      }
      setDateColorClass(colorClass);
    }
  }, [log?.date]);

  function handleClick() {
    router.push(`/workout/${workout?._id}`)
    }

  return ( 
    <div 
      onClick={handleClick}
      className="flex w-full gap-2 my-1 rounded bg-white overflow-hidden cursor-pointer shadow hover:border-slate-300/50" 
      >
      <div className='flex flex-col w-full justify-center text-lg font-semibold p-2'>
        <h3 className="font-semibold">
            {workout.workout_name}
        </h3>
        <span className="text-slate-600 font-light text-sm">
            {`${workout.exercises.length} Exercises`}
        </span>
      </div>
        {user?.role == 'client' && isCompleted && (
          <div className='flex justify-center items-center px-2'>
            <FontAwesomeIcon  
              icon={faCheckCircle}
              className={`flex text-3xl ${isCompleted ? 'text-green-600/75' : 'text-gray-400/30'} rounded-full`}
            />
          </div>
        )}

        {workout?.lastActiveDate && user?.role == 'trainer' && (
          <div className={`flex min-w-fit justify-center items-center p-2 ${dateColorClass}`}>
              <p className='text-slate-50 text-xs'> {workout?.lastActiveDate.toISOString().split('T')[0]} </p>
          </div>
        )}
    </div>
  )
}

export default CardWorkout