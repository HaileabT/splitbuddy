import { Account } from "@/lib/server/db/schema";
import { ServerResponse } from "@/lib/types";
import { getDataFromResponseOrThrow } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const accountKeys = {
    all: ["accounts"],
    byEmail: (email: string) => ["accounts", "email", email],
    single: (id: number) => ["accounts", id],
};

function useAccountByEmail(email: string, thisUser?: boolean) {
    return useQuery<Account & { amount: number }>({
        queryKey: thisUser ? accountKeys.byEmail("this") : accountKeys.byEmail(email),
        enabled: Boolean(email),
        queryFn: async () => {
            const res = await fetch(`/api/accounts/by-email/${encodeURIComponent(email)}`);
            const resJSON = (await res.json()) as ServerResponse<Account & { amount: number }>;
            return getDataFromResponseOrThrow(resJSON);
        },
    });
}

function useAccount(id: number) {
    return useQuery<Account & { amount: number }>({
        queryKey: accountKeys.single(id),
        enabled: Boolean(id),
        queryFn: async () => {
            const res = await fetch(`/api/accounts/${id}`);
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Account & { amount: number }>(resJSON);
        },
    });
}

function useAccounts() {
    return useQuery<Account[]>({
        queryKey: accountKeys.all,
        queryFn: async () => {
            const res = await fetch("/api/accounts");
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Account[]>(resJSON);
        },
    });
}

function useCreateAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-account"],
        mutationFn: async (data: { name: string; email: string; id: string }) => {
            const res = await fetch("/api/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Account>(resJSON);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
    });
}

function useUpdateAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-account"],
        mutationFn: async (data: { name: string; id: number }) => {
            const res = await fetch(`/api/accounts/${data.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Account>(resJSON);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: accountKeys.single(variables.id) });
            queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
    });
}

function useDeleteAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-account"],
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/accounts/${id}`, {
                method: "DELETE",
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Account>(resJSON);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: accountKeys.all });
        },
    });
}

export const accountsClient = {
    useAccountByEmail,
    useAccount,
    useAccounts,
    useCreateAccount,
    useUpdateAccount,
    useDeleteAccount,
};