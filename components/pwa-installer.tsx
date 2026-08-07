"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import AppButton from "./app-button";

export function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("PWA Service Worker registered:", reg.scope))
        .catch((err) => console.error("PWA Service Worker registration failed:", err));
    }

    if (typeof window !== "undefined") {
      const isInStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as any).standalone ||
        document.referrer.includes("android-app://");
      setIsStandalone(isInStandaloneMode);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || !showInstallBanner || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-150 w-[calc(100%-2rem)] max-w-md bg-card/95 backdrop-blur-md border border-primary/30 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Download className="size-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Install SplitBuddy</p>
          <p className="text-xs text-muted-foreground">Add to home screen for fast access</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AppButton onClick={handleInstallClick} className="text-xs py-1.5 px-3">
          Install
        </AppButton>
        <button
          onClick={() => setShowInstallBanner(false)}
          className="text-muted-foreground hover:text-foreground p-1"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
