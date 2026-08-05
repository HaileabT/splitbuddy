import { cn } from "@/lib/utils";

interface SettingsGroupBoxProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsGroupBox({
  title,
  children,
  className,
}: SettingsGroupBoxProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {title && (
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
          {title}
        </h2>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
