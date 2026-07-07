import {
  addCommasToNumberString,
  getProperNumberString,
} from "@/lib/utils/strings";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import {
  ChangeEventHandler,
  FocusEventHandler,
  useCallback,
  useState,
} from "react";
import { Label } from "../components/ui/label";

const DEFAULT_DECIMAL_POINTS = 0;

interface SpecialNumberInputProps {
  className?: string;
  containerClassName?: string;
  min?: number;
  max?: number;
  decimalPoints?: number;
  label?: string;
  step?: number;
  onChange?: (val: string) => void;
  value?: string;
  defaultValue?: string;
  onBlur?: (val: string) => void;
}

function removeLeadingZeros(num: string) {
  const negative = num.startsWith("-");
  const startsWithZero = num.startsWith("-0") || num.startsWith("0") ? 1 : 0;
  let i = negative ? 1 + startsWithZero : 0 + startsWithZero;

  if (num.length === 2) return num;

  for (i; i < num.length; i++) {
    if (num[i] !== "0") break;

    num = num.slice(0, i) + num.slice(i + 1);
  }

  return num;
}

export default function AppSpecialNumberInput({
  className,
  containerClassName,
  value,
  defaultValue,
  decimalPoints,
  label,
  step,
  min,
  max,
  onChange,
  onBlur,
}: SpecialNumberInputProps) {
  const dp = decimalPoints ?? DEFAULT_DECIMAL_POINTS;
  const isControlled = value !== undefined;

  const [val, setVal] = useState<string>(defaultValue ?? "");
  const [displayVal, setDisplayVal] = useState<string>(() =>
    defaultValue ? getProperNumberString(parseFloat(defaultValue), dp) : "",
  );

  const [controlledDisplay, setControlledDisplay] = useState<string>(() =>
    value ? getProperNumberString(parseFloat(value), dp) : "",
  );

  const currentDisplay = isControlled ? controlledDisplay : displayVal;

  const applyFormat = useCallback(
    (raw: string, decimalPoints: number | null = dp): string => {
      const num = parseFloat(raw);
      return isNaN(num)
        ? ""
        : getProperNumberString(num, decimalPoints || undefined);
    },
    [dp],
  );

  const clamp = useCallback(
    (num: number): number => {
      if (max !== undefined) num = Math.min(num, max);
      if (min !== undefined) num = Math.max(num, min);
      return num;
    },
    [min, max],
  );

  const onInputChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const numberRegex = /^-?\d*(\.\d*)?$/;
      let raw = e.target.value;

      if (!raw.trim()) {
        if (isControlled) {
          setControlledDisplay("");
          onChange?.("");
        } else {
          setVal("");
          setDisplayVal("");
        }
        return;
      }

      if (raw === ".") {
        raw = "0";
        if (dp && dp > 0) {
          raw = applyFormat("0", dp);
        } else if (!dp || dp < 1) {
          raw = "";
        }
      }

      const commaRemoved = raw.replaceAll(",", "");
      if (!numberRegex.test(commaRemoved.trim())) {
        console.log("invalid number", commaRemoved);
        const revert = isControlled ? value! : val;
        if (isControlled) setControlledDisplay(applyFormat(revert, null));
        else setDisplayVal(applyFormat(revert, null));
        return;
      }

      if (commaRemoved.startsWith("-")) {
        let display = commaRemoved;
        let value = commaRemoved;

        if (commaRemoved.length === 1) {
          display = "-";
          value = "0";
        } else {
          display = removeLeadingZeros(commaRemoved);
          value =
            removeLeadingZeros(commaRemoved) === "-0"
              ? "0"
              : removeLeadingZeros(commaRemoved);
        }
        if (isControlled) {
          setControlledDisplay(display);
          onChange?.(value);
        } else {
          setVal(display);
          setDisplayVal(value);
        }

        return;
      }

      let formatted = commaRemoved;
      if (!commaRemoved.endsWith(".")) {
        formatted = addCommasToNumberString(commaRemoved);
      } else {
        formatted = formatted.slice(0, -1);
        formatted = addCommasToNumberString(formatted);
        formatted += ".";
      }

      if (isControlled) {
        setControlledDisplay(formatted);
        onChange?.(formatted);
      } else {
        setVal(commaRemoved.trim());
        setDisplayVal(formatted);
      }
    },
    [isControlled, value, val, onChange, applyFormat],
  );

  const onInputBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
    (e) => {
      const numberRegex = /^-?\d+(\.\d+)?$/;
      let raw = e.target.value.trim();

      if (!raw) return;
      if (raw.endsWith(".")) raw = raw.slice(0, -1);

      const commaRemoved = raw.replaceAll(",", "");
      let numStr = numberRegex.test(commaRemoved)
        ? commaRemoved
        : isControlled
          ? value!
          : val;

      const clamped = getProperNumberString(clamp(parseFloat(numStr)), dp);

      if (isControlled) {
        setControlledDisplay(clamped);
        onBlur?.(clamped);
      } else {
        setVal(clamped);
        setDisplayVal(clamped);
      }
    },
    [isControlled, value, val, dp, clamp, onBlur],
  );

  const onIncreaseClicked = useCallback(() => {
    const effectiveStep = step ?? 1;
    const base = parseFloat(isControlled ? value! : val) || 0;
    const clamped = getProperNumberString(clamp(base + effectiveStep), dp);
    if (isControlled) {
      setControlledDisplay(clamped);
      onChange?.(clamped);
    } else {
      setVal(clamped);
      setDisplayVal(clamped);
    }
  }, [isControlled, value, val, step, dp, clamp, onChange]);

  const onDecreaseClicked = useCallback(() => {
    const effectiveStep = step ?? 1;
    const base = parseFloat(isControlled ? value! : val) || 0;
    const clamped = getProperNumberString(clamp(base - effectiveStep), dp);
    if (isControlled) {
      setControlledDisplay(clamped);
      onChange?.(clamped);
    } else {
      setVal(clamped);
      setDisplayVal(clamped);
    }
  }, [isControlled, value, val, step, dp, clamp, onChange]);

  return (
    <div className="bg-muted flex flex-col">
      {label && <Label className=" top-full right-0 my-3">{label}</Label>}
      <div
        className={cn(
          "h-full w-full! bg-card  flex border border-border rounded-lg relative",
          containerClassName,
        )}
      >
        <Input
          placeholder="1000"
          onChange={onInputChange}
          onBlur={onInputBlur}
          value={currentDisplay}
          className={cn(
            "bg-transparent!  w-full! pr-12 text-7xl! h-max font-bold text-primary border-none placeholder:text-foreground/5 inset-shadow-card inset-x-25!",
            className,
          )}
        />
        <div className="py-4 pr-2 flex flex-col justify-between bg-transparent absolute h-full right-0">
          <Button
            className="bg-card border border-border opacity-90 backdrop-blur-[10px] cursor-pointer hover:bg-muted hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onIncreaseClicked();
            }}
          >
            <ChevronUp className="text-foreground" />
          </Button>
          <Button
            className="bg-card border border-border opacity-90 backdrop-blur-[10px] cursor-pointer hover:bg-muted hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDecreaseClicked();
            }}
          >
            <ChevronDown className="text-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
