"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
interface AppButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingIndicator?: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
}

export default function AppButton({
  children,
  className,
  isLoading,
  onClick,
  variant,
  loadingIndicator,
  disabled,
}: AppButtonProps) {
  isLoading = typeof isLoading === "undefined" ? false : isLoading;
  disabled = typeof disabled === "undefined" ? false : disabled;
  return (
    <button
      className={cn(
        `relative rounded-md disabled:bg-secondary/30 disabled:text-foreground/60 bg-primary text-background w-max py-1 px-4 cursor-pointer font-mono`,
        `${className} ${variant === "primary" ? "primary" : "secondary"}}`,
      )}
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading
        ? loadingIndicator || (
            <Loader2 className="absolute  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-6 h-6 aspect-square animate-spin" />
          )
        : null}
      <div
        className={`${isLoading ? "opacity-70 blur-[2px]" : ""} text-background`}
      >
        {children}
      </div>
    </button>
  );
}
