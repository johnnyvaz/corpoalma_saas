
'use server';

import { z } from 'zod';
import { validatedAction } from '@/lib/auth/middleware';
import { stripe } from '@/lib/payments/stripe';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

const createCheckoutSessionSchema = z.object({});

export const createCheckoutSession = validatedAction(
  createCheckoutSessionSchema,
  async (data, { user, team }) => {
    if (!team) {
      throw new Error('Team not found');
    }

    const headersList = headers();
    const domain = headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || 'http';

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: 'Programa Alimentando Corpo e Alma',
                description: 'Programa completo de 5 semanas baseado em princípios bíblicos para transformação da saúde',
                images: [], // Add program image URL here if available
              },
              unit_amount: 5000, // R$ 50.00 in centavos
            },
            quantity: 1,
          },
        ],
        mode: 'payment', // One-time payment instead of subscription
        customer_email: user.email,
        metadata: {
          teamId: team.id.toString(),
          userId: user.id.toString(),
        },
        success_url: `${protocol}://${domain}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${protocol}://${domain}/pricing`,
        automatic_tax: {
          enabled: false,
        },
      });

      if (!session.url) {
        throw new Error('Failed to create checkout session');
      }

      redirect(session.url);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }
);

const manageBillingSchema = z.object({});

export const manageBilling = validatedAction(
  manageBillingSchema,
  async (data, { team }) => {
    if (!team?.stripeCustomerId) {
      throw new Error('No Stripe customer found');
    }

    const headersList = headers();
    const domain = headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || 'http';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: team.stripeCustomerId,
      return_url: `${protocol}://${domain}/dashboard`,
    });

    redirect(portalSession.url);
  }
);
