"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Theme } from "@/lib/theme";
import { Computer, LucideIcon, Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const toggleOptions: Record<
    Theme,
    {
      icon: LucideIcon;
      title: string;
    }
  > = {
    dark: {
      icon: Moon,
      title: "Dark Mode",
    },
    light: {
      icon: Sun,
      title: "Light Mode",
    },
  };

  const toggleValue = toggleOptions[theme];

  return (
    <Button variant="outline" onClick={toggleTheme} className="gap-2">
      {<toggleValue.icon />}
      {toggleValue.title}
    </Button>
  );
}
