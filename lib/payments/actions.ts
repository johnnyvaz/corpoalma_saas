
'use server';

import { z } from 'zod';
import { validatedAction } from '@/lib/auth/middleware';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { stripe } from '@/lib/payments/stripe';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

const createCheckoutSessionSchema = z.object({});

export const createCheckoutSession = validatedActionWithUser(
  createCheckoutSessionSchema,
  async (data, formData, user) => {
    if (!user) {
      throw new Error('User is not authenticated');
    }

    const headersList = await headers();
    const domain = (await headersList.get('host')) || 'localhost:3000';
    const protocol = (await headersList.get('x-forwarded-proto')) || 'http';

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
                images: [],
              },
              unit_amount: 5000,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: user.email,
        metadata: {
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

export const manageBilling = validatedActionWithUser(
  manageBillingSchema,
  async (data, formData, user) => {
    if (!user) {
      throw new Error('User is not authenticated');
    }

    const headersList = await headers(); // `headers()` não é async
    const domain = headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || 'http';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.id.toString(),  //TODO: VERIFICAR O ID DO STRIPE
      return_url: `${protocol}://${domain}/dashboard`,
    });

    redirect(portalSession.url);
  }
);

// Alias for backward compatibility
export const customerPortalAction = manageBilling;
