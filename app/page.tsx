"use client";
import AppButton from "@/components/app-button";
import { AppDialog } from "@/components/app-dialog";
import { RecordForm } from "@/components/record-form";
import { formatDate } from "@/lib/utils/dates";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [createTxOpen, setCreateTxOpen] = useState(false);
  const [txDetailsOpen, setTxDetailsOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center bg-background font-sans h-full">
      <AppDialog
        open={createTxOpen}
        onOpenChange={setCreateTxOpen}
        className="z-10"
        title="Create A Record"
        subtitle=" "
      >
        <RecordForm />
      </AppDialog>
      <AppDialog
        open={txDetailsOpen}
        onOpenChange={setTxDetailsOpen}
        title={
          <h3 className="text-success font-extrabold text-2xl">+300 Birr</h3>
        }
        subtitle="Today"
        className="z-10"
      >
        <div className="flex flex-col gap-2">
          <p className="text-foreground/50 flex justify-between border-b-[1px] border-dashed border-foreground/30">
            <span>Reason</span>
            <span className="text-foreground/80 max-w-[50%] text-right font-mono!">
              Meal payment split daskf sldkjfewoijfsld f slkfjdf
            </span>
          </p>
          <p className="text-foreground/50 flex justify-between border-b-[1px] border-dashed border-foreground/30">
            <span>Cumulative up to this</span>{" "}
            <span className="text-success font-mono">+480 Birr</span>
          </p>

          <p className="text-foreground/50 flex justify-between border-b-[1px] border-dashed border-foreground/30">
            <span>Created At</span>
            <span className="text-foreground/80 font-mono">
              {formatDate(new Date())}
            </span>
          </p>
          <p className="text-foreground/50 flex justify-between border-b-[1px] border-dashed border-foreground/30">
            <span>Added By</span>
            <span className="text-secondary font-mono">Abebe K.</span>
          </p>
        </div>
      </AppDialog>
      <main className="flex flex-1 w-full min-h-full flex-col items-center py-8 px-16 gap-4 bg-background sm:items-start">
        <div className="w-full h-76 bg-primary-gradient rounded-4xl p-10 flex flex-col justify-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg text-background">Haileab Tesfaye</h1>
            <p className="text-background font-extrabold text-4xl">
              +216.00 ETB
            </p>
            <p className="text-card text-xs font-light">
              {formatDate(new Date())}
            </p>
          </div>
        </div>
        <div className="border-[1px] border-foreground/15 h-full! bg-card w-full rounded-4xl p-4 flex flex-col gap-4 overflow-y-auto">
          {new Array(16).fill(0).map((_, i) => (
            <AppDialog
              key={i}
              title="with Abebe Kebede"
              subtitle={
                <p>
                  He owes you{" "}
                  <span className="text-success font-bold">185 Birr</span>
                </p>
              }
              headerActions={
                <AppButton
                  onClick={() => {
                    setCreateTxOpen(true);
                  }}
                >
                  <Plus />
                </AppButton>
              }
              trigger={
                <div className="w-full bg-background h-max p-4 flex justify-between items-center rounded-2xl cursor-pointer border-[1px] border-foreground/10">
                  <div>
                    <h2 className="font-bold">Abebe Kebede</h2>
                    <p className="font-mono text-foreground/70">
                      +210 Birr loan. 27th Mar, 2026
                    </p>
                  </div>
                  <div>
                    <span className="text-primary">+185.00 Birr</span>
                  </div>
                </div>
              }
            >
              <div className="h-full relative">
                <h2 className="mb-1 underline sticky">Recent Records</h2>
                <div className="flex flex-col gap-4">
                  <div
                    className="bg-card w-full p-3 rounded-lg flex justify-between border-[1px] border-foreground/10 items-center cursor-pointer"
                    onClick={() => setTxDetailsOpen(true)}
                  >
                    <h3 className="text-success font-extrabold text-2xl">
                      +300 Birr
                    </h3>
                    <div>
                      <p>by Abebe K.</p>
                      <p className="text-end text-xs text-foreground/50">
                        today
                      </p>
                    </div>
                  </div>

                  {new Array(19).fill(0).map((_, i) => (
                    <div className="bg-card w-full p-3 rounded-lg flex justify-between border-[1px] border-foreground/10 items-center cursor-pointer">
                      <h3 className="text-error font-extrabold text-2xl">
                        -200 Birr
                      </h3>
                      <div>
                        <p>by you</p>
                        <p className="text-end text-xs text-foreground/50">
                          yesterday
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AppDialog>
          ))}
        </div>
      </main>
    </div>
  );
}
