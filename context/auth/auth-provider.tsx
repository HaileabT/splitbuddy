"use client";

import { getAuth } from "@/lib/client/supabase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { accountsClient } from "@/lib/client/api/accounts";

const PUBLIC_PATHS = ["/", "/landing", "/sign-in", "/sign-up"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const supabase = getAuth();

  const { data: account, refetch: refetchAccount } = accountsClient.useAccountByEmail(user?.email || "", true);

  const reloadAccount = async () => {
    await refetchAccount();
  };

  useEffect(() => {
    const checkSession = async () => {
      const res = await supabase.auth.getSession();
      const { data: session } = res;
      if (session.session) {
        setUser(session.session.user);
      } else {
        if (!PUBLIC_PATHS.some((path) => path === pathname || (path !== "/" && pathname.startsWith(path)))) {
          router.push("/landing");
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const reloadUser = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      setUser(session.session.user);
    } else {
      if (!PUBLIC_PATHS.some((path) => path === pathname || (path !== "/" && pathname.startsWith(path)))) {
        router.push("/landing");
      }
    }
  };

  if (isLoading) {
    return <div className="w-full h-full grid place-items-center bg-background!"><Loader2 className="animate-spin" /></div>;
  }

  if (!account && !user) {
    return <div className="w-full h-full grid place-items-center bg-background!"><Loader2 className="animate-spin" /></div>
  }


  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, reloadUser, account: account || null, reloadAccount }}>
      {children}
    </AuthContext.Provider>
  );
}