import React, {
  useState,
  useEffect,
  ChangeEvent,
  FocusEvent,
  useMemo,
} from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PercentInputProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value" | "type"> {
  value: number | null | undefined;
  onChange: (value: number | undefined) => void;
  locale?: string;
  decimals?: number;
  ref?: React.Ref<HTMLInputElement>;
}

const PercentInput = ({
  value,
  onChange,
  locale = "nb-NO",
  decimals = 2,
  className,
  ref,
  ...props
}: PercentInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isUserTyping, setIsUserTyping] = useState<boolean>(false);
  const [preserveUserFormat, setPreserveUserFormat] = useState<boolean>(false);

  const numberFormatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      });
    } catch (e) {
      console.warn(
        `[PercentInput] Invalid locale '${locale}' for number formatting. Using default locale.`,
        e,
      );
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      });
    }
  }, [locale, decimals]);

  useEffect(() => {
    // Only update display value from props when user is not actively typing and we haven't preserved their format
    if (
      !isUserTyping &&
      !preserveUserFormat &&
      value != null &&
      !isNaN(value)
    ) {
      try {
        setDisplayValue(numberFormatter.format(value));
      } catch (error) {
        console.error("[PercentInput] Error formatting value:", error);
        setDisplayValue(String(value)); // Fallback
      }
    } else if (
      !isUserTyping &&
      !preserveUserFormat &&
      (value == null || isNaN(value))
    ) {
      setDisplayValue("");
    }
  }, [value, numberFormatter, isUserTyping, preserveUserFormat]);

  const parse = (str: string): number | undefined => {
    // Remove all non-digit and non-decimal characters, but keep both . and , as decimal separators
    const sanitized = str.replace(/[^\d.,]/g, "");

    if (sanitized === "") return undefined;
    if (sanitized === "." || sanitized === ",") return undefined;

    // Convert to standard decimal format for parsing (always use . for parsing)
    const standardFormat = sanitized.replace(",", ".");

    // Handle trailing decimal separator (e.g., "4." or "4,")
    if (standardFormat.endsWith(".")) {
      const num = parseFloat(standardFormat.slice(0, -1));
      return isNaN(num) ? undefined : num;
    }

    const num = parseFloat(standardFormat);
    return isNaN(num) ? undefined : num;
  };

  // Helper function to calculate new cursor position
  const calculateCursorPosition = (
    prevValue: string,
    prevCursor: number | null,
    nextValue: string,
  ): number => {
    if (prevCursor === null) return nextValue.length;

    // Count significant characters (digits and decimal separators) to the left of cursor
    const prevSignificantChars = prevValue
      .substring(0, prevCursor)
      .replace(/[^\d.,]/g, "").length;

    let newPos = 0;
    let significantCharsCounted = 0;

    // Find the position in the next value that has the same number of significant chars to its left
    for (let i = 0; i < nextValue.length; i++) {
      newPos = i + 1;

      if (nextValue[i].match(/[\d,.]/)) {
        significantCharsCounted++;
      }

      if (significantCharsCounted === prevSignificantChars) {
        break;
      }
    }

    if (prevSignificantChars === 0) {
      newPos = 0;
    } else if (significantCharsCounted < prevSignificantChars) {
      newPos = nextValue.length;
    }

    return Math.min(newPos, nextValue.length);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    const prevValue = inputElement.value;
    const prevCursorPos = inputElement.selectionStart;

    const currentInputText = prevValue;
    const localeDecimalSeparator = locale === "nb-NO" ? "," : ".";

    setIsUserTyping(true);
    setPreserveUserFormat(false);

    // Clean the input to only allow digits and decimal separators (both . and ,)
    const sanitized = currentInputText.replace(/[^\d.,]/g, "");

    // Prevent multiple decimal separators (count both . and ,)
    const dotCount = (sanitized.match(/\./g) || []).length;
    const commaCount = (sanitized.match(/,/g) || []).length;
    const totalSeparators = dotCount + commaCount;

    let cleanInput = sanitized;

    if (totalSeparators > 1) {
      // Keep only the first decimal separator (whether . or ,)
      let firstSeparatorIndex = -1;

      for (let i = 0; i < sanitized.length; i++) {
        if (sanitized[i] === "." || sanitized[i] === ",") {
          firstSeparatorIndex = i;
          break;
        }
      }

      if (firstSeparatorIndex !== -1) {
        cleanInput =
          sanitized.substring(0, firstSeparatorIndex + 1) +
          sanitized.substring(firstSeparatorIndex + 1).replace(/[.,]/g, "");
      }
    }

    // Normalize to locale-appropriate decimal separator for display
    if (cleanInput.includes(".") && localeDecimalSeparator === ",") {
      cleanInput = cleanInput.replace(".", ",");
    } else if (cleanInput.includes(",") && localeDecimalSeparator === ".") {
      cleanInput = cleanInput.replace(",", ".");
    }

    // Limit decimal places
    const parts = cleanInput.split(localeDecimalSeparator);
    if (parts.length === 2 && parts[1].length > decimals) {
      cleanInput =
        parts[0] + localeDecimalSeparator + parts[1].substring(0, decimals);
    }

    const numericValue = parse(cleanInput);
    const nextDisplayValue = cleanInput;

    setDisplayValue(nextDisplayValue);
    onChange(numericValue);

    // Calculate and schedule cursor update
    const newCursor = calculateCursorPosition(
      prevValue,
      prevCursorPos,
      nextDisplayValue,
    );

    requestAnimationFrame(() => {
      if (inputElement) {
        inputElement.setSelectionRange(newCursor, newCursor);
      }
    });
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsUserTyping(false);

    const rawValue = event.target.value;
    const numericValue = parse(rawValue);

    if (numericValue !== undefined) {
      const localeDecimalSeparator = locale === "nb-NO" ? "," : ".";

      // Check if the raw value is already in a valid format
      const isValidFormat = /^\d+([.,]\d+)?$/.test(rawValue);
      const hasCorrectSeparator = rawValue.includes(localeDecimalSeparator);

      // If the input is valid and uses the correct separator, preserve it
      // This keeps trailing zeros like "5,50" or "2,00"
      if (isValidFormat && hasCorrectSeparator) {
        setDisplayValue(rawValue);
        setPreserveUserFormat(true);
      } else if (isValidFormat && !hasCorrectSeparator) {
        // Convert separator to locale format but preserve trailing zeros
        const normalizedValue = rawValue.includes(".")
          ? rawValue.replace(".", localeDecimalSeparator)
          : rawValue.replace(",", localeDecimalSeparator);
        setDisplayValue(normalizedValue);
        setPreserveUserFormat(true);
      } else {
        // Fallback to formatted value for malformed input
        try {
          setDisplayValue(numberFormatter.format(numericValue));
        } catch (error) {
          console.error(
            "[PercentInput] Error formatting value on blur:",
            error,
          );
          setDisplayValue(String(numericValue)); // Fallback
        }
      }
    } else {
      if (rawValue.trim() !== "") {
        onChange(undefined);
      }
      setDisplayValue("");
    }

    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsUserTyping(true);
    setPreserveUserFormat(false);

    if (props.onFocus) {
      props.onFocus(event);
    }
  };

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={cn("pr-8", className)} // Added padding for the % suffix
        aria-label={props["aria-label"] || "Percentage input"}
      />
      <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm">
        %
      </span>
    </div>
  );
};

PercentInput.displayName = "PercentInput";

export { PercentInput };
