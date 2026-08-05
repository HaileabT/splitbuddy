"use client";
import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import AppLink from "@/components/app-link";
import AuthFormPage from "@/components/auth/auth-page";
import { getAuth } from "@/lib/client/supabase/auth";
import { useSearchParams } from "next/navigation";
import { useState } from "react";


export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [passHidden, setPassHiden] = useState(true);
  const [requestError, setRequestError] = useState("");
  const supabase = getAuth();

  const searchParams = useSearchParams();
  const redirect_to = searchParams.get("redirect_to");
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordInputType = () => {
    setPassHiden((prev) => !prev);
  }

  const onSubmit = async () => {
    setRequestError("")
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password,
    });
    if (error) {
      console.log(error)
      setRequestError(error.message || String(error))
    }
    else {
      if (redirect_to) {
        window.location.href = redirect_to;
      } else {
        window.location.href = "/";
      }
    }
    setIsLoading(false);
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
      <div className=" flex flex-col gap-6">
        {requestError && <p className="text-destructive text-sm text-center">{String(requestError)}</p>}
        <AppInput
          type="text"
          name="email"
          label="email"
          placeholder="abebe@gmail.com"
          onChange={setEmail}
        // error={error}
        />

        <AppInput
          type={passHidden ? "password" : "text"}
          hide={passHidden}
          showHiddenToggle={true}
          onShowHiddenToggleClick={togglePasswordInputType}
          label="password"
          name="password"
          placeholder="password"
          onChange={setPassword}
        // error={error}
        />
      </div>
      <AppButton variant="primary" disabled={isLoading} isLoading={isLoading}>
        Sign In
      </AppButton>
    </AuthFormPage>
  );
}
