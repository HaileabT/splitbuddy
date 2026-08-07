import { Transaction, TransactionCreate } from "@/lib/server/db/schema";
import { getDataFromResponseOrThrow } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loanBookKeys } from "./books";
import { accountKeys } from "./accounts";

export const transactionKeys = {
    many: (filters?: unknown) => ["transactions", filters || {}],
    single: (id: number) => ["transactions", id],
};

interface UseTransactionsFilters {
    loanBookId?: number;
    authorId?: number;
    type?: string;
    parentId?: number;
}

function useTransactions(filters?: UseTransactionsFilters) {
    return useQuery<Transaction[]>({
        queryKey: transactionKeys.many(filters),
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.loanBookId) params.append("loanBookId", String(filters.loanBookId));
            if (filters?.authorId) params.append("authorId", String(filters.authorId));
            if (filters?.type) params.append("type", filters.type);
            if (filters?.parentId) params.append("parentId", String(filters.parentId));

            const queryString = params.toString();
            const res = await fetch(`/api/transactions${queryString ? `?${queryString}` : ""}`);
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Transaction[]>(resJSON);
        },
    });
}

function useTransaction(id: number) {
    return useQuery<Transaction>({
        queryKey: transactionKeys.single(id),
        enabled: Boolean(id),
        queryFn: async () => {
            const res = await fetch(`/api/transactions/${id}`);
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Transaction>(resJSON);
        },
    });
}

function useCreateTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-transaction"],
        mutationFn: async (data: Omit<TransactionCreate, "authorId">) => {
            const res = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Transaction>(resJSON);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.many() });
            queryClient.invalidateQueries({ queryKey: loanBookKeys.transactions(variables.loanBookId) });
            queryClient.invalidateQueries({ queryKey: loanBookKeys.many() });
            queryClient.invalidateQueries({queryKey: accountKeys.byEmail("this")})
        },
    });
}

function useUpdateTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-transaction"],
        mutationFn: async (data: { id: number; loanBookId?: number; details: Partial<Omit<TransactionCreate, "id" | "loanBookId">> }) => {
            const res = await fetch(`/api/transactions/${data.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data.details),
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Transaction>(resJSON);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.single(variables.id) });
            queryClient.invalidateQueries({ queryKey: transactionKeys.many() });
            if (variables.loanBookId) {
                queryClient.invalidateQueries({ queryKey: loanBookKeys.transactions(variables.loanBookId) });
            }
            queryClient.invalidateQueries({ queryKey: loanBookKeys.many() });
            queryClient.invalidateQueries({queryKey: accountKeys.byEmail("this")})
        },
    });
}

function useDeleteTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-transaction"],
        mutationFn: async (data: { id: number; loanBookId?: number }) => {
            const res = await fetch(`/api/transactions/${data.id}`, {
                method: "DELETE",
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Transaction>(resJSON);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.many() });
            if (variables.loanBookId) {
                queryClient.invalidateQueries({ queryKey: loanBookKeys.transactions(variables.loanBookId) });
            }
            queryClient.invalidateQueries({ queryKey: loanBookKeys.many() });
            queryClient.invalidateQueries({queryKey: accountKeys.byEmail("this")})
        },
    });
}

export const transactionsClient = {
    useTransactions,
    useTransaction,
    useCreateTransaction,
    useUpdateTransaction,
    useDeleteTransaction,
};