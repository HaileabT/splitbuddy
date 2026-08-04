import { User } from "@supabase/supabase-js";
import { createContext } from "react";

export const AuthContext = createContext<{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    reloadUser: () => Promise<void>;
} | null>(null);