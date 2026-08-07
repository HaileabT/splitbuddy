"use client"
import { useState } from "react";
import { UserBooksResponseType } from "@/lib/client/api/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import AppButton from "./app-button";
import { Transaction } from "@/lib/server/db/schema";
import { transactionsClient } from "@/lib/client/api/transactions";
import { booksClient } from "@/lib/client/api/books";
import { LazyText } from "./lazy-text";

interface DeleteTxDialogProps {
    open?: boolean,
    onOpenChange?: (open: boolean) => void,
    book: UserBooksResponseType,
    transaction: Transaction,
    onSuccess?: () => void;
}

export function DeleteTxDialog({ open, onOpenChange, book, transaction, onSuccess }: DeleteTxDialogProps) {
    const [requestError, setRequestError] = useState("");
    const deleteTxMutation = transactionsClient.useDeleteTransaction();
    const isLoading = deleteTxMutation.isPending;

    const { data: members, isLoading: isMembersLoading, isError: isMembersFailed } = booksClient.useBookMembers(book.id);

    const onDelete = async () => {
        setRequestError("");
        try {
            await deleteTxMutation.mutateAsync({ id: transaction.id, loanBookId: book.id });
            onOpenChange?.(false);
            onSuccess?.();
        } catch (error) {
            if (error instanceof Error) {
                setRequestError(error.message || String(error));
            } else {
                setRequestError(String(error));
            }
        }
    };

    const otherMemberName = members && members.length > 0 ? members[0]?.user?.name : "";

    return <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
            showCloseButton={false}
            className="z-100 max-w-xl gap-4 rounded-4xl border border-border bg-card p-0 sm:max-w-xl overflow-hidden"
        >
            <DialogHeader className="border-b border-border/10 p-6 pb-4 bg-destructive text-white">
                <DialogTitle className="text-lg font-bold">
                    Are you sure?
                </DialogTitle>
                <DialogDescription className="sr-only">
                    This action is irreversible and you cannot undo.
                </DialogDescription>
            </DialogHeader>
            <div className="max-h-192 w-full overflow-y-auto rounded-xl border border-border/10 p-6 pt-2 flex flex-col gap-4">
                {requestError && <p className="text-destructive text-sm font-mono">{requestError}</p>}
                <strong className="text-lg font-light">
                    This action will remove this transaction from loan book name{" "}
                    <span className="font-bold">{book.name}</span> with{" "}
                    <span className="font-bold">
                        <LazyText isLoading={isMembersLoading} text={otherMemberName} fallback="" failed={isMembersFailed} />
                    </span> amount{" "}
                    <span className="font-bold">{transaction.amount} Birr</span>. Are you sure?
                </strong>

                <div className="flex gap-4">
                    <AppButton className="cursor-pointer" disabled={isLoading} onClick={() => onOpenChange?.(false)}>Nah, Let's Keep it</AppButton>
                    <AppButton className="bg-muted! hover:bg-destructive! disabled:bg-destructive group" isLoading={isLoading} disabled={isLoading} onClick={onDelete}>
                        <span className="text-destructive group-hover:text-muted">
                            Remove
                        </span>
                    </AppButton>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}