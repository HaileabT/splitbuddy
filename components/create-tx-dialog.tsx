import { UserBooksResponseType } from "@/lib/client/api/types";
import { RecordForm } from "./record-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface CreateTxDialogProps {
    open?: boolean,
    onOpenChange: (open: boolean) => void,
    book: UserBooksResponseType,
}

export function CreateTxDialog({ open, onOpenChange, book }: CreateTxDialogProps) {
    return <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
            showCloseButton={false}
            className="z-100 max-w-xl gap-4 rounded-4xl border border-border bg-card p-6 sm:max-w-xl"
        >
            <DialogHeader className="border-b border-border/10 pb-4">
                <DialogTitle className="text-lg font-bold">
                    Create A Record
                </DialogTitle>
                <DialogDescription className="">
                    Think of this as you are writing on someone else's loan book. If you enter 200 that means you owe the owner 200 more.
                </DialogDescription>
            </DialogHeader>
            <div className="max-h-192 w-full overflow-y-auto rounded-xl border border-border/10 bg-muted p-4">
                <RecordForm onSuccess={() => onOpenChange(false)} book={book} />
            </div>
        </DialogContent>
    </Dialog>

}