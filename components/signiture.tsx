"use client";

import { accountsClient } from "@/lib/client/api/accounts";
import { booksClient } from "@/lib/client/api/books";
import { Account } from "@/lib/server/db/schema";
import { LazyText } from "./lazy-text";
import { truncate } from "@/lib/utils/strings";

interface SignitureProps {
    userId: number;
    showOwnIndicator?: boolean;
    thisAccount?: Account;
}

export function Signiture({ userId, thisAccount, showOwnIndicator }: SignitureProps) {
    const { data: account, isLoading: isAccountLoading } = accountsClient.useAccount(userId);

    if (isAccountLoading || !account) {
        return <LazyText isLoading={true} text="" className="w-16 h-[1em]" />;
    }

    if (showOwnIndicator && thisAccount && account.email === thisAccount.email) {
        return <span title={account.email} className="font-mono">you</span>;
    } else {
        return <span title={account?.email} className="font-mono">{account.name}</span>;
    }
}

interface BookOwnerSignitureProps {
    bookId: number;
    showOwnIndicator?: boolean;
    account?: Account;
}

export function BookOwnerSigniture({ bookId, showOwnIndicator, account }: BookOwnerSignitureProps) {
    const { data: owner, isLoading } = booksClient.useBookOwner(bookId);

    if (isLoading || !owner) {
        return <LazyText isLoading={true} text="" className="w-20 h-[1em]" />;
    }

    if (showOwnIndicator && account && owner.email === account.email) {
        return <span title={owner?.email} className="font-mono">yours</span>;
    } else {
        return <span title={owner?.email} className="font-mono">{truncate(owner.name || "", 10)}'s</span>;
    }
}