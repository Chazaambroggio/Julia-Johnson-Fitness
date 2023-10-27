import React from 'react'
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { fetchUsers } from '@/lib/users/userActions';
import ListUser from '@/components/ListUser';
import { fetchTrainerSubscriptionRequest } from '@/lib/subscriptionRequests/subscriptionRequestActions';

const Users = async () => {

    const session = await  getCurrentUser();
    if (!session?.user) {
      redirect('/')
    } else if (session?.user?.role == 'client') {
      redirect(`/user/${session?.user?.id}`)
    }

    const paidUsers = await fetchUsers(session?.user?.id, 'paid');
    const freeUsers = await fetchUsers(session?.user?.id, 'free');

    const pendingRequest = await fetchTrainerSubscriptionRequest(session?.user?.id, 'pending')

  return (
    <div className='flex flex-col justify-start items-center self-center h-full w-full max-w-[1024px] gap-8'>
        
      <h1 className='text-3xl'>Users</h1>

      {paidUsers && (
        <ListUser
          trainerId = {session?.user?.id}
          userList={paidUsers}
          type='paid'
          pendingRequestList={pendingRequest}
        />
      )}

      {freeUsers && (
        <ListUser
          trainerId = {session?.user?.id}
          userList={freeUsers}
          type='free'
          pendingRequestList={pendingRequest}

        />
      )}

    </div>
  )
}

export default Users