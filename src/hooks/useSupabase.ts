import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState, useCallback, useRef } from 'react';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@clerk/clerk-react';
import { defaultClient } from '@/lib/supabaseClient';

// Create a singleton instance
const supabaseInstance: SupabaseClient<Database> = defaultClient;
let isInitializing = false;

export const useSupabase = () => {
  const { getToken, isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const tokenRef = useRef<string | null>(null);

  // Initialize the client
  useEffect(() => {
    const initializeClient = async () => {
      console.log('Initializing Supabase client...', { isInitializing, hasInstance: !!supabaseInstance });
      if (isInitializing) {
        console.log('Already initializing, skipping...');
        return;
      }

      try {
        isInitializing = true;
        setIsLoading(true);
        
        // Check if environment variables are available
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.error('Missing Supabase environment variables');
          throw new Error('Missing Supabase environment variables');
        }

        console.log('Testing connection with default client...');
        // Test the connection with the default client first
        const { error } = await defaultClient.from('categories').select('count').limit(1);
        if (error) {
          console.error('Error testing connection:', error);
          throw error;
        }
        console.log('Connection test successful');

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing Supabase client:', error);
        throw error;
      } finally {
        setIsLoading(false);
        isInitializing = false;
      }
    };

    initializeClient();
  }, []);

  const getClient = useCallback(async () => {
    console.log('Getting Supabase client...', { isInitialized, isSignedIn });
    if (!isInitialized) {
      console.log('Not initialized, returning default client');
      return defaultClient;
    }

    // For non-authenticated requests, return the default client
    if (!isSignedIn) {
      console.log('User not signed in, returning default client');
      return defaultClient;
    }

    try {
      // Get the Supabase token from Clerk
      console.log('Getting Clerk token...');
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        console.warn('No Supabase token available, using default client');
        return defaultClient;
      }

      // If we have a token and it's different from our current token, create a new client
      if (token !== tokenRef.current) {
        console.log('Creating new authenticated client with token');
        tokenRef.current = token;
        
        // Create a new authenticated client
        return createClient<Database>(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY,
          {
            auth: {
              autoRefreshToken: true,
              persistSession: true,
              detectSessionInUrl: true,
              storageKey: 'supabase.auth.authenticated'
            },
            global: {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          }
        );
      }

      console.log('Using existing authenticated client');
      return supabaseInstance;
    } catch (error) {
      console.error('Error getting authenticated client:', error);
      return defaultClient;
    }
  }, [isInitialized, isSignedIn, getToken]);

  // Clear the token when signing out
  useEffect(() => {
    if (!isSignedIn) {
      tokenRef.current = null;
    }
  }, [isSignedIn]);

  return { getClient, isLoading, isInitialized };
}; 