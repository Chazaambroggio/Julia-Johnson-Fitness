'use server'
import type { Stripe } from 'stripe'
import { formatAmountForStripe } from '@/utils/stripe-helpers'
import { stripe } from '@/lib/stripe'

export async function createCheckoutSession(amount: number, subscriptionPlan: string): Promise<{ checkoutSessionUrl: string }> {
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${subscriptionPlan}`,
              },
              recurring: {
                interval:'month',
                interval_count: 1,
              },
              unit_amount: formatAmountForStripe(
                Number(amount),
                'usd'
              ),
            },
          },
        ],
        billing_address_collection: 'auto',
        success_url: `${process.env.APP_PUBLIC_URL}/stripe/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_PUBLIC_URL}`,
      })
      
    return { checkoutSessionUrl: checkoutSession.url as string}
  }

  export async function createPaymentIntent( data: FormData ): Promise<{ client_secret: string }> {
    const paymentIntent: Stripe.PaymentIntent =
      await stripe.paymentIntents.create({
        amount: formatAmountForStripe(
          Number(data.get('customDonation') as string),
          'usd'
        ),
        automatic_payment_methods: { enabled: true },
        currency: 'usd',
      })
  
    return { client_secret: paymentIntent.client_secret as string }
  }

  export async function getStripeSubscription(subscriptionId : string) {
    const subscription = await stripe.subscriptions.retrieve(
      subscriptionId
    );
    return subscription;
  }

  export async function getStripeSubscriptionAndProduct(subscriptionId : string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(
        subscriptionId
      );
   
      const productId = subscription.items.data[0].plan.product as string;
     
      const product = await stripe.products.retrieve(
        productId
        );
      return {subscription, product};

    } catch (error) {
      console.error('Error retriving Stripe subscription and product details:', error);
      throw error;
    }
  }
