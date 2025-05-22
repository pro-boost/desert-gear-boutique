import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Create a default client for non-authenticated requests
export const defaultClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Creates an authenticated Supabase client using a Clerk JWT token
 * @param token The JWT token from Clerk
 * @returns An authenticated Supabase client
 */
export const createAuthenticatedClient = (token: string): SupabaseClient<Database> => {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}; 