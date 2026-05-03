import AuthCardOuterTitle from "./auth-card-outer-title";

interface AuthFormPageProps {
  children: React.ReactNode;
  title: string;
  footer?: React.ReactNode;
  onSubmit?: () => Promise<void> | void;
}

export default function AuthFormPage({
  children,
  title,
  footer,
  onSubmit,
}: AuthFormPageProps) {
  return (
    <div className="w-full h-svh grid place-items-center">
      <div className="w-full max-w-100">
        <AuthCardOuterTitle title={title} />
        <form
          className="p-4 flex flex-col gap-4 bg-card rounded-md rounded-t-none  border-foreground/20 border-[1px] border-t-none w-full"
          onSubmit={(e) => {
            e.preventDefault();
            if (onSubmit) onSubmit();
          }}
        >
          {children}
        </form>
        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </div>
  );
}
