import React, {
  useState,
  useEffect,
  ChangeEvent,
  FocusEvent,
  useMemo,
} from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MoneyInputProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value" | "type"> {
  value: number | null | undefined;
  onChange: (value: number | undefined) => void;
  locale?: string;
  currency?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const MoneyInput = ({
  value,
  onChange,
  locale = "nb-NO",
  currency = "NOK",
  className,
  ref,
  ...props
}: MoneyInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  const numberFormatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0, // No decimals for whole currency amounts
      });
    } catch (e) {
      console.warn(
        `[MoneyInput] Invalid locale '${locale}' for number formatting. Using default locale.`,
        e
      );
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
  }, [locale]);

  const currencyInfoExtractor = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } catch (e) {
      console.warn(
        `[MoneyInput] Invalid currency '${currency}' or locale '${locale}' for currency style. Symbol might be incorrect.`,
        e
      );
      return null; // Indicates an issue, will fallback to currency code
    }
  }, [locale, currency]);

  const currencySymbol = useMemo(() => {
    let symbol = currency; // Default to currency code
    if (currencyInfoExtractor) {
      try {
        const parts = currencyInfoExtractor.formatToParts(0); // Use 0 or any number
        const foundSymbol = parts.find(
          (part) => part.type === "currency"
        )?.value;
        if (foundSymbol) {
          symbol = foundSymbol.trim();
        }
      } catch (e) {
        console.warn(
          `[MoneyInput] Could not extract currency symbol for ${currency} with locale ${locale}. Using currency code.`,
          e
        );
        // Symbol remains currency code
      }
    }
    return symbol;
  }, [currencyInfoExtractor, currency, locale]);

  useEffect(() => {
    if (value != null && !isNaN(value)) {
      try {
        setDisplayValue(numberFormatter.format(value));
      } catch (error) {
        console.error("[MoneyInput] Error formatting value:", error);
        setDisplayValue(String(value)); // Fallback
      }
    } else {
      setDisplayValue("");
    }
  }, [value, numberFormatter]);

  const parse = (str: string): number | undefined => {
    const sanitized = str.replace(/[^\d]/g, ""); // Remove non-digit characters
    if (sanitized === "") return undefined;
    const num = parseInt(sanitized, 10);
    return isNaN(num) ? undefined : num;
  };

  // Helper function to calculate new cursor position
  const calculateCursorPosition = (
    prevValue: string,
    prevCursor: number | null,
    nextValue: string
  ): number => {
    if (prevCursor === null) return nextValue.length;

    // Count digits to the left of the cursor in the previous value
    const prevDigitsBeforeCursor = prevValue
      .substring(0, prevCursor)
      .replace(/[^\d]/g, "").length;

    let newPos = 0;
    let digitsCounted = 0;

    // Find the position in the next value that has the same number of digits to its left
    for (let i = 0; i < nextValue.length; i++) {
      // Default position is after the current character
      newPos = i + 1;

      if (nextValue[i] >= "0" && nextValue[i] <= "9") {
        digitsCounted++;
      }

      if (digitsCounted === prevDigitsBeforeCursor) {
        // If we've counted enough digits, this is our target position.
        // If the current char is a formatting char, cursor might be before it or after it.
        // Let's try to place it after the sequence of digits.
        // If the *next* character is not a digit, this 'newPos' (i+1) is good.
        // If we are at the end, newPos is also good.
        break;
      }
    }

    // If prevDigitsBeforeCursor is 0, cursor should be at the beginning.
    if (prevDigitsBeforeCursor === 0) {
      newPos = 0;
    } else if (digitsCounted < prevDigitsBeforeCursor) {
      // If not all digits were found (e.g., user deleted them all), set to end.
      newPos = nextValue.length;
    }

    // Ensure cursor is within bounds of the new value
    return Math.min(newPos, nextValue.length);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    const prevValue = inputElement.value; // Value just before this change event processed by our logic
    const prevCursorPos = inputElement.selectionStart;

    const currentInputText = prevValue; // This is what's in the input field from user action

    const digitsOnly = currentInputText.replace(/[^\d]/g, "");
    const numericValue = parse(digitsOnly);

    let nextDisplayValue = "";

    if (currentInputText !== digitsOnly) {
      // Non-digit characters were present in the input.
      if (numericValue !== undefined) {
        try {
          nextDisplayValue = numberFormatter.format(numericValue);
        } catch (error) {
          console.error(
            "[MoneyInput] Error formatting value on change:",
            error
          );
          nextDisplayValue = digitsOnly; // Fallback
        }
      } else {
        nextDisplayValue = "";
      }
    } else {
      // Input contains only digits.
      nextDisplayValue = digitsOnly;
    }

    setDisplayValue(nextDisplayValue);
    onChange(numericValue);

    // Calculate and schedule cursor update
    const newCursor = calculateCursorPosition(
      prevValue,
      prevCursorPos,
      nextDisplayValue
    );

    requestAnimationFrame(() => {
      if (inputElement) {
        inputElement.setSelectionRange(newCursor, newCursor);
      }
    });
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const numericValue = parse(rawValue);

    if (numericValue !== undefined) {
      try {
        setDisplayValue(numberFormatter.format(numericValue));
      } catch (error) {
        console.error("[MoneyInput] Error formatting value on blur:", error);
        setDisplayValue(String(numericValue)); // Fallback
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

  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn("pr-12", className)} // Added padding for the suffix
      />
      {currencySymbol && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground text-sm">
          {currencySymbol}
        </span>
      )}
    </div>
  );
};

MoneyInput.displayName = "MoneyInput";

export { MoneyInput };
