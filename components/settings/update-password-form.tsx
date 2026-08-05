"use client";

import { useState } from "react";
import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import { PasswordStrengthIndicator } from "@/components/password-strength";
import { getAuth } from "@/lib/client/supabase/auth";
import { validatePassword } from "@/lib/utils/strings";

interface UpdatePasswordFormProps {
  onSuccess?: () => void;
}

export function UpdatePasswordForm({ onSuccess }: UpdatePasswordFormProps) {
  const supabase = getAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError("");
    setCurrentPasswordError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let hasError = false;

    if (!currentPassword) {
      setCurrentPasswordError("Current password is required");
      hasError = true;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      hasError = true;
    }

    const { fail } = validatePassword(password);
    if (fail.length > 0) {
      setPasswordError("Password does not meet all strength requirements");
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
        current_password: currentPassword,
      })

      if (error) {
        setRequestError(error.message);
      } else {
        onSuccess?.();
      }
    } catch {
      setRequestError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-1">
      {requestError && (
        <p className="text-destructive text-sm text-center">{requestError}</p>
      )}

      <AppInput
        type="password"
        name="current-password"
        label="Current Password"
        placeholder="••••••••"
        value={currentPassword}
        onChange={(text) => {
          setCurrentPassword(text);
          if (text) {
            setCurrentPasswordError("");
          }
        }}
        onBlur={(text) => {
          if (!text) {
            setCurrentPasswordError("Current password is required");
          }
        }}
        error={currentPasswordError}
      />

      <AppInput
        type="password"
        name="new-password"
        label="New Password"
        placeholder="••••••••"
        value={password}
        onChange={(text) => {
          setPassword(text);
          if (text.length >= 8) {
            setPasswordError("");
          }
        }}
        onFocus={() => setShowPasswordCriteria(true)}
        onBlur={(text) => {
          if (!text || text.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
          }
        }}
        error={passwordError}
      />

      {showPasswordCriteria && (
        <div className="py-1">
          <PasswordStrengthIndicator password={password} />
        </div>
      )}

      <AppInput
        type="password"
        name="confirm-password"
        label="Confirm New Password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(text) => {
          setConfirmPassword(text);
          if (text === password) {
            setConfirmPasswordError("");
          }
        }}
        onBlur={(text) => {
          if (text !== password) {
            setConfirmPasswordError("Passwords do not match");
          }
        }}
        error={confirmPasswordError}
      />

      <div className="flex justify-end pt-2">
        <AppButton variant="primary" isLoading={isLoading}>
          Update Password
        </AppButton>
      </div>
    </form>
  );
}
