import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState, useCallback, useRef } from 'react';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@clerk/clerk-react';

// Create a singleton default client for non-authenticated requests
const defaultClient = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'supabase.auth.default'
    }
  }
);

// Create a singleton authenticated client
let authenticatedClient: SupabaseClient<Database> | null = null;

export const useSupabase = () => {
  const { getToken, isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const tokenRef = useRef<string | null>(null);

  // Initialize the client
  useEffect(() => {
    const initializeClient = async () => {
      try {
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing Supabase client:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeClient();
  }, []);

  const getClient = useCallback(async () => {
    if (!isInitialized) {
      throw new Error('Supabase client not initialized');
    }

    // For non-authenticated requests, return the default client
    if (!isSignedIn) {
      return defaultClient;
    }

    try {
      // Get the Supabase token from Clerk
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        console.warn('No Supabase token available, using default client');
        return defaultClient;
      }

      // If we have a token and it's different from our current token, update the client
      if (token !== tokenRef.current) {
        tokenRef.current = token;
        
        // Create a new authenticated client with the new token
        authenticatedClient = createClient<Database>(
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

      return authenticatedClient || defaultClient;
    } catch (error) {
      console.error('Error getting authenticated client:', error);
      return defaultClient;
    }
  }, [isInitialized, isSignedIn, getToken]);

  // Clear the authenticated client when signing out
  useEffect(() => {
    if (!isSignedIn) {
      authenticatedClient = null;
      tokenRef.current = null;
    }
  }, [isSignedIn]);

  return { getClient, isLoading, isInitialized };
}; 