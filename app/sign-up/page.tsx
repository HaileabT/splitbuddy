"use client";
import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import AppLink from "@/components/app-link";
import AuthFormPage from "@/components/auth/auth-page";
import { PasswordStrengthIndicator } from "@/components/password-strength";
import { useAuth } from "@/context/auth/use-auth";
import { accountsClient } from "@/lib/client/api/accounts";
import { getAuth } from "@/lib/client/supabase/auth";
import { validateEmail } from "@/lib/utils/strings";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const { reloadUser } = useAuth();

  const supabase = getAuth();

  const [email, setEmail] = useState("");
  const [emailInputError, setEmailInputError] = useState("");

  const [name, setName] = useState("");
  const [nameInputError, setNameInputError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordInputError, setPasswordInputError] = useState("");
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  const [passHidden, setPassHiden] = useState(true);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordInputError, setConfirmPasswordInputError] = useState("");

  const [requestError, setRequestError] = useState("");
  const [nextRequest, setNextRequest] = useState("");

  const searchParams = useSearchParams();
  const redirect_to = searchParams.get("redirect_to");

  console.log(redirect_to)
  const [isLoading, setIsLoading] = useState(false);

  const createAccountMutation = accountsClient.useCreateAccount();

  const togglePasswordInputType = () => {
    setPassHiden((prev) => !prev);
  }

  const onSubmit = async () => {
    setRequestError("");
    setNextRequest("")
    if (!validateEmail(email)) {
      setEmailInputError("Invalid email");
      return;
    }
    if (name.trim().length < 2) {
      setNameInputError("Name must be at least 2 characters long");
      return;
    }
    if (password.length < 8) {
      setPasswordInputError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordInputError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email: email,
      password: password,

      options: {

        data: {
          name: name,
        },
        emailRedirectTo: decodeURIComponent(redirect_to || ""),

      },

    });


    console.log(data)
    if (error) {
      console.log(error.message)
      setRequestError(error.message);
    }
    else {
      try {
        await createAccountMutation.mutateAsync({ name: data.user?.user_metadata.name || "", email: data.user?.email || "", id: data.user?.id || "" })
      } catch (error) {
        if (error instanceof Error) {
          setRequestError(error?.message || String(error))

        } else {
          setRequestError(String(error))
        }
      }

      await reloadUser();
      setNextRequest("Email verification link has been sent through email. Please check spam if you don't find it.")
    }

    setIsLoading(false)
  };
  return (
    <AuthFormPage
      title="Register"
      onSubmit={onSubmit}
      footer={
        <p className="text-center text-foreground/50">
          If you already have an account,{" "}
          <AppLink href="/sign-in">sign in here</AppLink>.
        </p>
      }
    >
      <div className=" flex flex-col gap-5!">
        {requestError && <p className="text-destructive text-sm text-center">{requestError}</p>}
        {nextRequest && <p className="text-success text-sm text-center">{nextRequest}</p>}
        <AppInput
          type="text"
          name="name"
          label="name"
          placeholder="Abebe Kebede"
          onChange={(text) => {
            const isValid = text.trim() && text.trim().length >= 2;
            if (isValid) {
              setNameInputError("");
              setName(text)
            }
          }}
          onBlur={(text) => {
            const isValid = !text.trim() || text.trim().length < 2;
            if (isValid) {
              setNameInputError("Name must be at least 2 characters long");
            }
          }}
          error={nameInputError}
        />
        <AppInput
          type="text"
          name="email"
          label="email"
          placeholder="abebe@gmail.com"
          onChange={(text) => {
            const isValid = validateEmail(text);
            if (isValid) {
              setEmailInputError("");
              setEmail(text)
            }
          }}
          onBlur={() => {
            if (!validateEmail(email)) {
              setEmailInputError("Invalid email");
            }
          }}
          error={emailInputError}
        />
        <AppInput
          label="password"
          name="password"
          type={passHidden ? "password" : "text"}
          hide={passHidden}
          showHiddenToggle
          onShowHiddenToggleClick={togglePasswordInputType}
          placeholder="••••••••"
          onChange={(text) => {
            const isValid = text.trim() && text.trim().length >= 8;
            if (isValid) {
              setPasswordInputError("");
            }
            setPassword(text)
          }}
          onBlur={(text) => {
            const isValid = !text.trim() || text.trim().length < 8;
            if (isValid) {
              setPasswordInputError("Password must be at least 8 characters long");
            }
          }}
          error={passwordInputError}
          onFocus={() => setShowPasswordCriteria(true)}
        />
        {showPasswordCriteria && <div>
          <PasswordStrengthIndicator password={password} />
        </div>}
        <AppInput
          type={passHidden ? "password" : "text"}
          hide={passHidden}
          showHiddenToggle
          onShowHiddenToggleClick={togglePasswordInputType}
          name="confirm-password"
          label="confirm password"
          placeholder="••••••••"
          onChange={(text) => {
            const isValid = text.trim() && text.trim().length >= 8;
            if (isValid) {
              setConfirmPasswordInputError("");
              setConfirmPassword(text)
            }
          }}
          onBlur={(text) => {
            const isValid = !text.trim() || text.trim().length < 8;
            if (isValid) {
              setConfirmPasswordInputError("Confirm password must be the same as password");
            }
          }}
          error={confirmPasswordInputError}
        />
        {/*<AppInput type="password" name="password" placeholder="password" />*/}
      </div>
      <AppButton variant="primary" isLoading={isLoading}>
        Sign Up
      </AppButton>
    </AuthFormPage>
  );
}
