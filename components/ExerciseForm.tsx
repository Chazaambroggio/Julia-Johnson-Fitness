'use client';
import React, { ChangeEvent, MouseEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from './Button';
import FormField from './FormField';
import { ExerciseInterface, SessionInterface } from '@/common.types';
import axios from 'axios';

type Props = {
    type: string,
    session: SessionInterface,
    exercise?: ExerciseInterface,
}

const ExerciseForm = ({ type, session, exercise} : Props) => {
    
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        _id: exercise?._id || '',
        title: exercise?.title || '',
        instructions: exercise?.instructions || '',
        coverImage: { 
            public_id: exercise?.coverImage?.public_id || '', 
            link: exercise?.coverImage?.link || '',
        },
        video: { 
            public_id: exercise?.video?.public_id || '',
            link: exercise?.video?.link || ''
        }
    }); 

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (type === 'create') {
                
                // Make a POST request to the API endpoint on the server-side
                const response = await axios.post('/api/exercise/create', {
                    form: form,
                    session: session,
                });

                console.log('Exercise created successfully:', response.data);
                router.push('/exercises');               
            } 

            if (type === 'edit') {
                // Make a PUT request to the API endpoint on the server-side
                const response = await axios.put('/api/exercise/edit', {
                    form: form,
                    session: session,
                });
                console.log('Exercise successfully edited:', response.data);
                router.push('/exercises');   
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleImageChange = (e: ChangeEvent<HTMLInputElement> ) => {
        e.preventDefault();

        const file = e.target.files?.[0];

        if(!file) return;

        if (!file.type.includes('image')) {
            return alert('Please upload an image file');
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const result = reader.result as string;
            handleStateChange('coverImage', result);
        }
    };

    const handleVideoChange = (e: ChangeEvent<HTMLInputElement> ) => {
        e.preventDefault();

        const file = e.target.files?.[0];
        if(!file) return;

        if (!file.type.includes('video/mp4')) {
            return alert('Please upload a video file');
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            const result = reader.result as string;
            handleStateChange('video', result);
        }
    };

    const handleStateChange = (fieldName: keyof ExerciseInterface, value: string) => {

        if ( fieldName =='coverImage' || fieldName == 'video') {
    
            setForm((prevForm) => ({
                ... prevForm, 
                [fieldName] : {
                    ...prevForm[fieldName],
                    link: value,
                }
             }))
        } else {
            setForm((prevForm) => ({ ...prevForm, [fieldName]: value }));
        }
    };


  return (
    <section className='flex flex-col justify-start items-center'>

        <h3 className='text-xl font-semibold'>{ type =='create' ? 'Create a new exercise' : `Edit ${form.title}`}</h3>
        
        <form
            onSubmit={handleFormSubmit}
            className='flex flex-col items-center justify-start w-full lg:pt-24 pt-10 gap-4 text-lg max-w-5xl mx-auto'
        >
            <FormField 
                state={form.title}
                placeholder="Exercise Title"
                isRequired={true}
                setState={(value) => handleStateChange('title', value)}
            />
            
            <FormField 
                state={form.instructions}
                placeholder="Instructions..."
                isTextArea={true}
                setState={(value) => handleStateChange('instructions', value)}
            />
            
            <div className='flex items-center justify-start w-full lg:min-h-[400px] min-h-[250px] relative'>
                <input 
                    id="image"
                    type="file" 
                    accept='image/*'
                    required={type === 'create'}
                    className='absolute z-30 w-full opacity-0 h-full cursor-pointer'
                    onChange={handleImageChange}
                    />

                {! form.coverImage.link 
                    ? (
                        <label 
                            htmlFor="poster"
                            className='flex justify-center items-center z-10 text-center w-full h-full p-20 text-gray-400 border-2 border-gray-300 border-dashed'
                        >
                            Choose a cover image for your exercise.
                        </label>
                    ) : (
                            <Image
                                key={form.coverImage.link}
                                src={form.coverImage.link}
                                fill
                                alt='Exercise image'
                                className='object-contain z-20 w-full h-full object-cover rounded-md '
                            />
                        )
                    }
            </div>

             <div className='flex items-center justify-start w-full lg:min-h-[400px] min-h-[250px] relative'> 
                <input 
                    id="video"
                    type="file" 
                    accept='video/*'
                    required={type === 'create'}
                    className='absolute z-30 w-full opacity-0 h-full cursor-pointer'
                    onChange={handleVideoChange}
                    />

                {! form.video.link
                    ? (
                        <label 
                        htmlFor="poster"
                        className='flex justify-center items-center z-10 text-center w-full h-full p-20 text-gray-400 border-2 border-gray-300 border-dashed'
                        >
                                Choose a video for your exercise.
                        </label> 
                    ) : (
                        <video 
                            key={form.video.link} 
                            controls 
                            width="640" 
                            height="360" 
                            className='object-cover z-20 w-full h-full object-cover rounded-md'
                            >
                            <source 
                                src={form.video.link} 
                                type="video/mp4" 
                                />
                                Your browser does not support the video tag. {form.video.link}
                        </video>
                        )
                    }
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


export default ExerciseForm