
import { deleteSubscriptionPlan } from '@/lib/subscriptionPlans/subscriptionPlanActions';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {

    const data = await request.json();
   
  if (request.method !== 'DELETE') {
    return NextResponse.json(
        {message: 'Method not allowed'},
        {status: 405}
    )
  }

  try {
    // Verifying authorization
    if (!data.session?.user) {
      return NextResponse.json(
        {message: 'Unauthorized'},
        {status: 401}
    )
    }

    // // Calling deleteExercise on the server-side
    const deletedSubscriptionPlan = await deleteSubscriptionPlan(data.id, data.session?.user?.id);

    return NextResponse.json(
        deletedSubscriptionPlan,
        {status: 201}
    )
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    return NextResponse.json(
        {message: 'Internal Server Error'},
        {status: 500}
    )
  }
}