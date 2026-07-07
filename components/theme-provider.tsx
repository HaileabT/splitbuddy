"use client";

import { applyTheme, getStoredTheme, setTheme, type Theme } from "@/lib/theme";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    let resolved = getStoredTheme();
    if (resolved && ["light", "dark"].includes(resolved)) {
      let themeValue = resolved;
      setThemeState(resolved);
      applyTheme(themeValue);
    } else {
      setThemeState("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      let next: Theme | undefined;
      if (current === "dark") {
        next = "light";
      } else if (current === "light") {
        next = "dark";
      } else {
        next = "dark";
      }
      setTheme(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
