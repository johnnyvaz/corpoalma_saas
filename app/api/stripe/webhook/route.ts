
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import { db } from '@/lib/db/drizzle';
import { teams, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'payment' && session.payment_status === 'paid') {
          // Handle one-time payment completion
          const teamId = session.metadata?.teamId;
          const userId = session.metadata?.userId;
          
          if (!teamId || !userId) {
            console.error('Missing metadata in checkout session');
            break;
          }

          // Update team with payment info
          await db.update(teams)
            .set({
              stripeCustomerId: session.customer as string,
              planName: 'Programa Alimentando Corpo e Alma',
              subscriptionStatus: 'paid',
            })
            .where(eq(teams.id, parseInt(teamId)));

          // Update user to start the program
          await db.update(users)
            .set({
              programStartDate: new Date(),
              currentWeek: 1,
            })
            .where(eq(users.id, parseInt(userId)));

          console.log(`Program access granted for user ${userId}, team ${teamId}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        // Handle recurring subscription payments (if you add them later)
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);
        break;
      }

      case 'invoice.payment_failed': {
        // Handle failed payments
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed:', invoice.id);
        break;
      }

      case 'customer.subscription.deleted': {
        // Handle subscription cancellation (if you add subscriptions later)
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', subscription.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
