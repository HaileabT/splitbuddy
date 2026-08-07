import { Account } from "@/lib/server/db/schema";
import { User } from "@supabase/supabase-js";
import { createContext } from "react";

export const AuthContext = createContext<{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    reloadUser: () => Promise<void>;
    reloadAccount: () => Promise<void>;
    account: Account & { amount?: number } | null;
} | null>(null);