import Stripe from 'stripe'
import { PRICING } from '@/lib/constants'

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(key, {
    apiVersion: '2026-03-25.dahlia',
  })
}

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  mode: 'subscription' | 'payment' = 'subscription'
) {
  const stripe = getStripeClient()
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
    metadata: {
      userId,
      plan: priceId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  })

  return session
}

export async function createPortalSession(customerId: string) {
  const stripe = getStripeClient()
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
  })

  return session
}

export async function getOrCreateCustomer(email: string, userId: string): Promise<string> {
  const stripe = getStripeClient()
  const existing = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existing.data.length > 0) {
    return existing.data[0].id
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  })

  return customer.id
}

export async function getSubscriptionTier(subscriptionId: string): Promise<'free' | 'pro' | 'api'> {
  const stripe = getStripeClient()
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const priceId = subscription.items.data[0]?.price.id

  if (!priceId) return 'free'

  const proPriceIds = [
    process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  ].filter(Boolean)

  if (proPriceIds.includes(priceId)) return 'pro'

  const apiPriceIds = [
    process.env.STRIPE_API_STARTER_PRICE_ID,
    process.env.STRIPE_API_GROWTH_PRICE_ID,
    process.env.STRIPE_API_SCALE_PRICE_ID,
  ].filter(Boolean)

  if (apiPriceIds.includes(priceId)) return 'api'

  return 'free'
}
