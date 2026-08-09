"use client";

import { useEffect, useId, useState } from "react";
import {
  formatAdminDateInput,
  isoToAdminDateDisplay,
  parseAdminDateInput,
} from "@/lib/admin-date-input";

type Props = {
  id?: string;
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
  describedBy?: string;
  placeholder?: string;
  hint?: string;
  showHint?: boolean;
  inputClassName?: string;
};

export function DdMmYyDateInput({
  id: idProp,
  value,
  onChange,
  disabled,
  describedBy,
  placeholder = "DD/MM/YY",
  hint = "Day / month / year — e.g. 15/03/85",
  showHint = true,
  inputClassName,
}: Props) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hintId = `${id}-hint`;
  const [display, setDisplay] = useState(() => isoToAdminDateDisplay(value));

  useEffect(() => {
    setDisplay(isoToAdminDateDisplay(value));
  }, [value]);

  const complete = display.length === 8;
  const invalid = complete && !parseAdminDateInput(display);

  function handleChange(nextRaw: string) {
    const formatted = formatAdminDateInput(nextRaw);
    setDisplay(formatted);
    onChange(parseAdminDateInput(formatted) ?? "");
  }

  const defaultInputClass =
    "min-h-11 w-full rounded-xl border bg-white px-3 font-medium tracking-wide text-[var(--ink)] placeholder:font-normal placeholder:tracking-normal placeholder:text-[var(--ink-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)] disabled:opacity-50";

  return (
    <div>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        value={display}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy ?? (showHint ? hintId : undefined)}
        className={`${defaultInputClass} ${
          invalid
            ? "border-[var(--river-blue-deep)]"
            : "border-[var(--river-blue)]/25"
        } ${inputClassName ?? ""}`}
      />
      {showHint ? (
        <p id={hintId} className="mt-1.5 text-xs text-[var(--ink-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
