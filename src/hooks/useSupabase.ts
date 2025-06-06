import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState, useCallback, useRef } from 'react';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@clerk/clerk-react';

// Create a singleton instance
let supabaseInstance: SupabaseClient<Database> | null = null;
let isInitializing = false;

export const useSupabase = () => {
  const { getToken, isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const tokenRef = useRef<string | null>(null);

  // Initialize the client
  useEffect(() => {
    const initializeClient = async () => {
      if (isInitializing || supabaseInstance) {
        setIsInitialized(true);
        setIsLoading(false);
        return;
      }

      try {
        isInitializing = true;
        // Check if environment variables are available
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          throw new Error('Missing Supabase environment variables');
        }

        // Create the singleton instance
        supabaseInstance = createClient<Database>(
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

        // Test the connection
        const { error } = await supabaseInstance.from('categories').select('count').limit(1);
        if (error) {
          throw error;
        }

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
    if (!isInitialized || !supabaseInstance) {
      throw new Error('Supabase client not initialized');
    }

    // For non-authenticated requests, return the singleton instance
    if (!isSignedIn) {
      return supabaseInstance;
    }

    try {
      // Get the Supabase token from Clerk
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        console.warn('No Supabase token available, using default client');
        return supabaseInstance;
      }

      // If we have a token and it's different from our current token, update the client
      if (token !== tokenRef.current) {
        tokenRef.current = token;
        
        // Update the singleton instance with the new token
        supabaseInstance = createClient<Database>(
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

      return supabaseInstance;
    } catch (error) {
      console.error('Error getting authenticated client:', error);
      return supabaseInstance;
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