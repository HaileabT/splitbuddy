"use client";
import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import AppLink from "@/components/app-link";
import AuthFormPage from "@/components/auth/auth-page";
import { useState } from "react";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = () => {
    setIsLoading(true);
  };
  return (
    <AuthFormPage
      title="Register"
      onSubmit={onSubmit}
      footer={
        <p className="text-center text-foreground/50">
          If you already have an account,{" "}
          <AppLink href="/auth/sign-in">sign in here</AppLink>.
        </p>
      }
    >
      <div className=" flex flex-col gap-4">
        <AppInput type="text" name="email" placeholder="email" />
        {/*<AppInput type="password" name="password" placeholder="password" />*/}
      </div>
      <AppButton variant="primary" isLoading={isLoading}>
        Sign Up
      </AppButton>
    </AuthFormPage>
  );
}
