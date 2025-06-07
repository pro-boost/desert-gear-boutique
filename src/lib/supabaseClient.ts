import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

// Debug tracking
const clientInstances = new Set<string>();
let instanceCounter = 0;

const logClientCreation = (type: string) => {
  instanceCounter++;
  const id = `${type}-${instanceCounter}`;
  clientInstances.add(id);
  console.log(`Created ${type} client (${id}). Total instances:`, clientInstances.size);
  console.log('Current instances:', Array.from(clientInstances));
};

// Cache for current token
let currentToken: string | null = null;

// Custom fetch function that adds auth header
const customFetch = async (url: RequestInfo, options?: RequestInit) => {
  console.log('Custom fetch called with token:', currentToken ? 'present' : 'absent');
  
  const headers = new Headers(options?.headers);
  if (currentToken) {
    headers.set('Authorization', `Bearer ${currentToken}`);
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
};

// Create a single client instance with minimal auth configuration
console.log('Creating base Supabase client...');
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    storage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
  },
  global: {
    fetch: customFetch,
  },
});
logClientCreation('base');

// Override the auth methods to prevent GoTrueClient initialization
console.log('Overriding base client auth methods...');
const authOverride = {
  onAuthStateChange: () => {
    console.log('Auth state change called');
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
  getSession: async () => {
    console.log('Get session called');
    return { data: { session: null }, error: null };
  },
  getUser: async () => {
    console.log('Get user called');
    return { data: { user: null }, error: null };
  },
};

Object.assign(supabase.auth, authOverride);
console.log('Base client auth methods overridden');

// Function to get a client with auth headers
export const getClient = async (token?: string | null): Promise<SupabaseClient<Database>> => {
  console.log('getClient called with token:', token ? 'present' : 'absent');
  
  if (token !== currentToken) {
    console.log(token ? 'Updating token' : 'Clearing token');
    currentToken = token;
  } else {
    console.log('Token unchanged');
  }
  
  return supabase;
};

// Test the connection immediately
(async () => {
  try {
    console.log('Testing base client connection...');
    const { data, error } = await supabase.from('products').select('count').limit(1);
    if (error) {
      console.error('Error testing Supabase connection:', error);
    } else {
      console.log('Successfully connected to Supabase, product count:', data);
    }
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
  }
})(); 