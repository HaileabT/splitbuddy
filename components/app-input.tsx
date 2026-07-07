import { capitalize } from "@/lib/utils/strings";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

export default function AppInput({
  type,
  name,
  className,
  label,
  boxClassName,
  placeholder,
}: {
  type: string;
  name: string;
  className?: string;
  label?: string;
  boxClassName?: string;
  placeholder: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1 ", boxClassName)}>
      {label && (
        <Label htmlFor={name} className=" top-full right-0 mb-3">
          {capitalize(label || "", true)}
        </Label>
      )}
      <Input
        className={cn(
          "text-foreground/80 text-2xl! border border-foreground/20 w-full py-10! px-4! font-mono outline-none focus:outline-secondary! focus:outline-solid focus:outline-1 rounded-md",
          className,
        )}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
      />
    </div>
  );
}
