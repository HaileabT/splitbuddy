import AppButton from "./app-button";
import AppInput from "./app-input";

export function RecordForm() {
  return (
    <form className="flex flex-col gap-4">
      <AppInput name="Amount" placeholder="200.00" type="number" />
      <AppInput name="Reason" placeholder="Loan" type="text" />
      <AppButton className="mt-4">Add Record</AppButton>
    </form>
  );
}
