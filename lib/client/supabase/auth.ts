
import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

let auth: SupabaseClient | undefined = undefined;

console.log(process.env.NEXT_PUBLIC_SUPABASE_URL!)
console.log(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!)

export const getAuth = (): SupabaseClient => {
  if (!auth) {
    auth = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        isSingleton: true,
        auth: {
          persistSession: true,
          detectSessionInUrl: true,
          autoRefreshToken: true,
        },
      },
    );
  }
  return auth;
};
