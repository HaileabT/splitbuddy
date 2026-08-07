import { Account, LoanBook, LoanBookMember, Transaction } from "@/lib/server/db/schema";
import { ServerResponse } from "@/lib/types";
import { getDataFromResponseOrThrow } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserBooksResponseType } from "./types";

export const loanBookKeys = {
    many: (filters?: unknown) => ["books", filters || {}],
    single: (id: number) => ["books", id],
    transactions: (id: number) => ["books", id, "transactions"],
    members: (id: number) => ["books", id, "members"],
    owner: (id: number) => ["books", id, "owner"],
};

interface UseBooksFilters {
    userId?: number;
}

function useBooks(filters?: UseBooksFilters) {
    return useQuery<UserBooksResponseType[]>({
        queryKey: loanBookKeys.many(filters),
        queryFn: async () => {
            const res = await fetch("/api/books");
            const resJson = (await res.json()) as ServerResponse<UserBooksResponseType[]>;
            return getDataFromResponseOrThrow(resJson);
        },
    });
}

function useBook(id: number) {
    return useQuery<LoanBook>({
        queryKey: loanBookKeys.single(id),
        enabled: Boolean(id),
        queryFn: async () => {
            const res = await fetch(`/api/books/${id}`);
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<LoanBook>(resJSON);
        },
    });
}

function useBookTransactions(id: number) {
    return useQuery<Transaction[]>({
        queryKey: loanBookKeys.transactions(id),
        enabled: Boolean(id),
        queryFn: async () => {
            const res = await fetch(`/api/books/${id}/transactions`);
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Transaction[]>(resJSON);
        },
    });
}

function useBookMembers(id: number) {
    return useQuery<(LoanBookMember & { user: any })[]>({
        queryKey: loanBookKeys.members(id),
        enabled: Boolean(id),
        queryFn: async () => {
            const res = await fetch(`/api/books/${id}/members`);
            const resJSON = await res.json();
            return getDataFromResponseOrThrow(resJSON);
        },
    });
}

function useBookOwner(id: number) {
    return useQuery<Account>({
        queryKey: loanBookKeys.owner(id),
        enabled: Boolean(id),
        queryFn: async () => {
            const res = await fetch(`/api/books/${id}/owner`);
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<Account>(resJSON);
        },
    });
}

function useCreateBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["create-book"],
        mutationFn: async (data: { invitedUserEmail: string; name: string }) => {
            const res = await fetch("/api/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<UserBooksResponseType & {link: string}>(resJSON);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: loanBookKeys.many() });
        },
    });
}

function useUpdateBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["update-book"],
        mutationFn: async (data: { id: number; name: string }) => {
            const res = await fetch(`/api/books/${data.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: data.name }),
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<LoanBook>(resJSON);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: loanBookKeys.single(variables.id) });
            queryClient.invalidateQueries({ queryKey: loanBookKeys.many() });
        },
    });
}

function useDeleteBook() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-book"],
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/books/${id}`, {
                method: "DELETE",
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<LoanBook>(resJSON);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: loanBookKeys.many() });
        },
    });
}

function useAddBookMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["add-book-member"],
        mutationFn: async (data: { bookId: number; userId: number; role?: "owner" | "member" }) => {
            const res = await fetch(`/api/books/${data.bookId}/members`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow<LoanBookMember>(resJSON);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: loanBookKeys.members(variables.bookId) });
        },
    });
}

function useRemoveBookMember() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["remove-book-member"],
        mutationFn: async (data: { bookId: number; targetUserId: number }) => {
            const res = await fetch(`/api/books/${data.bookId}/members?targetUserId=${data.targetUserId}`, {
                method: "DELETE",
            });
            const resJSON = await res.json();
            return getDataFromResponseOrThrow(resJSON);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: loanBookKeys.members(variables.bookId) });
        },
    });
}

export const booksClient = {
    useBooks,
    useBook,
    useBookTransactions,
    useBookMembers,
    useBookOwner,
    useCreateBook,
    useUpdateBook,
    useDeleteBook,
    useAddBookMember,
    useRemoveBookMember,
};