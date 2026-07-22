import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tzpkjadvgjxufkhwqxcu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cGtqYWR2Z2p4dWZraHdxeGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2MzMzOTksImV4cCI6MjAzNzIwOTM5OX0.sb_publishable_j5Nzop5Bok_n3FrHwVFNmw_hoWGyJSI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
