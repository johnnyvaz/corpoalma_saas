'use server';

import { z } from 'zod';
import { validatedAction } from '@/lib/auth/middleware';
import { signInWithEmail, signUpWithEmail, signOut } from '@/lib/auth/session';
import { createUser, getUserByEmail, createTeam, createTeamMember, logActivity } from '@/lib/db/queries';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100)
});

const signUpSchema = z.object({
  email: z.string().email().min(3).max(255),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(100)
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const result = await signInWithEmail(email, password);

  if (result.error) {
    return {
      error: result.error,
      email,
      password
    };
  }

  // Log activity
  const user = await getUserByEmail(email);
  if (user) {
    await logActivity(undefined, user.id, 'sign_in');
  }

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    // Handle checkout redirect if needed
    redirect('/pricing');
  }

  redirect('/dashboard');
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password, name } = data;

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return {
      error: 'User with this email already exists',
      email,
      name,
      password
    };
  }

  const result = await signUpWithEmail(email, password, name);

  if (result.error) {
    return {
      error: result.error,
      email,
      name,
      password
    };
  }

  if (result.data?.user) {
    // Create user in our database
    await createUser({
      id: result.data.user.id,
      email: result.data.user.email!,
      name: name,
      currentWeek: 1,
      programCompleted: false,
      programStartDate: new Date(),
    });

    // Create a default team for the user
    const team = await createTeam({
      name: `${name}'s Team`,
    });

    await createTeamMember({
      userId: result.data.user.id,
      teamId: team.id,
      role: 'owner',
    });

    await logActivity(team.id, result.data.user.id, 'sign_up');
  }

  const redirectTo = formData.get('redirect') as string | null;
  if (redirectTo === 'checkout') {
    redirect('/pricing');
  }

  redirect('/dashboard');
});

export async function signOutAction() {
  await signOut();
  redirect('/');
}