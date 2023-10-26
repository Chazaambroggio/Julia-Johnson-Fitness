'use client';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Switch } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ExerciseInterface, SessionInterface, WorkoutInterface } from '@/common.types'
import FormField from './FormField';
import ExerciseSearch from './ExerciseSearch';
import Button from './Button';
import CardExercise from './CardExercise';

type Props = {
    type: 'create' | 'edit',
    userId: string,
    session: SessionInterface,
    workout?: WorkoutInterface,
    exercises: ExerciseInterface[],
}

type ExerciseWithSets = {
    data: {
        _id: string;
        title: string;
        instructions: string;
        coverImage: {
            public_id: string;
            link: string;
        }
        video: {
            public_id: string;
            link: string;
        }
        createdBy: string;
    }
    sets: number;
    reps: number | string;
    weight: number;
} | null

const WorkoutForm = ({ type, userId, session, workout, exercises} : Props) => {

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState<ExerciseWithSets[]>([]);
    const [isFree, setIsFree] = useState<boolean>(true)

    const [form, setForm] = useState({
        _id: workout?._id || '',
        workout_name: workout?.workout_name || '',
        user: workout?.user || userId,
        exercises: workout?.exercises || [],
        createdBy: workout?.createdBy || session?.user?.id, 
        isFree: workout?.isFree || true,       
    }); 

    useEffect(() => {
        if (workout) {
            const existingExercises = workout.exercises.map((workoutExercise) => {
                const matchingExercise = exercises.filter((exercise) => exercise._id === workoutExercise.exerciseId);

                if (matchingExercise) {
                    return {
                        data: matchingExercise[0],
                        sets: workoutExercise.sets,
                        reps: workoutExercise.reps,
                        weight: workoutExercise.weight,
                    };
                }
                return null; // Handle the case where the exercise is not found
            }).filter(Boolean); // Filter out any null values (exercises not found)
            if (existingExercises) {
                setSelectedExercises(existingExercises);
            }
        }
    }, [workout]);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (type === 'create') {

                // Make a POST request to the API endpoint on the server-side
                const response = await axios.post('/api/workout/create', {
                    form: form,
                    session: session,
                });

                console.log('Workout created successfully:', response.data);
                router.push(`/user/${userId}`);               
            } 

            if (type === 'edit') {
                // Make a PUT request to the API endpoint on the server-side
                const response = await axios.put('/api/workout/edit', {
                    form: form,
                    session: session,
                });
                console.log('Workout successfully edited:', response.data);
                router.push(`/user/${userId}`);  
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStateChange = (
        fieldName: keyof WorkoutInterface, 
        value: string | boolean,
        index?: number,
        subFieldName?: 'sets' | 'reps' | 'weight'
        ) => {
            if ( fieldName == 'exercises' && subFieldName) {
                setForm((prevForm) => ({ 
                    ...prevForm, 
                    exercises : prevForm.exercises.map((exercise, i) => {
                        if (i === index && subFieldName) {
                        return {
                            ...exercise,
                            [subFieldName]: value,
                        };
                        }
                        return exercise;
                    }),
                }));
            
            } else {
                setForm((prevForm) => ({ 
                    ...prevForm, 
                    [fieldName]: value 
                }));
            }
    };

    const addExercise = (exercise : ExerciseInterface) => {
        
        const newSelectedExercise = {
            data: exercise,
            sets: 0,
            reps: '0',
            weight: 0,
        } as ExerciseWithSets;

        // Logic to add exercise to the selectedExercises state
        setSelectedExercises((prevSelectedExercises) => [...prevSelectedExercises, newSelectedExercise]);

        const newWorkoutExercise = {
            exerciseId: exercise._id,
            sets: 0,
            reps: '0',
            weight: 0,
        }
        // Update form.exercises by adding the new exercise
        setForm((prevForm) => ({
            ...prevForm,
            exercises: [...prevForm.exercises, newWorkoutExercise],
        }));
    };

    const handleRemove = (toDeleteItem: ExerciseWithSets) => { 

        setSelectedExercises((prevSelectedExercises) =>
          prevSelectedExercises.filter((item) => item !== toDeleteItem)
        );
        
        // Update form.exercises by filtering out the removed exercise
        setForm((prevForm) => ({
            ...prevForm,
            exercises: prevForm.exercises.filter((item) => item.exerciseId !==  toDeleteItem?.data._id),
          }));

      };

      useEffect(() => {
        handleStateChange('isFree', isFree)
      }, [isFree])
      
  return (
    <section className='flex flex-col justify-start items-center w-full max-w-screen-md'>
        <h3 className='text-xl font-semibold'>{ type =='create' ? 'Create a workout' : `Edit ${form.workout_name}`}</h3>

        <form
            onSubmit={handleFormSubmit}
            className='flex flex-col items-center justify-start w-full lg:pt-24 pt-10 gap-8 text-lg mx-auto'
        >
            <div className='flex flex-col w-full gap-2'>

            {session?.user?.id === userId && (
                <div className='flex w-full justify-end items-center gap-2'>
                    <span className='text-slate-400'>Free workout</span>

                    <Switch
                        checked={isFree}
                        onChange={setIsFree}
                        className={`${
                            isFree ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                        <span className="sr-only">Enable notifications</span>
                        <span
                            className={`${
                                isFree ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                </div>
            )}

                <FormField 
                    state={form.workout_name}
                    placeholder="Workout Name"
                    isRequired={true}
                    setState={(value) => handleStateChange('workout_name', value)}
                /> 

                <ExerciseSearch 
                    exercisesList={exercises}
                    handleClick={addExercise}
                />
            </div>
            
            <div className='flex flex-col w-full gap-2'>
                {selectedExercises.map((item, index) => (
                    <>
                        { item && (
                            <div 
                                key={item.data._id} 
                                className='flex flex-col w-full justify-center items-center border p-2 gap-2 rounded  bg-white'
                            >
                            
                            <CardExercise 
                                key={item.data._id}
                                exercise={item.data}
                            />
                            
                            {/* <div className='flex w-full gap-2'> */}
                                <FormField 
                                    title='Sets'
                                    state={form.exercises[index].sets.toString()}
                                    placeholder="Sets"
                                    isRequired={true}
                                    setState={(value) => handleStateChange('exercises', value, index, 'sets')}
                                /> 
                                <FormField 
                                    title='Reps/Time'
                                    state={form.exercises[index].reps.toString()}
                                    placeholder="Reps"
                                    isRequired={true}
                                    setState={(value) => handleStateChange('exercises', value, index, 'reps')}
                                /> 

                                <FormField 
                                    title='Weight'
                                    state={ form.exercises[index].weight.toString()}
                                    placeholder="Weight"
                                    isRequired={true}
                                    setState={(value) => handleStateChange('exercises', value, index, 'weight')}
                                /> 
                            {/* </div> */}
    
                            <button 
                                className='w-full hover:bg-red-50 rounded'
                                onClick={() => handleRemove(item)}
                                >
                                <FontAwesomeIcon  
                                    icon={faTrash}
                                    className='text-red-500'
                                    />
                            </button>
                        </div>
                        )}
                    </>
                ))}
            </div>

         
            <Button
                title={isSubmitting 
                    ? `${type === 'create' ? 'Creating' : 'Editing'}`
                    : `${type === 'create' ? 'Create' : 'Edit'}`
                    }
                type='submit'
                isSubmitting={isSubmitting}
            />

        </form>
    </section>
  )
}

export default WorkoutForm