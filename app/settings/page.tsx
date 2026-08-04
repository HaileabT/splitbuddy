"use client";

import AppButton from "@/components/app-button";
import AppNav from "@/components/app-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { getAuth } from "@/lib/client/supabase/auth";
import { DoorOpen, LogOut } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = getAuth()
      await supabase.auth.signOut()
      window.location.reload()
    } catch {

    } finally {
      setIsLoggingOut(false)
    }
  }
  return (
    <div className="flex flex-col items-center justify-center bg-background font-sans h-full">
      <header className="bg-transparent -mt-2 z-10000! w-full mx-auto h-max fixed -top-1 ">
        <AppNav />
      </header>
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
            <div className="hidden items-center justify-between gap-4 border border-foreground/10 rounded-xl p-4">
              <div>
                <p className="font-medium">Notifications</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl p-4 border-destructive/30 border-[1px] bg-destructive/5">
              <div>
                <p className="font-medium">Exit</p>
              </div>

              <AppButton isLoading={isLoggingOut} className="bg-destructive px-4! py-2! disabled:bg-destructive/30" onClick={onLogout}>
                <LogOut className="size-4" />
              </AppButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
