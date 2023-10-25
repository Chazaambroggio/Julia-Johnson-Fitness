'use client'
import React, { useState } from 'react'
import { ExerciseInterface, UserProfile, WorkoutInterface } from '@/common.types';
import CardExercise from './CardExercise';

type Props = {
    exercises: ExerciseInterface[];
    users?: UserProfile[];
  };

const SearchExercise = ({ exercises, users} : Props) => {

    const [searchQuery, setSearchQuery] = useState('');

    // Filter and map the list
    const filteredList = exercises.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <section className='flex flex-col justify-center items-center w-full'>
            <input
                type="text"
                placeholder="Search exercises"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full my-3 p-3 rounded-lg border border-slate-200'
            />
                
            {filteredList.map((item) => (
            
                <CardExercise 
                    key={item._id}
                    exercise={item}
                />
                    
            ))}        
                  
        </section>
    )
}

export default SearchExercise