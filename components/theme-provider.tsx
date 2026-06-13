"use client";

import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  setTheme,
  type Theme,
} from "@/lib/theme";
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
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    function applySystemTheme() {
      const currentMode = getStoredTheme() || "system";
      if (currentMode === "system") {
        setTheme("system");
      }
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    prefersDark.addEventListener("change", applySystemTheme);
    let resolved = getStoredTheme();
    if (resolved && ["light", "dark", "system"].includes(resolved)) {
      let themeValue = resolved;
      if (resolved === "system") {
        themeValue = getSystemTheme() || "dark";
      }
      setThemeState(resolved);
      applyTheme(themeValue);
    } else {
      setThemeState("system");
      setTheme("system");
    }
    return () => {
      prefersDark.removeEventListener("change", applySystemTheme);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      let next: Theme | undefined;
      if (current === "dark") {
        next = "light";
      } else if (current === "light") {
        next = "system";
      } else if (current === "system") {
        next = "dark";
      } else {
        next = "system";
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
