
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createSupabaseClient } from '@/lib/supabase/client';
import { User } from '@/lib/db/schema';
import { getUserById } from '@/lib/db/queries';

export async function getUser(): Promise<User | null> {
  const supabase = createServerSupabaseClient();
  
  try {
    const { data: { user: authUser }, error } = await supabase.auth.getUser();
    
    if (error || !authUser) {
      return null;
    }

    // Get user from our database
    const user = await getUserById(authUser.id);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  return await getUser();
}

export async function getSession() {
  const supabase = createServerSupabaseClient();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function signOut() {
  const supabase = createSupabaseClient();
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: 'Failed to sign out' };
  }
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createSupabaseClient();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message, data: null };
    }

    return { error: null, data };
  } catch (error) {
    console.error('Error signing in:', error);
    return { error: 'Failed to sign in', data: null };
  }
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const supabase = createSupabaseClient();
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      return { error: error.message, data: null };
    }

    return { error: null, data };
  } catch (error) {
    console.error('Error signing up:', error);
    return { error: 'Failed to sign up', data: null };
  }
}
