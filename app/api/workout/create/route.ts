import { createWorkout } from '@/lib/workouts/workoutActions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    const { form, session} = await request.json();

  if (request.method !== 'POST') {
    return NextResponse.json(
        {message: 'Method not allowed'},
        {status: 405}
    )
  }

  try {
    // Verifying authorization
    if (!session?.user) {
      return NextResponse.json(
        {message: 'Unauthorized'},
        {status: 401}
    )
    }

    // Calling createWorkout on the server-side
    const savedWorkout = await createWorkout(form, session?.user?.id );

    return NextResponse.json(
        savedWorkout,
        {status: 201}
    )
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
        {message: 'Internal Server Error'},
        {status: 500}
    )
  }
}