import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { getStripeSubscription } from '@/lib/actions/stripe';
import CardRequestPayment from '@/components/CardRequestPayment';
import ListSubscriptionRequest from '@/components/ListSubscriptionRequest';
import { SubscriptionRequestInterface, WorkoutInterface } from '@/common.types';
import { fetchUser } from '@/lib/users/userActions';
import { countPaidWorkouts, fetchFreeWorkouts, fetchUserWorkouts } from '@/lib/workouts/workoutActions';
import { fetchUserLatestSubscriptionRequest, fetchUserSubscriptionRequest } from '@/lib/subscriptionRequests/subscriptionRequestActions';
import { convertUserToPlainData } from '@/lib/users/userHelpers';
import { getCapitalizedFirstName } from '@/lib/actions';
import { convertWorkoutToPlainData } from '@/lib/workouts/workoutHelpers';
import { fetchLatestWorkoutLog } from '@/lib/completionHistory/completionHistoryActions';
import { convertWorkoutCompletionHistoryToPlainData } from '@/lib/completionHistory/completionHistoryHelpers';
import ListWorkout from '@/components/ListWorkout';


const page = async ({params: { id }}: {params: { id: string }}) => {

    // Add Something to handle a pending Subscription request.

    const session = await  getCurrentUser();
    if (!session?.user) {
        redirect('/') 

    } else if (session?.user?.role == 'client' && session?.user?.id != id) {
        redirect('/') 
    }
    
    // User.
    const user = await fetchUser(id);
    const userPlainData = await convertUserToPlainData(user)
    const firstName = getCapitalizedFirstName(user?.username)


    // Free Workouts.
    const workoutList = await fetchFreeWorkouts(user?._id);
    const workoutsData = await Promise.all(workoutList.map(async (workout : WorkoutInterface) => {
        const workoutPlainData = await convertWorkoutToPlainData(workout)
        
        const latestWorkoutLog = await fetchLatestWorkoutLog(user?._id, workout?._id);
        let logPlainData;
        if (latestWorkoutLog) {
            logPlainData = await convertWorkoutCompletionHistoryToPlainData(latestWorkoutLog)
        }

        return {workoutPlainData, logPlainData}
    }));


    // Paid Workouts.
    const arePaidWorkouts = await countPaidWorkouts(user?._id);

    // If there are paid workout then do this:
    const workoutListPaid = await fetchUserWorkouts(user?._id);
    const workoutsDataPaid = await Promise.all(workoutListPaid.map(async (workout : WorkoutInterface) => {
        const workoutPlainData = await convertWorkoutToPlainData(workout)
        const latestPaidWorkoutLog = await fetchLatestWorkoutLog(user?._id, workout?._id);
        let logPlainData;
        if (latestPaidWorkoutLog) {
            logPlainData = await convertWorkoutCompletionHistoryToPlainData(latestPaidWorkoutLog)
        }
        return {workoutPlainData, logPlainData}
    }));


    // Stripe Subscription
    let userStripeSubscription;
    if (user?.subscriptionId) {
        userStripeSubscription = await getStripeSubscription(user?.subscriptionId);

    }

    // Subscription Request
    let subscriptionRequestList = null;
    if (session?.user?.role == 'trainer') {
        subscriptionRequestList = await fetchUserSubscriptionRequest(user?._id,) as SubscriptionRequestInterface[];
    }

    const pendingSubscriptionRequest = await fetchUserLatestSubscriptionRequest(user?._id, 'pending') as SubscriptionRequestInterface;
    
    
    return (
        <section className='flex flex-col justify-center items-center self-center max-w-[1024px] w-full gap-8'>
            <div className='flex justify-center items-center w-full gap-4'>
                <Link 
                    href= {`/dashboard/client/${id}`}
                    className='flex flex-col justify-center items-center w-full gap-4'
                    >
                    <Image 
                            src={user?.avatarUrl}
                            width={80}
                            height={80}
                            alt='user profile image'
                            className='rounded-full border'
                        />
                
                    <h2 className='font-semibold text-xl'>{firstName}'s workouts</h2>
                </Link>
            </div>

            {!user?.subscriptionId && arePaidWorkouts > 0 && pendingSubscriptionRequest && session?.user?.role == 'client' && (
                <CardRequestPayment 
                    user={user}
                />
                )}


            {(user?.subscriptionId && userStripeSubscription?.status == 'active' || 
                session?.user?.role == 'trainer' && pendingSubscriptionRequest) && (

                <ListWorkout
                    type='paid'
                    user={userPlainData}
                    workouts={workoutsDataPaid}
                    session={session}
                    displayButton={true}
                />
            )}
                
            { (!user?.subscriptionId || userStripeSubscription?.status != 'active')  && (

                <ListWorkout 
                    type='free'
                    user={userPlainData}
                    workouts={workoutsData}
                    session={session}
                    displayButton={false}
                />
            )}

            { session?.user?.role == 'trainer' && subscriptionRequestList && subscriptionRequestList?.length != 0 && (
                <div className='flex w-full'>
                    <ListSubscriptionRequest 
                        requestList={subscriptionRequestList}
                    />
                </div>
            )}
        
        </section>
        )

}

export default page