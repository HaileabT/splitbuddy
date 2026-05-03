import { createServerClient } from "@supabase/ssr";
import { serverEnv } from "../env";
import { cookies } from "next/headers";

let auth: ReturnType<typeof createServerClient> | undefined = undefined;
export const getServerAuth = async () => {
  if (!auth) {
    const cookiesStore = await cookies();
    auth = createServerClient(serverEnv.supabaseUrl, serverEnv.supabaseKey, {
      cookies: {
        getAll: cookiesStore.getAll,
        setAll(cookiesToSet, _headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({
                name,
                value,
                domain: options.domain,
                expires: options.expires?.getTime(),
                path: options.path,
                sameSite: options.sameSite as unknown as
                  | CookieSameSite
                  | undefined,
                partitioned: options.partitioned,
              }),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    });
  }

  return auth;
};
