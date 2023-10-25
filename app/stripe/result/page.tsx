import type { Stripe } from 'stripe'
import { stripe } from '@/lib/stripe'
import { getCurrentUser } from '@/lib/session';
import Button from '@/components/Button';
import Link from 'next/link';


export default async function ResultPage({searchParams,}: { searchParams: { session_id: string }}): Promise<JSX.Element> {
  
  if (!searchParams.session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(searchParams.session_id, {
      expand: ['line_items', 'payment_intent'],
    })

    const session = await  getCurrentUser();

    let formattedPrice;
    if (checkoutSession?.amount_total) {
      formattedPrice = (checkoutSession.amount_total / 100).toFixed(2);
    } 
    
  return (
    <section className='flex flex-col justify-center items-center self-center max-w-[1024px] w-full gap-8'>
      
      <div className='flex flex-col items-center w-full p-4 gap-4 shadow'>
        <h2 className='font-semibold text-3xl'>Thank you!</h2>

        <div className='flex flex-col'>

          <div className='flex w-full'>
            <p>
              <span>Subscription: </span>
              <span className='font-semibold'>{checkoutSession?.line_items?.data[0].description}</span>
            </p>
          </div>
          <div className='flex w-full'>
            <p>
              <span>Total Price: </span>
              <span className='font-semibold'>${formattedPrice}</span>
            </p>
          </div>
          <div className='flex w-full'>
            <p>
              <span>Email: </span>
              <span className='font-semibold'>{checkoutSession?.customer_details?.email}</span>
            </p>
          </div>

        </div>
      </div>

      <Link
        href={`/user/${session?.user?.id}`}
        >
        <Button
          title='View your Workouts'
          />
      </Link>


    </section>
      
    
  )
}