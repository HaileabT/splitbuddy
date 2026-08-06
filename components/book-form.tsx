"use client"

import { useState } from "react";
import AppButton from "./app-button";
import AppInput from "./app-input";
import { useAuth } from "@/context/auth/use-auth";
import { validateEmail } from "@/lib/utils/strings";
import { booksClient } from "@/lib/client/api/books";
import { ApiError } from "next/dist/server/api-utils";

export function BookForm() {
  const [bookName, setBookName] = useState("");
  const [bookNameError, setBookNameError] = useState("")

  const [invitedUserEmail, setInvitedUserEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("")

  const createBookMutation = booksClient.useCreateBook()
  const isLoading = createBookMutation.isPending;

  const onSubmit = async () => {
    setRequestError("")
    if (!validateEmail(invitedUserEmail)) {
      setEmailError("invalid email");
      return;
    }

    if (bookName?.trim().length < 1) {
      setBookNameError("invalid name");
      return;
    }

    try {
      const newBook = await createBookMutation.mutateAsync({ invitedUserEmail, name: bookName });
      setRequestSuccess("book has been created and is currently waiting for invitation to be accepted")
    } catch (error) {
      console.log(error)
      setRequestSuccess("")
      if (error instanceof ApiError) {
        setRequestError(error.message || String(error))
      } else {
        setRequestError(String(error))
      }
    }



  }

  return (
    <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
      {requestError && <p className="text-destructive text-sm text-center">{requestError}</p>}
      {requestSuccess && <p className="text-success text-sm text-center">{requestSuccess}</p>}
      <AppInput
        name="book-name"
        label="book name"
        value={bookName}
        onChange={setBookName}
        onBlur={(e) => {
          const isValid = !!bookName && bookName.trim().length > 2;
          if (!isValid) {
            setBookNameError("name should be at least 2 nonspace characters long")
          } else {
            setBookNameError("")
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
          onBlur={(e) => {
            const isValid = validateEmail(invitedUserEmail)
            if (!isValid) {
              setEmailError("invalid email")
            } else {
              setEmailError("")
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

export function UpdateBookForm() {
  return (
    <form className="flex flex-row gap-4">
      <AppInput
        placeholder="name"
        boxClassName="w-full"
        name="book-name"
        className="bg-background! p-2! py-4! text-base! w-full!  bg-[radial-gradient(circle,var(--dim-foreground)_1px,transparent_1px)] bg-size-[1rem_1rem]"
        type="text"
      />
      <AppButton>Update</AppButton>
    </form>
  );
}
