"use client";
import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import AppLink from "@/components/app-link";
import AuthFormPage from "@/components/auth/auth-page";
import { useState } from "react";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = () => {
    setIsLoading(true);
  };
  return (
    <AuthFormPage
      title="Sign In"
      onSubmit={onSubmit}
      footer={
        <p className="text-center text-foreground/50">
          If you don&apos;t have an account,{" "}
          <AppLink href="/sign-up">register</AppLink>.
        </p>
      }
    >
      <div className=" flex flex-col gap-4">
        <AppInput type="text" name="email" placeholder="email" />
        {/*<AppInput type="password" name="password" placeholder="password" />*/}
      </div>
      <AppButton variant="primary" disabled={isLoading} isLoading={isLoading}>
        Sign In
      </AppButton>
    </AuthFormPage>
  );
}
