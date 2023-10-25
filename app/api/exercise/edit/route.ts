import { updateExercise } from '@/lib/exercises/exerciseActions';
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
    const updatedExercise = await updateExercise(data.form, data.session?.user?.id );

    return NextResponse.json(
        updatedExercise,
        {status: 201}
    )
  } catch (error) {
    console.error('Error editing exercise:', error);
    return NextResponse.json(
        {message: 'Internal Server Error'},
        {status: 500}
    )
  }
}