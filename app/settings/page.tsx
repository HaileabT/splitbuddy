"use client";

import { ThemeToggle } from "@/components/theme-toggle";

export default function Settings() {
  return (
    <div className="flex flex-col items-center justify-center bg-background font-sans h-full">
      <main className="flex flex-1 w-full min-h-full flex-col items-center py-8 px-16 gap-4 bg-background sm:items-start">
        <div className="w-full h-full bg-card rounded-4xl p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <div className="flex items-center justify-between gap-4 border border-foreground/10 rounded-xl p-4">
            <div>
              <p className="font-medium">Theme</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </main>
    </div>
  );
}
