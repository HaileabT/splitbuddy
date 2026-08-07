"use client";

import { UserBooksResponseType } from "@/lib/client/api/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils/dates";
import { DeleteTxDialog } from "./delete-tx-dialog";
import { useState } from "react";
import { Transaction } from "@/lib/server/db/schema";
import { Signiture } from "./signiture";
import { useAuth } from "@/context/auth/use-auth";
import { AppTxAmountBadge } from "./app-tx-amount-badge";

interface TransactionDialogProps {
    open?: boolean,
    onOpenChange?: (open: boolean) => void,
    book: UserBooksResponseType,
    transaction?: Transaction
}

export function TransactionDialog({ open, onOpenChange, book, transaction }: TransactionDialogProps) {
    if (!transaction) {
        return null;
    }
    const [deleteTxOpen, setDeleteTxOpen] = useState(false);
    const { account } = useAuth();

    const canDelete = account?.id === transaction.authorId || book.membership.role === "owner";
    const absAmt = Math.abs(Number(transaction.amount || "0"));

    return <div>
        <DeleteTxDialog
            open={deleteTxOpen}
            onOpenChange={setDeleteTxOpen}
            book={book}
            transaction={transaction}
            onSuccess={() => {
                setDeleteTxOpen(false);
                onOpenChange?.(false);
            }}
        />
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="z-100 max-w-xl w-[calc(100%-1.5rem)] max-h-[85dvh] flex flex-col gap-4 rounded-3xl sm:rounded-4xl border border-border/10 bg-card p-4 sm:p-6"
            >
                <DialogHeader className="border-b border-border/10 pb-4 flex flex-row justify-between items-center w-full shrink-0">
                    <div>
                        <DialogTitle asChild>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                                    {absAmt} Birr
                                </h3>
                                <AppTxAmountBadge amount={transaction.amount} role={book.membership.role} />
                            </div>
                        </DialogTitle>
                        <DialogDescription>
                            {formatDate(new Date(transaction.createdAt))}
                        </DialogDescription>
                    </div>
                    {canDelete && (
                        <div>
                            <Button
                                size="icon"
                                className="cursor-pointer bg-transparent hover:bg-destructive/10 text-destructive"
                                onClick={() => setDeleteTxOpen(true)}
                            >
                                <Trash2 />
                            </Button>
                        </div>
                    )}
                </DialogHeader>
                <div className="w-full flex-1 max-h-[55dvh] overflow-y-auto rounded-xl border border-border/10 bg-muted p-3 sm:p-4">
                    <div className="flex flex-col gap-2">
                        <p className="flex justify-between border-b border-dashed border-border/30 text-foreground/50">
                            <span>Reason</span>
                            <span className="max-w-[60%] text-right font-mono text-foreground/80">
                                {transaction.note || "No note provided"}
                            </span>
                        </p>
                        <p className="flex justify-between border-b border-dashed border-border/30 text-foreground/50">
                            <span>Type</span>
                            <span className="font-mono text-foreground/80">{transaction.type}</span>
                        </p>
                        <p className="flex justify-between border-b border-dashed border-border/30 text-foreground/50">
                            <span>Date</span>
                            <span className="font-mono text-foreground/80">
                                {formatDate(new Date(transaction.createdAt))}
                            </span>
                        </p>
                        <p className="flex justify-between border-b border-dashed border-border/30 text-foreground/50">
                            <span>Added By</span>
                            <span className="font-mono text-secondary">
                                <Signiture userId={transaction.authorId} showOwnIndicator thisAccount={account || undefined} />
                            </span>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
}