'use client';
import { ExerciseInterface } from '@/common.types';
import { MouseEventHandler, useEffect, useState } from 'react';
import FormField from './FormField';

type Props = {
    exercisesList:ExerciseInterface[];
    handleClick: (exercise: ExerciseInterface) => void;
}
const ExerciseSearch = ({ exercisesList, handleClick } : Props) => {

    const [ query, setQuery ] = useState('');

    const filteredExercise = query === "" 
        ? exercisesList
        : exercisesList.filter((exercise) => (
            exercise.title.toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        ))

    const handleAddClick = (exercise : ExerciseInterface) => {
        handleClick(exercise);
        setQuery('');
        };


  return (
    <div className='flex flex-col w-full h-full gap-1'>
     
        <FormField 
            state={query}
            placeholder='Search for an exercise'
            setState={setQuery}
        />

        {query && (
            <div className='flex flex-col w-full rounded-lg shadow'>
                {filteredExercise.map((exercise) => (
                    <button 
                        key={exercise?._id}
                        type='button'
                        className='flex justify-start p-2 hover:bg-blue-50 hover:text-blue-600'
                        onClick={() => handleAddClick(exercise)}
                        >
                        <span className='ml-2'>
                            { exercise.title }
                        </span>
                    </button>
                ))}
            </div>
        )}
    </div>
  )
}

export default ExerciseSearch