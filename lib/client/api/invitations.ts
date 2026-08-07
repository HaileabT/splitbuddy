import { Invitation } from "@/lib/server/db/schema";
import { ServerResponse } from "@/lib/types";
import { getDataFromResponseOrThrow } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loanBookKeys } from "./books";

export const invitationKeys = {
    many: (filters?: unknown) => ["invitations", filters || {}],
    byBook: (bookId: number) => ["invitations", "book", bookId],
    byKey: (key: string) => ["invitations", "key", key],
    single: (id: number) => ["invitations", id],
};

interface UseInvitationsFilters {
    loanBookId?: number;
    invitedByUserId?: number;
    invitedUserEmail?: string;
    status?: "pending" | "cancelled" | "accepted";
}

function useInvitations(filters?: UseInvitationsFilters) {
    return useQuery<Invitation[]>({
        queryKey: invitationKeys.many(filters),
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.loanBookId) params.append("loanBookId", String(filters.loanBookId));
            if (filters?.invitedByUserId) params.append("invitedByUserId", String(filters.invitedByUserId));
            if (filters?.invitedUserEmail) params.append("invitedUserEmail", filters.invitedUserEmail);
            if (filters?.status) params.append("status", filters.status);

            const queryString = params.toString();
            const res = await fetch(`/api/invitations${queryString ? `?${queryString}` : ""}`);
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Invitation[]>(resJSON);
        },
    });
}

function useInvitation(id: number) {
    return useQuery<Invitation>({
        queryKey: invitationKeys.single(id),
        enabled: Boolean(id),
        queryFn: async () => {
            const res = await fetch(`/api/invitations/${id}`);
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Invitation>(resJSON);
        },
    });
}

function useInvitationByKey(key: string) {
    return useQuery<Invitation>({
        queryKey: invitationKeys.byKey(key),
        enabled: Boolean(key),
        queryFn: async () => {
            const res = await fetch(`/api/invitations/by-key/${key}`);
            const resJSON = (await res.json()) as ServerResponse<Invitation>;
            return getDataFromResponseOrThrow(resJSON);
        },
    });
}

function useInvitationByBook(bookId: number) {
    return useQuery<Invitation[]>({
        queryKey: invitationKeys.byBook(bookId),
        enabled: Boolean(bookId),
        queryFn: async () => {
            const res = await fetch(`/api/invitations?loanBookId=${bookId}`);
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Invitation[]>(resJSON);
        },
    });
}

function useCreateInvitation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-invitation"],
        mutationFn: async (data: { loanBookId: number; invitedUserEmail: string }) => {
            const res = await fetch("/api/invitations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Invitation>(resJSON);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: invitationKeys.byBook(variables.loanBookId) });
            queryClient.invalidateQueries({ queryKey: invitationKeys.many() });
        },
    });
}

function useAcceptInvitation(key: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["accept-invitation", key],
        mutationFn: async () => {
            const res = await fetch(`/api/invitations/by-key/accept`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });
            const resJSON = (await res.json()) as ServerResponse<Invitation>;
            return getDataFromResponseOrThrow(resJSON);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: loanBookKeys.many({}),
            });
            queryClient.invalidateQueries({
                queryKey: invitationKeys.byKey(key),
            });
        },
    });
}

function useCancelInvitation(key: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["cancel-invitation", key],
        mutationFn: async () => {
            const res = await fetch(`/api/invitations/by-key/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key }),
            });
            const resJSON = (await res.json()) as ServerResponse<Invitation>;
            return getDataFromResponseOrThrow(resJSON);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: invitationKeys.byKey(key),
            });
            queryClient.invalidateQueries({
                queryKey: invitationKeys.many(),
            });
        },
    });
}

export const invitationsClient = {
    useInvitations,
    useInvitation,
    useInvitationByKey,
    useInvitationByBook,
    useCreateInvitation,
    useAcceptInvitation,
    useCancelInvitation,
};