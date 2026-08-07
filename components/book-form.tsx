"use client"

import { useState, useEffect } from "react";
import AppButton from "./app-button";
import AppInput from "./app-input";
import { validateEmail } from "@/lib/utils/strings";
import { booksClient } from "@/lib/client/api/books";
import { UserBooksResponseType } from "@/lib/client/api/types";
import { Check, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export function BookForm({ onSuccess }: { onSuccess?: () => void }) {
  const [bookName, setBookName] = useState("");
  const [bookNameError, setBookNameError] = useState("");

  const [invitedUserEmail, setInvitedUserEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createBookMutation = booksClient.useCreateBook();
  const isLoading = createBookMutation.isPending;

  const handleCopy = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onSubmit = async () => {
    setRequestError("");
    setCreatedLink(null);
    setCopied(false);

    if (!validateEmail(invitedUserEmail)) {
      setEmailError("invalid email");
      return;
    }

    if (bookName?.trim().length < 1) {
      setBookNameError("invalid name");
      return;
    }

    try {
      const res = await createBookMutation.mutateAsync({ invitedUserEmail, name: bookName });
      if (res?.link) {
        setCreatedLink(res.link);
      }
      setRequestSuccess("Book created successfully!");
      onSuccess?.();
    } catch (error) {
      console.log(error);
      setRequestSuccess("");
      if (error instanceof Error) {
        setRequestError(error.message || String(error));
      } else {
        setRequestError(String(error));
      }
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {requestError && <p className="text-destructive text-sm text-center">{requestError}</p>}
      {requestSuccess && (
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-success/10 border border-success/20 text-success">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 shrink-0" />
            <p className="text-sm font-medium">{requestSuccess}</p>
          </div>
          {createdLink && (
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-xs font-mono text-foreground/70">Invitation Link</label>
              <div className="flex items-center gap-2 bg-background border border-border/20 rounded-lg p-2">
                <input
                  type="text"
                  readOnly
                  value={createdLink}
                  className="bg-transparent text-xs font-mono text-foreground flex-1 truncate outline-none"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 px-2.5 text-xs flex items-center gap-1.5 cursor-pointer hover:bg-muted"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-success" />
                      <span className="text-success font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
                <a
                  href={createdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 hover:bg-muted rounded-md text-foreground/70 hover:text-foreground transition-colors"
                  title="Open link"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
      <AppInput
        name="book-name"
        label="book name"
        value={bookName}
        onChange={setBookName}
        onBlur={() => {
          const isValid = !!bookName && bookName.trim().length > 2;
          if (!isValid) {
            setBookNameError("name should be at least 2 nonspace characters long");
          } else {
            setBookNameError("");
          }
        }}
        type="text"
        placeholder="abebe"
        className="bg-background! p-2! py-4! text-base! w-full! "
        error={bookNameError}
      />
      <div className="flex flex-col gap-6">
        <AppInput
          placeholder="some.dude@gomail.com"
          boxClassName="w-full"
          name="member-email"
          value={invitedUserEmail}
          onChange={setInvitedUserEmail}
          onBlur={() => {
            const isValid = validateEmail(invitedUserEmail);
            if (!isValid) {
              setEmailError("invalid email");
            } else {
              setEmailError("");
            }
          }}
          label="Email"
          className="bg-background! p-2! py-4! text-base! w-full!  bg-[radial-gradient(circle,var(--dim-foreground)_1px,transparent_1px)] bg-size-[1rem_1rem]"
          type="email"
          error={emailError}
        />
        <AppButton isLoading={isLoading}>Invite</AppButton>
      </div>
    </form>
  );
}

export function UpdateBookForm({ book, onSuccess }: { book: UserBooksResponseType; onSuccess?: () => void }) {
  const [name, setName] = useState(book.name || "");
  const [nameError, setNameError] = useState("");
  const [requestError, setRequestError] = useState("");

  const updateBookMutation = booksClient.useUpdateBook();
  const isLoading = updateBookMutation.isPending;

  useEffect(() => {
    setName(book.name || "");
  }, [book.name]);

  const onSubmit = async () => {
    if (!name || name.trim().length < 1) {
      setNameError("Name is required");
      return;
    }
    setRequestError("");
    try {
      await updateBookMutation.mutateAsync({ id: book.id, name: name.trim() });
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        setRequestError(error.message || String(error));
      } else {
        setRequestError(String(error));
      }
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {requestError && <p className="text-destructive text-sm">{requestError}</p>}
      <div className="flex flex-row gap-4">
        <AppInput
          placeholder="name"
          boxClassName="w-full"
          name="book-name"
          value={name}
          onChange={(val) => {
            setNameError("");
            setName(val);
          }}
          error={nameError}
          className="bg-background! p-2! py-4! text-base! w-full!  bg-[radial-gradient(circle,var(--dim-foreground)_1px,transparent_1px)] bg-size-[1rem_1rem]"
          type="text"
        />
        <AppButton isLoading={isLoading} disabled={isLoading}>Update</AppButton>
      </div>
    </form>
  );
}
