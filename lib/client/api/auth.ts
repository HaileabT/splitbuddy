import { User } from "@/lib/server/db/schema"
import { useMutation, useQuery } from "@tanstack/react-query"

function useMyDetails() {
return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
        const res = await fetch("");
        const books = await res.json();
        return books as User;
    }
})
}

function useSignin() {
    return useMutation({
        mutationKey: ["signin"],
        mutationFn: async (data: unknown) => {

        }
    })
}

function useSignup() {
    return useMutation({
        mutationKey: ["signup"],
        mutationFn: async (data: unknown) => {

        }
    })
}

function useDeleteAccount() {
    return useMutation({
        mutationKey: ['delete-account'],
        mutationFn: async (data: unknown) => {

        }
    })
}


export const authClient = {useMyDetails, useSignin, useSignup, useDeleteAccount}