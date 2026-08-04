"use client";
import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import AppLink from "@/components/app-link";
import AuthFormPage from "@/components/auth/auth-page";
import { PasswordStrengthIndicator } from "@/components/password-strength";
import { useAuth } from "@/context/auth/use-auth";
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

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordInputError, setConfirmPasswordInputError] = useState("");

  const [requestError, setRequestError] = useState("");
  const searchParams = useSearchParams();
  const redirect_to = searchParams.get("redirect_to");
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async () => {
    setRequestError("");
    if(!validateEmail(email)){
      setEmailInputError("Invalid email");
      return;
    }
    if(name.trim().length < 2){
      setNameInputError("Name must be at least 2 characters long");
      return;
    }
    if(password.length < 8){
      setPasswordInputError("Password must be at least 8 characters long");
      return;
    }
    if(password !== confirmPassword){
      setConfirmPasswordInputError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    const {error, data} = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: redirect_to || undefined,
      },

    });

    console.log(data)
    if(error){
      console.log(error.message)
      setRequestError(error.message);
    }
    else{
      await reloadUser();
      if(redirect_to){
      window.location.href = redirect_to;
    }else{
      window.location.href = "/";
    }
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
        <AppInput 
        type="text" 
        name="name" 
        label="name" 
        placeholder="Abebe Kebede" 
        onChange={(text) => {
                  const isValid = text.trim() && text.trim().length >= 2;
                  if(isValid){
                    setNameInputError("");
                    setName(text)
                  }
                }}
                onBlur={(text) => {
                  const isValid = !text.trim() || text.trim().length < 2;
                  if(isValid){
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
                  if(isValid){
                    setEmailInputError("");
                    setEmail(text)
                  }
                }}
                onBlur={() => {
                  if(!validateEmail(email)){
                    setEmailInputError("Invalid email");
                  }
                }}
                error={emailInputError}
                />
                <AppInput
                  label="password"
                  name="password"
                  type="text"
                  placeholder="••••••••"
                  onChange={(text) => {
                    const isValid = text.trim() && text.trim().length >= 8;
                    if(isValid){
                      setPasswordInputError("");
                    }
                    setPassword(text)
                  }}
                  onBlur={(text) => {
                    const isValid = !text.trim() || text.trim().length < 8;
                    if(isValid){
                      setPasswordInputError("Password must be at least 8 characters long");
                    }
                  }}
                  error={passwordInputError}
                  onFocus={() => setShowPasswordCriteria(true)}
                />
              {showPasswordCriteria &&  <div>
                <PasswordStrengthIndicator password={password} />
                </div>}
                <AppInput
                type="text"
                name="confirm-password"
                  label="confirm password"
                  placeholder="••••••••"
                  onChange={(text) => {
                    const isValid = text.trim() && text.trim().length >= 8;
                    if(isValid){
                      setConfirmPasswordInputError("");
                      setConfirmPassword(text)
                    }
                  }}
                  onBlur={(text) => {
                    const isValid = !text.trim() || text.trim().length < 8;
                    if(isValid){
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
