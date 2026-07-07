import { useState } from "react";
import AppButton from "./app-button";
import AppInput from "./app-input";
import AppSpecialNumberInput from "./app-special-number-input";
import { Textarea } from "./ui/textarea";
import { AppTextarea } from "./app-textarea";

export function RecordForm() {
  const [amount, setAmount] = useState("0");
  return (
    <form className="flex flex-col gap-4">
      <div className="bg-card rounded-md flex justify-center">
        <AppSpecialNumberInput
          value={amount}
          label="Amount - in Birr"
          onChange={(val) => setAmount(val)}
          decimalPoints={2}
        />
      </div>
      <AppTextarea label="Reason" placeholder="Drinks" />
      <AppButton className="mt-4">Add Record</AppButton>
    </form>
  );
}
