export const THEME_STORAGE_KEY = "splitbuddy-theme";

export type Theme = "light" | "dark";

// export function getSystemTheme(): Theme {
//   if (typeof window === "undefined") {
//     return "light";
//   }

//   return window.matchMedia("(prefers-color-scheme: dark)").matches
//     ? "dark"
//     : "light";
// }

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored as Theme | null;
}

export function resolveTheme(): Theme {
  return getStoredTheme() ?? "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

export const themeInitScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)}catch(e){}})();`;
