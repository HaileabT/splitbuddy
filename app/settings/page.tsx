"use client";

import AppButton from "@/components/app-button";
import AppNav from "@/components/app-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsGroupBox } from "@/components/settings/settings-group-box";
import { UpdateNameForm } from "@/components/settings/update-name-form";
import { UpdatePasswordForm } from "@/components/settings/update-password-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/auth/use-auth";
import { getAuth } from "@/lib/client/supabase/auth";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { LazyText } from "@/components/lazy-text";

export default function Settings() {
  const { user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const onLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = getAuth();
      await supabase.auth.signOut();
      window.location.reload();
    } catch {
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-background font-sans h-full">
      <header className="bg-transparent -mt-2 z-10000! w-full mx-auto h-max fixed -top-1 ">
        <AppNav />
      </header>

      <Dialog open={isNameModalOpen} onOpenChange={setIsNameModalOpen}>
        <DialogContent
          showCloseButton={true}
          className="z-100 max-w-xl w-[calc(100%-1.5rem)] max-h-[85dvh] flex flex-col gap-4 rounded-3xl sm:rounded-4xl border border-border bg-card p-4 sm:p-6 overflow-hidden"
        >
          <DialogHeader className="border-b border-border/10 pb-4">
            <DialogTitle className="text-lg font-bold">Update Name</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update your display name
            </DialogDescription>
          </DialogHeader>
          <UpdateNameForm onSuccess={() => setIsNameModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent
          showCloseButton={true}
          className="z-100 max-w-xl w-[calc(100%-1.5rem)] max-h-[85dvh] flex flex-col gap-4 rounded-3xl sm:rounded-4xl border border-border bg-card p-4 sm:p-6 overflow-hidden"
        >
          <DialogHeader className="border-b border-border/10 pb-4">
            <DialogTitle className="text-lg font-bold">Update Password</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Set a new password for your account
            </DialogDescription>
          </DialogHeader>
          <UpdatePasswordForm onSuccess={() => setIsPasswordModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <main className="flex relative min-h-full w-full flex-1 flex-col items-center gap-4 bg-background px-2 md:px-16 py-4 md:py-8 sm:items-start">
        <div className="w-full h-full bg-card border border-border rounded-4xl p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          <div className="flex flex-col gap-8">
            <SettingsGroupBox title="Account">
              <div className="flex items-center justify-between gap-4 border border-foreground/10 rounded-xl p-4">
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    <LazyText isLoading={!user} text={user?.user_metadata?.name} fallback="User" className="w-28 h-4" />
                  </p>
                </div>
                <AppButton onClick={() => setIsNameModalOpen(true)}>Update</AppButton>
              </div>

              <div className="flex items-center justify-between gap-4 border border-foreground/10 rounded-xl p-4">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground font-mono">••••••••</p>
                </div>
                <AppButton onClick={() => setIsPasswordModalOpen(true)}>Update</AppButton>
              </div>
            </SettingsGroupBox>

            <SettingsGroupBox title="Appearance">
              <div className="flex items-center justify-between gap-4 border border-foreground/10 rounded-xl p-4">
                <div>
                  <p className="font-medium">Theme</p>
                </div>
                <ThemeToggle />
              </div>
            </SettingsGroupBox>

            <SettingsGroupBox title="Session">
              <div className="flex items-center justify-between gap-4 rounded-xl p-4 border-destructive/30 border-[1px] bg-destructive/5">
                <div>
                  <p className="font-medium">Exit</p>
                </div>

                <AppButton
                  isLoading={isLoggingOut}
                  className="bg-destructive px-4! py-2! disabled:bg-destructive/30"
                  onClick={onLogout}
                >
                  <LogOut className="size-4" />
                </AppButton>
              </div>
            </SettingsGroupBox>
          </div>
        </div>
      </main>
    </div>
  );
}

