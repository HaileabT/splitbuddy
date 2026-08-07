"use client";

import { getAuth } from "@/lib/client/supabase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { Account } from "@/lib/server/db/schema";
import { accountsClient } from "@/lib/client/api/accounts";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const supabase = getAuth();

  const { data: account, refetch: refetchAccount } = accountsClient.useAccountByEmail(user?.email || "doesntexist", true)

  useEffect(() => {
    reloadAccount();
  }, [user])

  const reloadAccount = async () => {
    await refetchAccount()
  }

  useEffect(() => {
    const checkSession = async () => {
      let token_hash = searchParams.get("token_hash")
      if (!token_hash && typeof window !== "undefined") {
        token_hash = window.location.hash;
      }
      const res = await supabase.auth.getSession();
      const { data: session } = res;
      if (session.session) {
        setUser(session.session.user);
      } else {
        if (window.location.pathname !== "/sign-in" && window.location.pathname !== "/sign-up") {
          router.push("/sign-in");
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, [supabase, router, searchParams]);

  const reloadUser = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      setUser(session.session.user);
    } else {
      if (window.location.pathname !== "/sign-in" && window.location.pathname !== "/sign-up") {
        router.push("/sign-in");
      }
    }
  };

  if (isLoading) {
    return <div className="w-full h-full grid place-items-center bg-background!"><Loader2 className="animate-spin" /></div>;
  }


  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, reloadUser, account: account || null, reloadAccount }}>
      {children}
    </AuthContext.Provider>
  );
}