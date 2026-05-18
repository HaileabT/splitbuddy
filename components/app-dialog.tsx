"use client";
import { useEffect, useState } from "react";

interface AppDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  headerActions?: React.ReactNode;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  body?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AppDialog({
  open: openProp,
  onOpenChange,
  trigger,
  title,
  subtitle,
  headerActions,
  body,
  footer,
  children,
  className,
}: AppDialogProps) {
  const [open, setOpen] = useState(() =>
    typeof openProp === "boolean" ? openProp : false,
  );

  const onClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    setOpen(openProp || false);
  }, [openProp]);
  const onOpen = () => {
    if (onOpenChange) {
      onOpenChange(true);
    } else {
      setOpen(true);
    }
  };
  return (
    <div>
      {trigger && <div onClick={onOpen}>{trigger}</div>}
      {open && (
        <div
          className={`fixed grid place-items-center w-svw h-svh top-0 left-0 ${className}`}
        >
          <div
            className="backdrop-blur-lg w-full h-full bg-background/40 absolute top-0 left-0 z-[1]"
            onClick={onClose}
          ></div>

          <div className="w-[calc(100%-1rem)] max-w-xl z-10 bg-card p-6 border-[1px] border-foreground/10 rounded-4xl flex flex-col gap-4">
            <div className="border-b-[1px] border-foreground/10 pb-4 h-max flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{title || "App Dialog"}</h2>
                <p className="text-sm text-foreground/70">
                  {subtitle || "This is the app dialog"}
                </p>
              </div>
              {headerActions && <div>{headerActions}</div>}
            </div>
            <div className="p-4 w-full h-full max-h-192 overflow-y-auto border-[1px] border-foreground/10 bg-background rounded-xl">
              {children ? (
                children
              ) : body ? (
                body
              ) : (
                <div className="h-full">Empty Space</div>
              )}
            </div>

            {footer && <div className="p-4">{footer}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
