"use client";

import { Edit2, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { useEffect, useState } from "react";
import { UserBooksResponseType } from "@/lib/client/api/types";
import { CreateTxDialog } from "./create-tx-dialog";
import { UpdateBookDialog } from "./update-book-dialog";
import { DeleteBookDialog } from "./delete-book-dialog";
import { TransactionDialog } from "./tx-dialog";
import { booksClient } from "@/lib/client/api/books";
import { LazyText } from "./lazy-text";
import { Transaction } from "@/lib/server/db/schema";
import { transactionsClient } from "@/lib/client/api/transactions";
import { useAuth } from "@/context/auth/use-auth";
import { Signiture } from "./signiture";
import { AppTxAmountBadge } from "./app-tx-amount-badge";

interface LoanBookDialogProps {
    open?: boolean,
    onOpenChange?: (open: boolean) => void,
    book: UserBooksResponseType | null,
    onUpdate?: () => void,
}

export function LoanBookDialog({ open, onOpenChange, book, onUpdate }: LoanBookDialogProps) {
    if (!book) {
        return null;
    }
    const [createTxOpen, setCreateTxOpen] = useState(false);
    const [txDetailsOpen, setTxDetailsOpen] = useState(false);
    const [transactionOpen, setTransactionOpen] = useState<Transaction | null>(null);
    const [updateBookOpen, setUpdateBookOpen] = useState(false);
    const [deleteBookOpen, setDeleteBookOpen] = useState(false);
    const { account } = useAuth();
    const [role, setRole] = useState<"member" | "owner" | null>(null);

    const { data: bookReloaded, isLoading: isBookLoading, isError: isBookFailed } = booksClient.useBook(book.id);

    const { data: transactions, isLoading: isTransactionsLoading } = transactionsClient.useTransactions({ loanBookId: book.id });

    const { data: members, isLoading: isMembersLoading, isError: isMembersFailed } = booksClient.useBookMembers(book.id);

    useEffect(() => {
        if (account && members && members.length > 0) {
            const thisMember = members.find(m => m.userId === account.id);
            if (thisMember) {
                setRole(thisMember.role)
            }
        }
    }, [members, account]);

    const rawBookAmt = Number(book.amount || "0");
    const userBookAmt = book.membership.role === "member" ? -1 * rawBookAmt : rawBookAmt;
    const isBookPositive = userBookAmt >= 0;

    return <div>
        <CreateTxDialog open={createTxOpen} onOpenChange={setCreateTxOpen} book={book} />
        <UpdateBookDialog open={updateBookOpen} onOpenChange={setUpdateBookOpen} book={book} />
        <DeleteBookDialog open={deleteBookOpen} onOpenChange={setDeleteBookOpen} book={book} onSuccess={() => { setDeleteBookOpen(false); onOpenChange?.(false); }} />

        <TransactionDialog open={txDetailsOpen} onOpenChange={setTxDetailsOpen} book={book} transaction={transactionOpen || undefined} />
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="max-w-xl w-[calc(100%-1.5rem)] max-h-[85dvh] flex flex-col gap-4 rounded-3xl sm:rounded-4xl border border-border/10 bg-card p-4 sm:p-6"
            >
                <DialogHeader className="flex-row items-start justify-between border-b border-border/10 pb-4 shrink-0">
                    <div>
                        <DialogTitle className="text-sm font-light">
                            {<LazyText className="text-lg sm:text-xl font-bold!" isLoading={isBookLoading} text={bookReloaded?.name} fallback={""} failed={isBookFailed} />} {"with "}
                            <LazyText isLoading={isMembersLoading} text={members?.find((m) => m.userId !== account?.id)?.user.name || members?.[1]?.user.name || members?.[0]?.user.name} fallback="" failed={isMembersFailed} />
                        </DialogTitle>
                        <DialogDescription>
                            {isBookPositive ? "Member owes you " : "You owe members "}
                            <LazyText
                                isLoading={isBookLoading}
                                text={
                                    <span className={`font-bold ${isBookPositive ? "text-success" : "text-destructive"}`}>
                                        {userBookAmt} Birr
                                    </span>
                                }
                                className="w-16 h-4"
                            />
                        </DialogDescription>
                    </div>
                    <div className="flex gap-1.5 sm:gap-2">
                        <Button
                            size="icon"
                            className="cursor-pointer bg-transparent hover:bg-primary/10 text-primary"
                            onClick={() => setCreateTxOpen(true)}
                        >
                            <Plus />
                        </Button>
                        {(role && role === "owner") && <Button
                            size="icon"
                            className="cursor-pointer bg-transparent hover:bg-foreground/10 text-foreground"
                            onClick={() => setUpdateBookOpen(true)}
                        >
                            <Edit2 />
                        </Button>}
                        {(role && role === "owner") && <Button
                            size="icon"
                            className="cursor-pointer bg-transparent hover:bg-destructive/10 text-destructive"
                            onClick={() => setDeleteBookOpen(true)}
                        >
                            <Trash2 />
                        </Button>}
                    </div>
                </DialogHeader>
                <div className="flex-1 max-h-[55dvh] min-h-0 w-full overflow-y-auto rounded-xl border border-border/10 bg-muted p-3 sm:p-4">
                    <h2 className="mb-1">Recent Records</h2>
                    <div className="flex flex-col gap-4">
                        {(transactions && transactions.length > 0) && transactions.map(t => {
                            const absAmt = Math.abs(Number(t.amount || "0"));

                            return (
                                <Card
                                    key={t.id}
                                    className="w-full cursor-pointer rounded-lg border border-border/10 ring-0"
                                    onClick={() => { setTransactionOpen(t); setTxDetailsOpen(true) }}
                                >
                                    <CardContent className="flex items-center justify-between p-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <AppTxAmountBadge amount={t.amount} role={book.membership.role} />
                                            <h3 className="text-2xl font-extrabold text-foreground">
                                                {absAmt} Birr
                                            </h3>
                                        </div>
                                        <div>
                                            <p>by <Signiture userId={t.authorId} showOwnIndicator thisAccount={account || undefined} /></p>
                                            <p className="text-end text-xs text-foreground/50">today</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
}