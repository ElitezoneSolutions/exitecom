import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if variables are properly configured (not empty, and not placeholder values)
export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseUrl !== "your_supabase_project_url" &&
  supabaseAnonKey !== "your_supabase_anon_key";

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase credentials are not configured or are placeholder values. Operating in Demo/Fallback mode.",
  );
}

// Create the client with empty strings as fallbacks to prevent runtime exceptions during initialization
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : "https://placeholder-url.supabase.co",
  isSupabaseConfigured ? supabaseAnonKey : "placeholder-key",
);
