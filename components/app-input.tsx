import { capitalize } from "@/lib/utils/strings";

export default function AppInput({
  type,
  name,
  placeholder,
}: {
  type: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name}>{capitalize(name)}</label>
      <input
        className="text-foreground/80 border-[1px] border-foreground/20 w-full py-1 px-2 font-mono outline-none focus:outline-secondary! focus:outline-solid focus:outline-1 rounded-md"
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
      />
    </div>
  );
}
