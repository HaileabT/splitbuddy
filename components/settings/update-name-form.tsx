"use client";

import { useState } from "react";
import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import { useAuth } from "@/context/auth/use-auth";
import { getAuth } from "@/lib/client/supabase/auth";

interface UpdateNameFormProps {
  onSuccess?: () => void;
}

export function UpdateNameForm({ onSuccess }: UpdateNameFormProps) {
  const { user, reloadUser } = useAuth();
  const supabase = getAuth();

  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [nameError, setNameError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError("");

    if (!name.trim() || name.trim().length < 2) {
      setNameError("Name must be at least 2 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: name.trim() },
      });

      if (error) {
        setRequestError(error.message);
      } else {
        await reloadUser();
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
        type="text"
        name="name"
        label="Name"
        placeholder="Enter your name"
        value={name}
        onChange={(text) => {
          setName(text);
          if (text.trim().length >= 2) {
            setNameError("");
          }
        }}
        onBlur={(text) => {
          if (!text.trim() || text.trim().length < 2) {
            setNameError("Name must be at least 2 characters long");
          }
        }}
        error={nameError}
      />

      <div className="flex justify-end pt-2">
        <AppButton variant="primary" isLoading={isLoading}>
          Save
        </AppButton>
      </div>
    </form>
  );
}
