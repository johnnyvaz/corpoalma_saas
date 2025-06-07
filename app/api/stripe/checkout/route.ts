import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users, teams, teamMembers } from '@/lib/db/schema';
import { setSession } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.customer || typeof session.customer === 'string') {
      throw new Error('Invalid customer data from Stripe.');
    }

    if (session.mode === 'payment' && session.payment_status === 'paid') {
      // Handle successful one-time payment
      const teamId = session.metadata?.teamId;
      const userId = session.metadata?.userId;

      if (!teamId || !userId) {
        throw new Error('Missing metadata in checkout session');
      }

      // Get user and set session
      const user = await db.select().from(users).where(eq(users.id, parseInt(userId))).limit(1);

      if (user.length === 0) {
        throw new Error('User not found');
      }

      // Set user session
      await setSession(user[0]);

      console.log(`Payment successful for user ${userId}, redirecting to dashboard`);
      return NextResponse.redirect(new URL('/dashboard?welcome=true', request.url));
    }

    return NextResponse.redirect(new URL('/pricing?error=payment_failed', request.url));
  } catch (error) {
    console.error('Error processing checkout:', error);
    return NextResponse.redirect(new URL('/pricing?error=processing_failed', request.url));
  }
}