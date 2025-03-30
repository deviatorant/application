
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Use environment variables or fall back to provided credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kbpajbqktyojbkgdzjwu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImticGFqYnFrdHlvamJrZ2R6and1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNTkzMzgsImV4cCI6MjA1ODYzNTMzOH0.-C7YSeO2zFcsfbJxowvjJlTSpGwDkyb0Oxh0svqUDGQ';

// Check to make sure we have valid credentials
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
