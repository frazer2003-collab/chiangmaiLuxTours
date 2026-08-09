"use client";

import { useEffect, useId, useState } from "react";
import {
  formatAdminDateInput,
  isoToAdminDateDisplay,
  parseAdminDateInput,
} from "@/lib/admin-date-input";
import { useAdminLocale } from "./AdminLocaleProvider";

type Props = {
  id?: string;
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
  describedBy?: string;
};

export function AdminDateInput({
  id: idProp,
  value,
  onChange,
  disabled,
  describedBy,
}: Props) {
  const { tr } = useAdminLocale();
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
        placeholder={tr("dateFormatPlaceholder")}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy ?? hintId}
        className={`min-h-11 w-full rounded-xl border bg-white px-3 font-medium tracking-wide text-[var(--ink)] placeholder:font-normal placeholder:tracking-normal placeholder:text-[var(--ink-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)] disabled:opacity-50 ${
          invalid
            ? "border-[var(--river-blue-deep)]"
            : "border-[var(--river-blue)]/20"
        }`}
      />
      <p id={hintId} className="mt-1.5 text-xs text-[var(--ink-muted)]">
        {tr("dateFormatHint")}
      </p>
    </div>
  );
}
