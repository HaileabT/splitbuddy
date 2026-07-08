import { LoanBook, Transaction } from "@/lib/server/db/schema"
import { useMutation, useQuery } from "@tanstack/react-query"

const transactionKeys = {
    many: (filters: unknown) => ["transactions", filters],
    single: (id: string) => ["transactions", id],
    // transactions: (id: string) => ["transactions", id]
}

function useTransactions(filters: unknown) {
return useQuery<Transaction[]>({
    queryKey: transactionKeys.many(filters),
    queryFn: async () => {
        const res = await fetch("");
        const books = await res.json();
        return books as Transaction[];
    }
})
}

function useTransaction(id: string) {
    return useQuery<Transaction>({
        queryKey: transactionKeys.single(id),
        queryFn: async () => {
            const res = await fetch(id);
            const book = await res.json();
            return book;
        }
    })
}


function useCreateTransaction() {
    return useMutation({
        mutationKey: ["create-tx"],
        mutationFn: async (data: unknown) => {

        }
    })
}

function useUpdateTransaction(id: string) {
    return useMutation({
        mutationKey: ["update-tx", id],
        mutationFn: async (data: unknown) => {

        }
    })
}

function useDeleteTransaction(id: string) {
    return useMutation({
        mutationKey: ['delete-tx', id],
        mutationFn: async (data: unknown) => {

        }
    })
}


export const transactionsClient = {useTransaction, useTransactions, useCreateTransaction, useDeleteTransaction, useUpdateTransaction}