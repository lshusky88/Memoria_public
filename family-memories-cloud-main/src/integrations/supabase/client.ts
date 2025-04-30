import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ytyitftbndxiduawfbqp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0eWl0ZnRibmR4aWR1YXdmYnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Njk2MzAsImV4cCI6MjA2MDQ0NTYzMH0.gZrWxhgjYKwGDN73kf3h9wThebEOD8EKyLmpz_IeOrI";

// Export the URL
export const supabaseUrl = SUPABASE_URL;

// Initialize Supabase client with proper types
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY
);

// Helper function to log query errors with details
export const logQueryError = (error: any, operation: string, details: any = {}) => {
  console.error(`Supabase ${operation} Error:`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    queryDetails: details
  });
};

// Helper to get database connection info
export const getClientInfo = () => {
  return {
    url: SUPABASE_URL,
    schema: 'api',
    tables: {
      profiles: 'profiles',
      families: 'families',
      familyMembers: 'family_members',
      memories: 'memories',
      milestones: 'milestones',
      categories: 'categories'
    }
  };
};

export const getConnectionInfo = () => {
  return {
    url: SUPABASE_URL,
    schema: 'api',
    tables: {
      profiles: 'profiles',
      families: 'families',
      familyMembers: 'family_members',
      memories: 'memories',
      milestones: 'milestones',
      categories: 'categories'
    }
  };
};
