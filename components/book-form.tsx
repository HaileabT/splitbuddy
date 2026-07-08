import { useState } from "react";
import AppButton from "./app-button";
import AppInput from "./app-input";
import { Label } from "./ui/label";

export function BookForm() {
  return (
    <form className="flex flex-col gap-6">
      <AppInput
        name="book-name"
        label="book name"
        type="text"
        placeholder="abebe"
        className="bg-background! p-2! py-4! text-base! w-full! "
      />
      <div className="flex flex-col gap-6">
        <AppInput
          placeholder="some.dude@gomail.com"
          boxClassName="w-full"
          name="member-email"
          label="Email"
          className="bg-background! p-2! py-4! text-base! w-full!  bg-[radial-gradient(circle,var(--dim-foreground)_1px,transparent_1px)] bg-[length:1rem_1rem]"
          type="email"
        />
        <AppButton>Invite</AppButton>
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
        className="bg-background! p-2! py-4! text-base! w-full!  bg-[radial-gradient(circle,var(--dim-foreground)_1px,transparent_1px)] bg-[length:1rem_1rem]"
        type="text"
      />
      <AppButton>Update</AppButton>
    </form>
  );
}
