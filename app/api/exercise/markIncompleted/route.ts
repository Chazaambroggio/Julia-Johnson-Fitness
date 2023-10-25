import { removeLogExercise } from '@/lib/completionHistory/completionHistoryActions';
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

    const removeLoggedExercise = await removeLogExercise(data.session?.user?.id, data.workout, data.exerciseId, data.completedAt );

    return NextResponse.json(
        removeLoggedExercise,
        {status: 201}
    )
  } catch (error) {
    console.error('Error removing logged exercise:', error);
    return NextResponse.json(
        {message: 'Internal Server Error'},
        {status: 500}
    )
  }
}