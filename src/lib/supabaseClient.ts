import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Creating default Supabase client with URL:', SUPABASE_URL);

// Create a default client for non-authenticated requests
export const defaultClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test the connection immediately
(async () => {
  try {
    const { data, error } = await defaultClient.from('products').select('count').limit(1);
    if (error) {
      console.error('Error testing Supabase connection:', error);
    } else {
      console.log('Successfully connected to Supabase, product count:', data);
    }
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
  }
})();

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