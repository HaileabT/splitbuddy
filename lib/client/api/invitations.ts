import { LoanBook } from "@/lib/server/db/schema"
import { useMutation, useQuery } from "@tanstack/react-query"

const invitationKeys = {
    many: (filters: unknown) => ["invitation", filters],
    byBook: (bookId: string) => ["invitation", bookId],
    single: (id: string) => ["invitation", id],
}

function useInvitation(id: string) {
return useQuery<LoanBook[]>({
    queryKey: invitationKeys.single(id),
    queryFn: async () => {
        const res = await fetch("");
        const books = await res.json();
        return books as LoanBook[];
    }
})
}

function useInvitationByBook(bookId: string) {
    return useQuery<LoanBook>({
        queryKey: invitationKeys.byBook(bookId),
        queryFn: async () => {
            const res = await fetch(bookId);
            const book = await res.json();
            return book;
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



export const booksClient = {useInvitation, useCancelInvitation, useInvitationByBook}