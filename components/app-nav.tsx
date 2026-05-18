"use client";

import { usePathname } from "next/navigation";
import AppLink from "@/components/app-link";
import { Home, Settings } from "lucide-react";

export default function AppNav() {
  const pathname = usePathname();

  const active = pathname.includes("firebase") ? "/" : pathname;

  return (
    <div className="w-max mx-auto bg-card border border-foreground/10 p-4 rounded-xl flex gap-4">
      <AppLink
        href="/"
        className={
          "font-bold text-2xl " +
          (active === "/" ? "text-primary!" : "text-foreground/50!")
        }
      >
        <Home />
      </AppLink>

      <AppLink
        href="/settings"
        className={
          "font-bold text-2xl " +
          (active === "/settings" ? "text-primary!" : "text-foreground/50!")
        }
      >
        <Settings />
      </AppLink>
    </div>
  );
}
