"use client";

import { useAdminLocale } from "./AdminLocaleProvider";

export function LanguageToggle() {
  const { locale, setLocale } = useAdminLocale();

  return (
    <div
      className="flex rounded-full border border-[var(--river-blue)]/20 bg-white p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Language"
    >
      {(["en", "th"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`min-h-9 min-w-10 rounded-full px-2.5 uppercase transition ${
            locale === code
              ? "bg-[var(--river-blue)] text-white"
              : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
