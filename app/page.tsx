"use client";

import AppNav from "@/components/app-nav";
import { NewBookButton } from "@/components/new-book-btn";
import { RecordForm } from "@/components/record-form";
import { Button } from "@/components/ui/button";
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils/dates";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [createTxOpen, setCreateTxOpen] = useState(false);
  const [txDetailsOpen, setTxDetailsOpen] = useState(false);
  const [loanBookOpen, setLoanBookOpen] = useState(false);

  return (
    <div className="flex relative h-full flex-col w-full items-center justify-center bg-background font-sans">
      <header className="bg-transparent -mt-2 z-10000! w-full mx-auto h-max fixed -top-1 ">
        <AppNav />
      </header>
      <Dialog open={createTxOpen} onOpenChange={setCreateTxOpen}>
        <DialogContent
          showCloseButton={false}
          className="z-100 max-w-xl gap-4 rounded-4xl border border-border bg-card p-6 sm:max-w-xl"
        >
          <DialogHeader className="border-b border-border/10 pb-4">
            <DialogTitle className="text-lg font-bold">
              Create A Record
            </DialogTitle>
            <DialogDescription className="sr-only">
              Create a new record
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-192 w-full overflow-y-auto rounded-xl border border-border/10 bg-muted p-4">
            <RecordForm />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={loanBookOpen} onOpenChange={setLoanBookOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-xl gap-4 rounded-4xl border border-border/10 bg-card p-6 sm:max-w-xl"
        >
          <DialogHeader className="flex-row items-start justify-between border-b border-border/10 pb-4">
            <div>
              <DialogTitle className="text-lg font-bold">
                with Abebe Kebede
              </DialogTitle>
              <DialogDescription>
                He owes you{" "}
                <span className="font-bold text-success">185 Birr</span>
              </DialogDescription>
            </div>
            <Button
              size="icon"
              className="cursor-pointer"
              onClick={() => setCreateTxOpen(true)}
            >
              <Plus />
            </Button>
          </DialogHeader>
          <div className="max-h-192 w-full overflow-y-auto rounded-xl border border-border/10 bg-muted p-4">
            <h2 className="mb-1 underline">Recent Records</h2>
            <div className="flex flex-col gap-4">
              <Card
                className="w-full cursor-pointer rounded-lg border border-border/10 ring-0"
                onClick={() => setTxDetailsOpen(true)}
              >
                <CardContent className="flex items-center justify-between p-3">
                  <h3 className="text-2xl font-extrabold text-success">
                    +300 Birr
                  </h3>
                  <div>
                    <p>by Abebe K.</p>
                    <p className="text-end text-xs text-foreground/50">today</p>
                  </div>
                </CardContent>
              </Card>

              {new Array(19).fill(0).map((_, j) => (
                <Card
                  key={j}
                  className="w-full cursor-pointer rounded-lg border border-border/10 ring-0"
                >
                  <CardContent className="flex items-center justify-between p-3">
                    <h3 className="text-2xl font-extrabold text-error">
                      -200 Birr
                    </h3>
                    <div>
                      <p>by you</p>
                      <p className="text-end text-xs text-foreground/50">
                        yesterday
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={txDetailsOpen} onOpenChange={setTxDetailsOpen}>
        <DialogContent
          showCloseButton={false}
          className="z-100 max-w-xl gap-4 rounded-4xl border border-border/10 bg-card p-6 sm:max-w-xl"
        >
          <DialogHeader className="border-b border-border/10 pb-4">
            <DialogTitle asChild>
              <h3 className="text-2xl font-extrabold text-success">
                +300 Birr
              </h3>
            </DialogTitle>
            <DialogDescription>Today</DialogDescription>
          </DialogHeader>
          <div className="max-h-192 w-full overflow-y-auto rounded-xl border border-border/10 bg-muted p-4">
            <div className="flex flex-col gap-2">
              <p className="flex justify-between border-b border-dashed border-border/30 text-foreground/50">
                <span>Reason</span>
                <span className="max-w-[50%] text-right font-mono! text-foreground/80">
                  Meal payment split daskf sldkjfewoijfsld f slkfjdf
                </span>
              </p>
              <p className="flex justify-between border-b border-dashed border-border/30 text-foreground/50">
                <span>Cumulative up to this</span>
                <span className="font-mono text-success">+480 Birr</span>
              </p>
              <p className="flex justify-between border-b border-dashed border-border/30 text-foreground/50">
                <span>Created At</span>
                <span className="font-mono text-foreground/80">
                  {formatDate(new Date())}
                </span>
              </p>
              <p className="flex justify-between border-b border-dashed border-border/30 text-foreground/50">
                <span>Added By</span>
                <span className="font-mono text-secondary">Abebe K.</span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <main className="flex relative min-h-full w-full flex-1 flex-col items-center gap-4 bg-background px-2 md:px-16 py-4 md:py-8 sm:items-start">
        <Card className="flex h-76 w-full flex-col justify-end rounded-4xl bg-primary-gradient p-5 md:p-10 ring-0 border border-border">
          <CardHeader className="gap-2 p-0">
            <CardTitle className="text-lg text-background">
              Haileab Tesfaye
            </CardTitle>
            <p className="text-4xl font-extrabold text-background">
              +216.00 ETB
            </p>
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
              {new Array(16).fill(0).map((_, i) => (
                <Card
                  key={i}
                  className="h-max w-full cursor-pointer rounded-2xl border border-border bg-background p-4 ring-0 transition-colors hover:bg-muted/50"
                  onClick={() => setLoanBookOpen(true)}
                >
                  <CardContent className="flex items-center justify-between p-0">
                    <div>
                      <CardTitle className="font-bold">Abebe Kebede</CardTitle>
                      <CardDescription className="font-mono text-foreground/70">
                        +210 Birr loan. 27th Mar, 2026
                      </CardDescription>
                    </div>
                    <span className="text-primary">+185.00 Birr</span>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
