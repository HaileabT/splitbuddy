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
        className="overflow-hidden bg-card border-0! outline-0! shadow-none! shadow-transparent border-transparent! w-[calc(100%-1rem)]! max-w-[500px]!"
        showCloseButton={false}
      >
        <DialogHeader className="bg-card rounded-md">
          <DialogTitle className="text-foreground text-lg font-bold">
            Invite Member
          </DialogTitle>
          <DialogDescription className="hidden">
            Other member email
          </DialogDescription>
        </DialogHeader>
        <div className="bg-card rounded-md">
          <BookForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
