
import { createNewExercise } from '@/lib/exercises/exerciseActions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    const { form, session} = await request.json();
  
    console.log('CREATE API')

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

    // Calling createNewExercise on the server-side
    const savedExercise = 'Saved' //await createNewExercise(form, session?.user?.id );

    return NextResponse.json(
        savedExercise,
        {status: 201}
    )
  } catch (error) {
    console.error('Error creating exercise:', error);
    return NextResponse.json(
        {message: 'Internal Server Error'},
        {status: 500}
    )
  }
}