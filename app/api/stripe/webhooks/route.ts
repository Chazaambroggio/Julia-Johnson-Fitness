// Docs for Stripe webhooks:
// https://stripe.com/docs/api/
// https://stripe.com/docs/stripe-cli
// https://stripe.com/docs/webhooks/quickstart
// https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript/app
// stripe listen --forward-to localhost:3000/api/stripe/webhooks


import type { Stripe } from 'stripe'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { cancelUserSubscription, updateUserSubscription } from '@/lib/users/userActions'
import { markCompletedSubscriptionRequest } from '@/lib/subscriptionRequests/subscriptionRequestActions'

export async function POST(req: Request) {
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err)
    console.log(`❌ Error message: ${errorMessage}`)
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  // Successfully constructed event.
  console.log('✅ Success:', event.id)

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'customer.subscription.deleted'
  ]

  //  customer.subscription.created
  // customer.subscription.deleted
  // customer.subscription.paused
  // customer.subscription.resumed

  if (permittedEvents.includes(event.type)) {
    let data

    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session
          console.log(`💰 CheckoutSession status: ${data.payment_status}`)
          
          if(data.subscription && data?.customer_details?.email) {
            const subscriptionId = data.subscription.toString();
            const email = data?.customer_details?.email;
            updateUserSubscription(email, subscriptionId)
            markCompletedSubscriptionRequest(email)
          }
          break

        case 'customer.subscription.deleted':
          data = event.data.object as Stripe.Subscription;
          const subscriptionId = data.id.toString();
          cancelUserSubscription(subscriptionId);
          break
          
        case 'payment_intent.payment_failed':
          data = event.data.object as Stripe.PaymentIntent
          console.log(`❌ Payment failed: ${data.last_payment_error?.message}`)
          break
        case 'payment_intent.succeeded':
          data = event.data.object as Stripe.PaymentIntent
          console.log(`💰 PaymentIntent status: ${data.status}`)
          break
        default:
          throw new Error(`Unhandled event: ${event.type}`)
      }
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { message: 'Webhook handler failed' },
        { status: 500 }
      )
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: 'Received' }, { status: 200 })
}