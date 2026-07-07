import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface AppTextareaProps {
  className?: string;
  boxClassName?: string;
  labelClassName?: string;
  placeholder?: string;
  label?: string;
  onChange?: (str: string) => void;
  value?: string;
  defaultValue?: string;
  onBlur?: (str: string) => void;
}

export function AppTextarea({
  className,
  boxClassName,
  labelClassName,
  placeholder,
  label,
  value,
  defaultValue,
  onChange,
  onBlur,
}: AppTextareaProps) {
  return (
    <div className={cn("", boxClassName)}>
      {label && (
        <Label className={cn(" top-full right-0 my-3", labelClassName)}>
          {label}
        </Label>
      )}
      <Textarea
        rows={2}
        onChange={(e) => onChange?.(e.target.value)}
        value={value}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onBlur={(e) => onBlur?.(e.target.value)}
        className={cn(
          `font-mono leading-6
        bg-card!  bg-[radial-gradient(circle,var(--dim-foreground)_1px,transparent_1px)] bg-[length:1rem_1rem]`,
          className,
        )}
      ></Textarea>
    </div>
  );
}
