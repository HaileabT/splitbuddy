"use client";
import { useState } from "react";
import AppButton from "./app-button";
import AppSpecialNumberInput from "./app-special-number-input";
import { AppTextarea } from "./app-textarea";
import { UserBooksResponseType } from "@/lib/client/api/types";
import { transactionsClient } from "@/lib/client/api/transactions";
import { AppTxAmountBadge } from "./app-tx-amount-badge";

interface RecordFormProps {
  onSuccess?: () => void;
  book: UserBooksResponseType
}

export function RecordForm({ onSuccess, book }: RecordFormProps) {
  const [amount, setAmount] = useState("0");
  const [amountError, setAmountError] = useState("");
  const [requestError, setRequestError] = useState("");

  const [reason, setReason] = useState("");

  const createTxMutation = transactionsClient.useCreateTransaction();
  const isCreateLoading = createTxMutation.isPending;

  const onAmountBlur = () => {
    if (!amount || amount.trim().length < 1) {
      setAmountError("amount is required to create a transaction");
      return;
    }
    if (isNaN(Number(amount.trim().replaceAll(",", "")))) {
      setAmountError("amount must be a number");
      return;
    }
  }

  const onSubmit = async () => {
    if (!amount || amount.trim().length < 1 || isNaN(Number(amount.replaceAll(",", "")))) {
      setAmountError("invalid amount");
      return;
    }

    setRequestError("");

    try {
      await createTxMutation.mutateAsync({ amount: amount.trim().replaceAll(",", ""), loanBookId: book.id, type: "parent", note: reason });
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        setRequestError(error.message || String(error));
      } else {
        setRequestError(String(error));
      }
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}>
      <div className="bg-card rounded-md flex justify-center">
        {requestError && <p className="text-destructive text-sm text-center">{requestError}</p>}
        <AppSpecialNumberInput
          value={amount}
          label={
            <span className="flex items-center gap-2">
              <span>Amount - in Birr</span>
              {parseFloat(amount || "0") !== 0 && <AppTxAmountBadge amount={amount} role={book.membership.role} />}
            </span>
          }
          onChange={(val) => {
            setAmountError("");
            setAmount(val);
          }}
          decimalPoints={2}
          error={amountError}
          onBlur={onAmountBlur}
        />
      </div>
      <AppTextarea label="Reason" placeholder="Drinks" value={reason} onChange={setReason} />
      <AppButton className="mt-4" isLoading={isCreateLoading}>Add Record</AppButton>
    </form>
  );
}
