"use client";

import { accountsClient } from "@/lib/client/api/accounts";
import { booksClient } from "@/lib/client/api/books";
import { Account } from "@/lib/server/db/schema";

interface SignitureProps {
    userId: number,
    showOwnIndicator?: boolean,
    thisAccount?: Account,
}

export function Signiture({ userId, thisAccount, showOwnIndicator }: SignitureProps) {
    const { data: account, isLoading: isAccountLoading } = accountsClient.useAccount(userId);
    if (!account || isAccountLoading) {
        return <span className="w-20 h-6 bg-foreground/40"></span>
    }

    if (showOwnIndicator && thisAccount && account.email === thisAccount.email) {
        return <span title={account.email} className="font-mono">you</span>
    } else {
        return <span title={account?.email} className="font-mono">{account.name}</span>
    }
}

interface BookOwnerSignitureProps {
    bookId: number,
    showOwnIndicator?: boolean,
    account?: Account,
}


export function BookOwnerSigniture({ bookId, showOwnIndicator, account }: BookOwnerSignitureProps) {
    const { data: owner, isLoading } = booksClient.useBookOwner(bookId);
    if (!owner || isLoading) {
        return <span className="w-20 h-6 bg-foreground/40"></span>
    }

    if (showOwnIndicator && account && owner.email === account.email) {
        return <span title={owner?.email} className="font-mono">your book</span>
    } else {
        return <span title={owner?.email} className="font-mono">{owner.name}'s book</span>

    }
}