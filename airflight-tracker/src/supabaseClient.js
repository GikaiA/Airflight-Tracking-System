import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uojhqmrjvppmamawmfyf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvamhxbXJqdnBwbWFtYXdtZnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ1MDQzOTAsImV4cCI6MjAzMDA4MDM5MH0.BF4RQ4lBz7nflHi2Ze0poGNJjPCna4AdKjohl-Yc4d8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;