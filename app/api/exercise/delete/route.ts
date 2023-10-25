import { deleteExercise } from '@/lib/exercises/exerciseActions';
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
    const deletedExercise = await deleteExercise(data.id, data.session?.user?.id);

    return NextResponse.json(
        deletedExercise,
        {status: 201}
    )
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json(
        {message: 'Internal Server Error'},
        {status: 500}
    )
  }
}