import { useCallback, useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { toast } from '@/components/ui/sonner';
import { defaultClient, createAuthenticatedClient } from '@/lib/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Helper function to validate token format
const validateToken = (token: string) => {
  try {
    // Check if token has three parts (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format: should have three parts');
    }

    // Try to decode the payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check required claims
    if (payload.aud !== 'authenticated') {
      throw new Error('Invalid token: missing or incorrect "aud" claim');
    }

    return {
      isValid: true,
      payload,
      header: JSON.parse(atob(parts[0]))
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown token validation error'
    };
  }
};

export const useSupabase = () => {
  const { getToken, isSignedIn, userId } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const clientRef = useRef<SupabaseClient<Database> | null>(null);
  const tokenRef = useRef<string | null>(null);
  const lastTokenRefreshRef = useRef<number>(0);
  const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

  const getClient = useCallback(async (): Promise<SupabaseClient<Database>> => {
    try {
      // If user is not signed in, return the default client
      if (!isSignedIn) {
        clientRef.current = defaultClient;
        return defaultClient;
      }

      const now = Date.now();
      const shouldRefreshToken = !tokenRef.current || 
        !lastTokenRefreshRef.current || 
        (now - lastTokenRefreshRef.current) > TOKEN_REFRESH_INTERVAL;

      // Get a new token if needed
      if (shouldRefreshToken) {
        console.log('Refreshing Supabase token...');
        const token = await getToken({ template: 'supabase' });
        
        if (!token) {
          console.error('No Supabase token received from Clerk');
          toast.error('Authentication failed: No token received');
          return defaultClient;
        }

        // Validate token
        const validation = validateToken(token);
        if (!validation.isValid) {
          console.error('Token validation failed:', validation.error);
          toast.error(`Authentication failed: ${validation.error}`);
          return defaultClient;
        }

        tokenRef.current = token;
        lastTokenRefreshRef.current = now;
        clientRef.current = createAuthenticatedClient(token);
      }

      // If we have a cached client, return it
      if (clientRef.current) {
        return clientRef.current;
      }

      // This should not happen, but just in case
      console.error('No client available');
      return defaultClient;
    } catch (error) {
      console.error('Error in getClient:', error);
      toast.error('Failed to authenticate with Supabase');
      return defaultClient;
    }
  }, [getToken, isSignedIn]);

  return { getClient, isAuthenticated };
}; 