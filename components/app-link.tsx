import Link from "next/link";

export interface AppLinkProps {
  children: React.ReactNode;
  href: string;
}

export default function AppLink({ children, href }: AppLinkProps) {
  return (
    <Link className="text-primary hover:underline" href={href}>
      {children}
    </Link>
  );
}
