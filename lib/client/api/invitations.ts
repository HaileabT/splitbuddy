import { Invitation, LoanBook } from "@/lib/server/db/schema"
import { ServerResponse } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query"

const invitationKeys = {
    many: (filters: unknown) => ["invitation", filters],
    byBook: (bookId: string) => ["invitation", bookId],
    byKey: (key: string) => ["invitation", key],
    single: (id: string) => ["invitation", id],
}

function useInvitation(id: string) {
    return useQuery<Invitation>({
        queryKey: invitationKeys.single(id),
        queryFn: async () => {
            const res = await fetch("");
            const books = await res.json();
            return books as Invitation;
        }
    })
}

function useInvitationByKey(key: string) {
    return useQuery<Invitation>({
        queryKey: invitationKeys.byKey(key),
        queryFn: async () => {
            const res = await fetch(`/api/invitations/by-key/${key}`);
            const resJSON = (await res.json()) as ServerResponse<Invitation>;
            return resJSON.data as Invitation;
        }
    })
}

function useInvitationByBook(bookId: string) {
    return useQuery<Invitation>({
        queryKey: invitationKeys.byBook(bookId),
        queryFn: async () => {
            const res = await fetch(bookId);
            const book = await res.json();
            return book;
        }
    })
}




function useAcceptInvitation(id: string) {
    return useMutation({
        mutationKey: ["cancel-invitation", id],
        mutationFn: async (data: unknown) => {

        }
    })
}


function useCancelInvitation(id: string) {
    return useMutation({
        mutationKey: ["cancel-invitation", id],
        mutationFn: async (data: unknown) => {

        }
    })
}



export const invitationsClient = { useInvitation, useInvitationByKey, useCancelInvitation, useInvitationByBook }