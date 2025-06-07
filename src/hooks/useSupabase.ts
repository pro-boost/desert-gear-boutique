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
  const clientRef = useRef<SupabaseClient<Database>>(defaultClient); // ✅ Add this

  useEffect(() => {
    const initializeClient = async () => {
      if (isInitializing) return;

      try {
        isInitializing = true;
        setIsLoading(true);

        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          throw new Error('Missing Supabase environment variables');
        }

        const { error } = await defaultClient.from('categories').select('count').limit(1);
        if (error) throw error;

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing Supabase client:', error);
      } finally {
        setIsLoading(false);
        isInitializing = false;
      }
    };

    initializeClient();
  }, []);

  const getClient = useCallback(async () => {
    if (!isInitialized || !isSignedIn) {
      return defaultClient;
    }

    try {
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        console.warn('No Supabase token available, using default client');
        return defaultClient;
      }

      // Debug: log payload
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('Token payload:', payload);
      }

      // Create client only if token changed
      if (token !== tokenRef.current) {
        tokenRef.current = token;
        const client = createClient<Database>(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY,
          {
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          }
        );

        clientRef.current = client; // ✅ Store new client
        console.log('New authenticated Supabase client created');
      }

      return clientRef.current; // ✅ Always return this
    } catch (error) {
      console.error('Error getting authenticated Supabase client:', error);
      return defaultClient;
    }
  }, [isInitialized, isSignedIn, getToken]);

  // Reset client and token on sign-out
  useEffect(() => {
    if (!isSignedIn) {
      tokenRef.current = null;
      clientRef.current = defaultClient;
    }
  }, [isSignedIn]);

  return { getClient, isLoading, isInitialized };
};
