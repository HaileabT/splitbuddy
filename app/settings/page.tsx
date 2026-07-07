"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center bg-background font-sans h-full">
      <main className="flex relative min-h-full w-full flex-1 flex-col items-center gap-4 bg-background px-2 md:px-16 py-4 md:py-8 sm:items-start">
        <div className="w-full h-full bg-card border border-border rounded-4xl p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 border border-foreground/10 rounded-xl p-4">
              <div>
                <p className="font-medium">Theme</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between gap-4 border border-foreground/10 rounded-xl p-4">
              <div>
                <p className="font-medium">Notifications</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
