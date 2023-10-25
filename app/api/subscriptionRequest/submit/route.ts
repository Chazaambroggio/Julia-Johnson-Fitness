import { subscriptionRequestSubmit } from '@/lib/subscriptionRequests/subscriptionRequestActions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {

    const { subscriptionRequestForm, session} = await request.json();

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

    // Calling submit questionnaire on the server-side
    const savedSubscriptionRequest = await subscriptionRequestSubmit(subscriptionRequestForm, session?.user?.id );

    return NextResponse.json(
        savedSubscriptionRequest,
        {status: 201}
    )
  } catch (error) {
    console.error('Error creating subscription request:', error);
    return NextResponse.json(
        {message: 'Internal Server Error'},
        {status: 500}
    )
  }
}