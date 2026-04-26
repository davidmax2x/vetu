import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSubscriptionTier } from '@/lib/billing/stripe'
import { setUserTier } from '@/lib/billing/entitlements'

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(key, {
    apiVersion: '2026-03-25.dahlia',
  })
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const payload = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
      event = getStripeClient().webhooks.constructEvent(payload, signature, webhookSecret)
    } catch (err: any) {
      console.error('[BILLING] Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId && session.subscription) {
          const tier = await getSubscriptionTier(session.subscription as string)
          await setUserTier(userId, tier)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string
        const customer = await getStripeClient().customers.retrieve(invoice.customer as string)

        if (customer && !customer.deleted) {
          const userId = customer.metadata?.userId
          if (userId && subscriptionId) {
            const tier = await getSubscriptionTier(subscriptionId)
            await setUserTier(userId, tier)
          }
        }
        break
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customer = await getStripeClient().customers.retrieve(subscription.customer as string)

        if (customer && !customer.deleted) {
          const userId = customer.metadata?.userId
          if (userId) {
            const tier = subscription.status === 'active' || subscription.status === 'trialing'
              ? await getSubscriptionTier(subscription.id)
              : 'free'
            await setUserTier(userId, tier)
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[BILLING] Webhook error:', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: error.message }, { status: 500 })
  }
}
