'use client';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { UserProfile } from '@/common.types';

type Props = {
    user: UserProfile;
  };

const CardUser = ({ user}: Props) => {

    const modifiedCoverImage =`${user?.avatarUrl.replace(
        '/upload/',
        `/upload/w_500,h_500,c_fill/`
        )}`   

    function capitalizeFirstLetters(username : string) {
        return username
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
    
    const capitalizedUsername = capitalizeFirstLetters(user?.username);

    function calculateDaysDifference(lastActiveDate: Date) {
        const lastActive : Date = new Date(lastActiveDate);
        const today : Date = new Date();
    
        const timeDifference = today.getTime() - lastActive.getTime();
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        return daysDifference;
    }
    
    const [dateColorClass, setDateColorClass] = useState<string>('');
  
    useEffect(() => {
      if (user?.lastActiveDate) {
        const calculatedDaysDifference = calculateDaysDifference(user?.lastActiveDate);
  
        let colorClass = '';
        if (calculatedDaysDifference !== null) {
          if (calculatedDaysDifference < 3) {
            colorClass = 'bg-green-600/75';
          } else if (calculatedDaysDifference >= 3 && calculatedDaysDifference <= 7) {
            colorClass = 'bg-yellow-600/75';
          } else {
            colorClass = 'bg-red-600/75';
          }
        }
        setDateColorClass(colorClass);
      }
    }, [user?.lastActiveDate]);

    
  return (
    <div className={`flex w-full ${user.pendingRequest ? 'animate-pulse' : ''}`}>
      
      <Link 
        href={`/user/${user?._id}`}
        className='flex w-full'
      >
        <div className='flex w-full max-h-fit gap-2 m-1 rounded overflow-hidden cursor-pointer shadow hover:border-slate-300/50' 
        >
          <Image
            src={modifiedCoverImage}
            width={75}
            height={75}
            alt={`${user?.username} profile image`}
            />
          <div className='flex flex-col w-full justify-center text-lg font-semibold overflow-hidden'>
            <p className='text-sm font-semibold'>{capitalizedUsername}</p>
            <p className='text-xs font-light text-slate-400'>{user?.email}</p>
          </div>

          {user?.lastActiveDate && (
            <div className={`flex min-w-fit justify-center items-center p-2 ${dateColorClass}`}>
                <p className='text-slate-50 text-xs'> {user?.lastActiveDate.toISOString().split('T')[0]} </p>
            </div>
          )}
        </div>
      </Link>
      
    </div>
  )
}

export default CardUser