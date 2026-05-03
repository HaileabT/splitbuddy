import { createBrowserClient } from "@supabase/ssr";

let auth: ReturnType<typeof createBrowserClient> | undefined = undefined;

export const getAuth = () => {
  if (!auth) {
    auth = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        isSingleton: true,
        auth: {
          persistSession: true,
        },
      },
    );
  }
  return auth;
};
