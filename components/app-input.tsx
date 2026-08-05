import { capitalize } from "@/lib/utils/strings";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Eye, EyeClosed } from "lucide-react";

export default function AppInput({
  type,
  name,
  className,
  label,
  boxClassName,
  placeholder,
  onBlur,
  onChange,
  value,
  hide,
  showHiddenToggle,
  onShowHiddenToggleClick,
  required,
  disabled,
  onFocus,
  error,
}: {
  type: string;
  name: string;
  className?: string;
  onChange?: (text: string) => void;
  onBlur?: (text: string) => void;
  onFocus?: () => void;
  hide?: boolean,
  showHiddenToggle?: boolean,
  onShowHiddenToggleClick?: () => void;
  label?: string;
  boxClassName?: string;
  placeholder: string;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1 ", boxClassName)}>
      {label && (
        <Label htmlFor={name} className=" top-full right-0 mb-2">
          {capitalize(label || "", true)}
        </Label>
      )}
      <div className="relative w-full">
        <Input
          className={cn(
            "text-foreground/80 text-base! border border-foreground/20 w-full py-2! px-2! font-mono outline-none focus:outline-secondary! focus:outline-solid focus:outline-1 rounded-md",
            className,
          )}
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          onFocus={onFocus}
          value={value}
          required={required}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={(e) => onBlur?.(e.target.value)}
        />
        {showHiddenToggle && <Button form="none" className="absolute right-0 bg-transparent! ring-transparent! border-none" variant="outline" onClick={(e) => { e.stopPropagation(); onShowHiddenToggleClick?.() }}>
          {!hide ? <Eye /> : <EyeClosed />}
        </Button>}
      </div>
      {error && (
        <p className="text-destructive text-sm self-end font-mono text-xs">{error}</p>
      )}
    </div>
  );
}
