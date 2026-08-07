"use client"
import { UserBooksResponseType } from "@/lib/client/api/types";
import { UpdateBookForm } from "./book-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface UpdateBookDialogProps {
    open?: boolean,
    onOpenChange?: (open: boolean) => void,
    book: UserBooksResponseType
}

export function UpdateBookDialog({ open, onOpenChange, book }: UpdateBookDialogProps) {
    return <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
            showCloseButton={false}
            className="z-100 max-w-xl gap-4 rounded-4xl border border-border bg-card sm:max-w-xl overflow-hidden p-6"
        >
            <DialogHeader className="border-b border-border/10 pb-4">
                <DialogTitle className="text-lg font-bold">Rename Book</DialogTitle>
                <DialogDescription className="sr-only">
                    Give it a new name
                </DialogDescription>
            </DialogHeader>
            <div className="w-full rounded-xl border border-border/10 flex flex-col gap-4">
                <UpdateBookForm book={book} onSuccess={() => onOpenChange?.(false)} />
            </div>
        </DialogContent>
    </Dialog>
}