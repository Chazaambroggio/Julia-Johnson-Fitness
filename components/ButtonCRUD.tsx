'use client'
import { ExerciseInterface, SessionInterface, SubscriptionInterface, UserProfile, WorkoutInterface } from '@/common.types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

type Props = {
    title: string;
    bgColor?: string;
    textColor?: string;
    functionality : 'edit' | 'delete';
    element: ExerciseInterface | WorkoutInterface | UserProfile | SubscriptionInterface;
    elementType: 'exercise' | 'workout' | 'user' | 'subscription';  
    session: SessionInterface;
}

const CRUDButton = ({ title, bgColor, textColor, functionality, element, elementType, session }: Props) => {

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // e : React.FormEvent
      const handleDelete = async () => {
        setIsSubmitting(prev => !prev);
        try {
          // Make a DELETE request to the API endpoint on the server-side
          const response = await axios.delete(`/api/${elementType}/delete`, {
            data: {
              id: element?._id,
              session: session
            },
          });
  
        } catch (error) {
          console.log(error);
        } finally {
            setIsSubmitting(prev => !prev);

            if (elementType == 'workout') {
              router.push(`/user/${session.user.id}`);
              
             // Needs to return to /user/id
            } else if (elementType == 'subscription') {
              router.push(`/subscription/plans`);
              
            } else if (elementType == 'exercise') {
              router.push(`/exercises`);

            }
        }
      }


      const handleEdit = async () => {
        setIsSubmitting(prev => !prev);
        try {
            router.push(`/${elementType}/${element?._id}/edit`); 
  
        } catch (error) {
          console.log(error);
        } finally {
            setIsSubmitting(prev => !prev);
        }
      }

      function handleClick() {
        if (functionality == 'edit') {
            handleEdit();
        } else if (functionality == 'delete') {
            handleDelete()
        }
      }

      return (
        <button
            type = 'button'
            disabled={isSubmitting}
            className={`flex justify-center items-center gap-3 px-4 py-3
                ${textColor || 'text-white'}
                ${isSubmitting ? 'bg-black-50' : bgColor ? bgColor : 'bg-blue-600'} 
                rounded-xl text-sm font-medium max-md:w-full
            `}
            onClick={handleClick}
        >
            {title}
        </button>
      )  
  }


export default CRUDButton