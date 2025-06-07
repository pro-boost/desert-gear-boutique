import { useEffect, useState, useCallback } from 'react';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@clerk/clerk-react';
import { supabase, getClient } from '@/lib/supabaseClient';

export const useSupabase = () => {
  const { getToken, isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        setIsLoading(true);
        
        // Test the connection using the default client
        const { error } = await supabase.from('categories').select('count').limit(1);
        if (error) throw error;

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing Supabase client:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeClient();
  }, []);

  const getAuthenticatedClient = useCallback(async () => {
    if (!isInitialized || !isSignedIn) {
      return supabase;
    }

    try {
      const token = await getToken({ template: 'supabase' });
      if (!token) {
        console.warn('No Supabase token available, using default client');
        return supabase;
      }

      return await getClient(token);
    } catch (error) {
      console.error('Error getting authenticated Supabase client:', error);
      return supabase;
    }
  }, [isInitialized, isSignedIn, getToken]);

  return { getClient: getAuthenticatedClient, isLoading, isInitialized };
};
