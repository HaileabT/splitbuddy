import AppName from "../app-name";

interface AuthCardOuterTitleProps {
  title: string;
}

export default function AuthCardOuterTitle({ title }: AuthCardOuterTitleProps) {
  return (
    <div className="bg-linear-to-r from-secondary via-secondary to-primary p-4 rounded-md rounded-b-none text-background">
      <h1>
        {title} | <AppName />
      </h1>
    </div>
  );
}
