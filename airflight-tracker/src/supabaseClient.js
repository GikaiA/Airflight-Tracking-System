import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qdbnoqmwifbsckkfdtgx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkYm5vcW13aWZic2Nra2ZkdGd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwMTIwNjcsImV4cCI6MjAyOTU4ODA2N30.mKJIgJANOQZL05PU024ovb_w-rpwHjJ9PEUsKYd4p4M";

export const supabase = createClient(supabaseUrl, supabaseKey);
