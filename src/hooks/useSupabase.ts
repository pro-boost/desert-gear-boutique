import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState, useCallback, useRef } from 'react';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@clerk/clerk-react';

// Create a default client for non-authenticated requests
const defaultClient = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

export const useSupabase = () => {
  const { getToken, isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const authenticatedClientRef = useRef<SupabaseClient<Database> | null>(null);

  // Initialize the client
  useEffect(() => {
    const initializeClient = async () => {
      try {
        // Start with the default client
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
      // If we already have an authenticated client, return it
      if (authenticatedClientRef.current) {
        return authenticatedClientRef.current;
      }

      // Get the Supabase token from Clerk
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        console.warn('No Supabase token available, using default client');
        return defaultClient;
      }

      // Create a new client with the token only if we don't have one
      authenticatedClientRef.current = createClient<Database>(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
          },
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        }
      );

      return authenticatedClientRef.current;
    } catch (error) {
      console.error('Error getting authenticated client:', error);
      // Return the default client if authentication fails
      return defaultClient;
    }
  }, [isInitialized, isSignedIn, getToken]);

  // Clear the authenticated client when signing out
  useEffect(() => {
    if (!isSignedIn) {
      authenticatedClientRef.current = null;
    }
  }, [isSignedIn]);

  return { getClient, isLoading, isInitialized };
}; 