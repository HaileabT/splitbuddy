import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { BookForm } from "./book-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function NewBookButton() {
  return (
    <Dialog>
      <DialogOverlay className="backdrop-blur-md" />
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full bg-primary! text-4xl! size-10 md:size-12 opacity-50 hover:opacity-100 cursor-pointer hover:text-background! border-0 text-background! aspect-square"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="z-100 max-w-xl w-[calc(100%-1.5rem)] max-h-[85dvh] flex flex-col gap-4 rounded-3xl sm:rounded-4xl bg-card border border-border/20 p-4 sm:p-6 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="bg-card rounded-md shrink-0">
          <DialogTitle className="text-foreground text-lg font-bold">
            Invite Member
          </DialogTitle>
          <DialogDescription className="hidden">
            Other member email
          </DialogDescription>
        </DialogHeader>
        <div className="bg-card flex-1 max-h-[60dvh] overflow-y-auto rounded-md">
          <BookForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
