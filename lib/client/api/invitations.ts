import { Invitation, LoanBook } from "@/lib/server/db/schema"
import { ServerResponse } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { loanBookKeys } from "./books";

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




function useAcceptInvitation(key: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["accept-invitation", key],
        mutationFn: async () => {
            const res = await fetch(`/api/invitations/by-key/accept`, { method: "POST", body: JSON.stringify({ key }) });
            const resJSON = (await res.json()) as ServerResponse<Invitation>;
            return resJSON.data as Invitation;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: loanBookKeys.many({})
            })
        }
    })
}


function useCancelInvitation(key: string) {
    return useMutation({
        mutationKey: ["cancel-invitation", key],
        mutationFn: async () => {
            const res = await fetch(`/api/invitations/by-key/cancel`, { method: "POST", body: JSON.stringify({ key }) });
            const resJSON = (await res.json()) as ServerResponse<Invitation>;
            return resJSON.data as Invitation;
        }
    })
}



export const invitationsClient = { useInvitation, useInvitationByKey, useCancelInvitation, useAcceptInvitation, useInvitationByBook }