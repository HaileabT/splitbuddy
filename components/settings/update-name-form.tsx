"use client";

import { useState } from "react";
import AppButton from "@/components/app-button";
import AppInput from "@/components/app-input";
import { useAuth } from "@/context/auth/use-auth";
import { getAuth } from "@/lib/client/supabase/auth";
import { accountsClient } from "@/lib/client/api/accounts";

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

  const updateAccountMutation = accountsClient.useUpdateAccount();

  const { data: account, isLoading: isAccLoading } = accountsClient.useAccountByEmail(user?.email || "")

  const handleSubmit = async (e: React.FormEvent) => {
    if (isAccLoading) {
      setRequestError("account being loaded. please try again after a few seconds");
      return;
    }
    e.preventDefault();
    setRequestError("");

    if (!user?.id) {
      setRequestError("please login first")
      return;
    }

    if (!account) {
      setRequestError("internal server error")
      return;
    }

    const oldName = user.user_metadata.name as string || "";
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
        try {
          await updateAccountMutation.mutateAsync({ id: account.id, name: name.trim() });
        } catch (error) {
          if (error instanceof Error) {
            setRequestError(error?.message || String(error))
          } else {
            setRequestError(String(error))
          }

          await supabase.auth.updateUser({
            data: {
              name: oldName
            }
          })
        }

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
