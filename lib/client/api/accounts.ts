import { Account } from "@/lib/server/db/schema"
import { ServerResponse } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query"

function useAccountByEmail(email: string) {
    return useQuery<Account>({
        queryKey: ["user-by-email"],
        queryFn: async () => {
            const res = await fetch(`/api/accounts/${encodeURIComponent(email)}`);
            const resJSON = (await res.json()) as ServerResponse<Account>;
            return resJSON.data as Account;
        }
    })
}

function useCreateAccount() {
    return useMutation({
        mutationKey: ["create-account"],
        mutationFn: async (data: { name: string, email: string, id: string }) => {
            const res = await fetch("/api/accounts", {
                method: "POST",
                body: JSON.stringify(data)
            });
            const resJSON = (await res.json()) as ServerResponse<Account>;
            return resJSON.data as Account;
        }
    })
}

function useUpdateAccount() {
    return useMutation({
        mutationKey: ["create-account"],
        mutationFn: async (data: { name: string, id: number }) => {
            const res = await fetch(`/api/accounts/${data.id}`, {
                method: "PATCH",
                body: JSON.stringify(data)
            });
            const resJSON = (await res.json()) as ServerResponse<Account>;
            return resJSON.data as Account;
        }
    })
}

function useDeleteAccount() {
    return useMutation({
        mutationKey: ['delete-account'],
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/accounts/${id}`, {
                method: "DELETE",
            });
            const resJSON = (await res.json()) as ServerResponse<Account>;
            return resJSON.data as Account;
        }
    })
}


export const accountsClient = { useAccountByEmail, useCreateAccount, useUpdateAccount, useDeleteAccount }