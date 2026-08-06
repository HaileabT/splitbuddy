"use client"

import { accountsClient } from "@/lib/client/api/accounts"
import { booksClient } from "@/lib/client/api/books"
import { invitationsClient } from "@/lib/client/api/invitations"
import { useEffect, useState } from "react"
import AppButton from "./app-button"
import { LazyText } from "./lazy-text"

interface InvitationDetailsProps {
    invKey: string
}

export function InvitationDetails({ invKey }: InvitationDetailsProps) {
    const { data: invitation, isLoading: isInvitationLoading } = invitationsClient.useInvitationByKey(invKey);
    const { data: book, refetch: refreshBook, isLoading: isBookLoading } = booksClient.useBook(invitation?.loanBookId || 0)
    const { data: invitor, refetch: refreshInvitor, isLoading: isInvitorLoading } = accountsClient.useAccount(invitation?.invitedByUserId || 0)

    useEffect(() => {
        refreshBook()
        refreshInvitor();
    }, [invitation])

    return <div className="flex flex-col gap-4 bg-card">
        <div className="text-xl text-foreground/70">
            You have been invited to a loan book named <span className="text-foreground font-bold"><LazyText isLoading={isBookLoading} failed={!isBookLoading && !book} text={book?.name} fallback="unknown" /></span> by  <span className="text-foreground font-bold"><LazyText isLoading={isInvitorLoading} failed={!isInvitorLoading && !invitor} text={invitor?.name} fallback="unknown" /></span>. Do you want to join?
        </div>

        <div className="self-end flex gap-4">
            <AppButton>Yes</AppButton>
            <AppButton className="bg-destructive hover:bg-destructive/70">Nah</AppButton>
        </div>
    </div>
}