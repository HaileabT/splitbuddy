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

  const [isLoading, setIsLoading] = useState(false);

  const createAccountMutation = accountsClient.useCreateAccount();

  const togglePasswordInputType = () => {
    setPassHiden((prev) => !prev);
  };

  const onSubmit = async () => {
    setRequestError("");
    setNextRequest("");
    setEmailInputError("");
    setNameInputError("");
    setPasswordInputError("");
    setConfirmPasswordInputError("");

    let hasError = false;

    if (name.trim().length < 2) {
      setNameInputError("Name must be at least 2 characters long");
      hasError = true;
    }
    if (!validateEmail(email)) {
      setEmailInputError("Invalid email");
      hasError = true;
    }
    if (password.length < 8) {
      setPasswordInputError("Password must be at least 8 characters long");
      hasError = true;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordInputError("Confirm password must be the same as password");
      hasError = true;
    }

    if (hasError) return;

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

    if (error) {
      console.log(error.message);
      setRequestError(error.message);
    } else {
      try {
        await createAccountMutation.mutateAsync({ name: data.user?.user_metadata.name || "", email: data.user?.email || "", id: data.user?.id || "" });
      } catch (error) {
        if (error instanceof Error) {
          setRequestError(error?.message || String(error));
        } else {
          setRequestError(String(error));
        }
      }

      await reloadUser();
      setNextRequest("Email verification link has been sent through email. Please check spam if you don't find it.");
    }

    setIsLoading(false);
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
          value={name}
          onChange={(text) => {
            setName(text);
            if (text.trim().length >= 2) {
              setNameInputError("");
            }
          }}
          error={nameInputError}
        />
        <AppInput
          type="text"
          name="email"
          label="email"
          placeholder="abebe@gmail.com"
          value={email}
          onChange={(text) => {
            setEmail(text);
            if (validateEmail(text)) {
              setEmailInputError("");
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
          value={password}
          onChange={(text) => {
            setPassword(text);
            if (text.trim().length >= 8) {
              setPasswordInputError("");
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
          value={confirmPassword}
          onChange={(text) => {
            setConfirmPassword(text);
            if (text === password) {
              setConfirmPasswordInputError("");
            }
          }}
          error={confirmPasswordInputError}
        />
      </div>
      <AppButton variant="primary" isLoading={isLoading}>
        Sign Up
      </AppButton>
    </AuthFormPage>
  );
}
