import { LoanBook } from "@/lib/server/db/schema"
import { useMutation, useQuery } from "@tanstack/react-query"
import { UserBooksResponseType } from "./types"
import { ServerResponse } from "@/lib/types"
import { getDataFromResponseOrThrow } from "@/lib/utils"

export const loanBookKeys = {
    many: (filters: unknown) => ["books", filters],
    single: (id: number) => ["books", id],
    transactions: (id: number) => ["books", id, "transactions"]
}

interface UseBooksFilters {
    userId?: number
}
function useBooks(filters?: UseBooksFilters) {
    return useQuery<UserBooksResponseType[]>({
        queryKey: loanBookKeys.many(filters),
        queryFn: async () => {
            const res = await fetch("/api/books");
            const resJson = (await res.json()) as ServerResponse<UserBooksResponseType[]>;
            if (resJson.status === "failed") {
                throw new Error(resJson.message);
            }
            return resJson.data || [];
        }
    })
}

function useBook(id: number) {
    return useQuery<LoanBook>({
        queryKey: loanBookKeys.single(id),
        queryFn: async () => {
            const res = await fetch(`/api/books/${id}`);
            const resJSON = await res.json();
            return getDataFromResponseOrThrow(resJSON);
        }
    })
}

function useBookTransactions(id: number) {
    return useQuery<LoanBook>({
        queryKey: loanBookKeys.transactions(id),
        queryFn: async () => {
            const res = await fetch("");
            const book = await res.json();
            return book;
        }
    })
}

function useCreateBook() {
    return useMutation({
        mutationKey: ["create-book"],
        mutationFn: async (data: { invitedUserEmail: string, name: string }) => {
            const res = await fetch("/api/books", {
                method: "POST",
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.message)
            }
            const book = await res.json();
            return book;
        }

    })
}

function useUpdateBook(id: string) {
    return useMutation({
        mutationKey: ["update-book", id],
        mutationFn: async (data: { name?: string }) => {
            const res = await fetch(`/api/books/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data)
            });
            const book = await res.json();
            return book;
        }
    })
}

function useDeleteBook(id: string) {
    return useMutation({
        mutationKey: ['delete-book', id],
        mutationFn: async (data: unknown) => {

        }
    })
}


export const booksClient = { useBooks, useBook, useCreateBook, useUpdateBook, useDeleteBook, useBookTransactions }