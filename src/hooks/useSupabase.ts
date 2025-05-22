import { useCallback, useState } from 'react';
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

  const getClient = useCallback(async (): Promise<SupabaseClient<Database>> => {
    try {
      // Log authentication state
      console.log('Auth state:', { isSignedIn, userId });

      // If user is not signed in, return the default client
      if (!isSignedIn) {
        console.log('User is not signed in, using default client');
        return defaultClient;
      }

      // Get the Clerk JWT token for Supabase
      console.log('Requesting Supabase token from Clerk...');
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        console.error('No Supabase token received from Clerk');
        toast.error('Authentication failed: No token received');
        return defaultClient;
      }

      // Validate token format and contents
      const validation = validateToken(token);
      if (!validation.isValid) {
        console.error('Token validation failed:', validation.error);
        toast.error(`Authentication failed: ${validation.error}`);
        return defaultClient;
      }

      // Log token details (without exposing the full token)
      console.log('Token validation successful:', {
        length: token.length,
        prefix: token.substring(0, 20) + '...',
        header: validation.header,
        payload: validation.payload
      });

      console.log('Creating authenticated client...');
      const client = createAuthenticatedClient(token);

      // Test the authentication with a simple query
      console.log('Testing authentication with Supabase...');
      const { data, error } = await client.from('products').select('count').limit(1);
      
      if (error) {
        console.error('Authentication test failed:', {
          error,
          errorMessage: error.message,
          errorDetails: error.details,
          errorHint: error.hint,
          // Log the specific JWT error if present
          jwtError: error.message.includes('JWT') ? {
            message: error.message,
            details: error.details,
            hint: error.hint
          } : null,
          // Include token validation info
          tokenValidation: validation
        });
        
        // Provide more specific error message
        if (error.message.includes('JWT')) {
          toast.error('Authentication failed: Invalid JWT token. Please check Clerk JWT template settings and try signing out and back in.');
        } else {
          toast.error(`Authentication failed: ${error.message}`);
        }
        return defaultClient;
      }

      console.log('Authentication successful!');
      setIsAuthenticated(true);
      return client;
    } catch (error) {
      console.error('Error in getClient:', error);
      toast.error('Failed to authenticate with Supabase');
      return defaultClient;
    }
  }, [getToken, isSignedIn, userId]);

  return { getClient, isAuthenticated };
}; 