import Link from "next/link";

export interface AppLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export default function AppLink({ children, href, className }: AppLinkProps) {
  return (
    <Link className={`text-primary hover:underline ${className}`} href={href}>
      {children}
    </Link>
  );
}
