import { createServerClient } from "@supabase/ssr";
import { serverEnv } from "../env";
import { cookies } from "next/headers";


export const getServerAuth = async () => {
  const cookieStore = await cookies();

  const supabaseServer = createServerClient(
    serverEnv.supabaseUrl,
    serverEnv.supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {

          }
        },
      },
    },
  );

  return supabaseServer;
};
