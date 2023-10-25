
import { updateSubscriptionPlan } from '@/lib/subscriptionPlans/subscriptionPlanActions';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {

    const data = await request.json();
   
  if (request.method !== 'PUT') {
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
    const updatedSubscriptionPlan = await updateSubscriptionPlan(data.form, data.session?.user?.id );

    return NextResponse.json(
        updatedSubscriptionPlan,
        {status: 201}
    )
  } catch (error) {
    console.error('Error editing subscription plan:', error);
    return NextResponse.json(
        {message: 'Internal Server Error'},
        {status: 500}
    )
  }
}