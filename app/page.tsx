"use client";
import AppNav from "@/components/app-nav";
import { InvitationPrompt } from "@/components/invitation-prompt";
import { LoanBookDialog } from "@/components/loan-book-dialog";
import { NewBookButton } from "@/components/new-book-btn";
import { BookOwnerSigniture } from "@/components/signiture";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/auth/use-auth";
import { booksClient } from "@/lib/client/api/books";
import { UserBooksResponseType } from "@/lib/client/api/types";
import { formatDate } from "@/lib/utils/dates";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LandingPage from "./landing/page";
import { Loader2 } from "lucide-react";
import { LazyText } from "@/components/lazy-text";
import { invitationsClient } from "@/lib/client/api/invitations";

export default function Home() {
  const searchParams = useSearchParams();

  const [invitationModalOpen, setInvitationModalOpen] = useState(false);
  const [invitedBookKey, setInvitedBookKey] = useState("");
  const [loanBookOpen, setLoanBookOpen] = useState(false);
  const { user, isAuthenticated, account, reloadAccount } = useAuth();
  const { isLoading, data: books } = booksClient.useBooks({ userId: account?.id || 0 });
  const [openBook, setOpenBook] = useState<UserBooksResponseType | null>(null);

  const { data: invitation, isLoading: isInvitationLoading } = invitationsClient.useInvitationByKey(invitedBookKey);

  useEffect(() => {
    let invitedTo = searchParams.get("invited_to") || "";
    invitedTo = invitedTo.trim();

    if (invitedTo.length > 0) {
      setInvitedBookKey(decodeURIComponent(invitedTo));
      setInvitationModalOpen(true);
    }
  }, [searchParams]);

  const onInvitationActionDecided = () => {
    setInvitationModalOpen(false);
    setInvitedBookKey("");
  };

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className="flex relative h-full flex-col w-full items-center justify-center bg-background font-sans">
      <header className="bg-transparent -mt-2 z-10000! w-full mx-auto h-max fixed -top-1 ">
        <AppNav />
      </header>

      {(invitation && invitation.status === "pending") && <Dialog open={invitationModalOpen} onOpenChange={setInvitationModalOpen}>
        <DialogContent
          showCloseButton={false}
          className="z-100 max-w-xl w-[calc(100%-1.5rem)] max-h-[85dvh] flex flex-col gap-4 rounded-3xl sm:rounded-4xl border border-border bg-card p-4 sm:p-6"
        >
          <DialogHeader className="border-b border-border/10 pb-2 shrink-0">
            <DialogTitle className="text-lg font-bold">
              You have an invitaiton
            </DialogTitle>
            <DialogDescription className="sr-only">
              Please choose to accept or decline it
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[55dvh] flex-1 w-full overflow-y-auto rounded-xl border border-border/10 py-2">
            <InvitationPrompt invitation={invitation} onDecided={onInvitationActionDecided} />
          </div>
        </DialogContent>

        <DialogOverlay className="backdrop-blur-sm" />
      </Dialog>}

      <LoanBookDialog book={openBook} open={loanBookOpen} onOpenChange={setLoanBookOpen} />

      <main className="flex relative min-h-full w-full flex-1 flex-col items-center gap-4 bg-background px-2 md:px-16 py-4 md:py-8 sm:items-start">
        <Card className="flex h-76 w-full flex-col justify-end rounded-4xl bg-primary-gradient p-5 md:p-10 ring-0 border border-border">
          <CardHeader className="gap-2 p-0">
            <CardTitle className="text-lg text-background">
              <LazyText isLoading={!user} text={user?.user_metadata?.name} fallback="User" loadingClassName="w-32 h-5 bg-background/30" />
            </CardTitle>
            <div className="text-4xl font-extrabold text-background">
              <LazyText isLoading={!account} text={`${account?.amount?.toFixed(2) ?? "0.00"} ETB`} fallback="0.00 ETB" loadingClassName="w-48 h-9 bg-background/30" />
            </div>
            <CardDescription className="text-xs font-light text-card">
              {formatDate(new Date())}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="h-full! relative w-full rounded-4xl overflow-hidden">
          <div className="absolute bottom-3 right-3">
            <NewBookButton />
          </div>
          <Card className="h-full! w-full gap-4 overflow-y-auto rounded-4xl border border-border p-4 bg-card">
            <CardContent className="w-full! flex flex-col gap-4 p-0">
              {isLoading ? <div className="w-full h-full grid place-items-center text-xl text-muted-foreground"><Loader2 className="animate-spin" /></div> : (books && books.length > 0) ? books.map((book, i) => (
                <Card
                  key={book.id}
                  className="h-max w-full cursor-pointer rounded-2xl border border-border bg-background p-4 ring-0 transition-colors hover:bg-muted/50"
                  onClick={() => { setOpenBook(book); setLoanBookOpen(true); }}
                >
                  <CardContent className="flex items-center justify-between p-0 relative">
                    <div className="max-w-3/4">
                      <CardTitle className="text-lg font-bold text-nowrap overflow-x-auto">
                        {book.name}  <span className="text-xs bg-foreground/20 p-1 rounded-md"><BookOwnerSigniture bookId={book.id} showOwnIndicator account={account || undefined} /></span>
                      </CardTitle>
                      <CardDescription className="font-mono text-foreground/70">
                        {book.membership.role}
                      </CardDescription>
                    </div>
                    {(() => {
                      const rawAmt = Number(book.amount || "0");
                      const netAmt = book.membership.role === "member" ? -1 * rawAmt : rawAmt;
                      const isPositive = netAmt >= 0;
                      return (
                        <span className={`font-mono font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
                          {isPositive ? `${netAmt}` : netAmt} Birr
                        </span>
                      );
                    })()}
                  </CardContent>
                </Card>
              )) : <div className="w-full h-full grid place-items-center text-xl text-muted-foreground">You don't have any books yet.</div>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
