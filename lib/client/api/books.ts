import { LoanBook } from "@/lib/server/db/schema"
import { useMutation, useQuery } from "@tanstack/react-query"

const loanBookKeys = {
    many: (filters: unknown) => ["books", filters],
    single: (id: string) => ["books", id],
    transactions: (id: string) => ["books", id, "transactions"]
}

function useBooks(filters: unknown) {
return useQuery<LoanBook[]>({
    queryKey: loanBookKeys.many(filters),
    queryFn: async () => {
        const res = await fetch("");
        const books = await res.json();
        return books as LoanBook[];
    }
})
}

function useBook(id: string) {
    return useQuery<LoanBook>({
        queryKey: loanBookKeys.single(id),
        queryFn: async () => {
            const res = await fetch(id);
            const book = await res.json();
            return book;
        }
    })
}

function useBookTransactions(id: string) {
    return useQuery<LoanBook>({
        queryKey: loanBookKeys.transactions(id),
        queryFn: async () => {
            const res = await fetch(id);
            const book = await res.json();
            return book;
        }
    })
}

function useCreateBook() {
    return useMutation({
        mutationKey: ["create-book"],
        mutationFn: async (data: unknown) => {

        }
    })
}

function useUpdateBook(id: string) {
    return useMutation({
        mutationKey: ["update-book", id],
        mutationFn: async (data: unknown) => {

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


export const booksClient = {useBooks, useBook, useCreateBook, useUpdateBook, useDeleteBook, useBookTransactions}