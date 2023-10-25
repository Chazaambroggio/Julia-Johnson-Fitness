import React from 'react'

import SearchUser from './SearchUser';
import { SubscriptionRequestInterface, UserInterface } from '@/common.types';
import { converUserWorkoutLogToPlainData } from '@/lib/plainData/plainDataActions';
import { fetchLatestUserWorkoutLog } from '@/lib/completionHistory/completionHistoryActions';

type Props = {
    trainerId: string; // For Users page
    userList: UserInterface[];
    type: 'free' | 'paid' | 'all'
    pendingRequestList?: SubscriptionRequestInterface[];

  };


const ListUser = async({ trainerId, userList, type, pendingRequestList}: Props) => {

    // const itemList = await fetchAllUsers(trainerId);
  
    const itemListPlainData = await Promise.all(userList.map(async (user) => {
      // Fetch the latest workout log for each user
      const latestWorkoutLog = await fetchLatestUserWorkoutLog(user?._id);
   
      // Check if user._id is inside the pendingRequestList array
      const isUserInPendingRequests = pendingRequestList?.some(
        (request) => request.userId.toString() === user?._id.toString()
      );

      const plainData = await converUserWorkoutLogToPlainData(user, latestWorkoutLog, isUserInPendingRequests)
      return plainData;
    }));

  return (
    <section className='flex flex-col justify-center items-center w-full'>
      
      <h2 className='w-full text-left font-medium text-blue-800'>
        {type.charAt(0).toUpperCase() + type.slice(1)} Users
      </h2>
       
      <SearchUser 
          users={itemListPlainData}
      />      

    </section> 
  )
}

export default ListUser