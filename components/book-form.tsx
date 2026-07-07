import { useState } from "react";
import AppButton from "./app-button";
import AppInput from "./app-input";
import { Label } from "./ui/label";

export function BookForm() {
  return (
    <form className="flex gap-2 items-center!">
      <AppInput
        placeholder="some.dude@gomail.com"
        boxClassName="w-full"
        name="member email"
        className="bg-background! p-2! py-4! text-base! w-full!  bg-[radial-gradient(circle,var(--dim-foreground)_1px,transparent_1px)] bg-[length:1rem_1rem]"
        type="email"
      />
      <AppButton>Invite</AppButton>
    </form>
  );
}
