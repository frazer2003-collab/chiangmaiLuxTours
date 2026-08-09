"use client";

import { useAdminLocale } from "./AdminLocaleProvider";

export function AdminSpinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin text-[var(--river-blue)] ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2z"
      />
    </svg>
  );
}

export function AdminSkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-2xl bg-white px-4 py-3.5 ring-1 ring-[var(--river-blue)]/10"
      aria-hidden="true"
    >
      <div className="flex justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-[var(--river-blue)]/10" />
          <div className="h-3 w-1/2 rounded bg-[var(--river-blue)]/8" />
        </div>
        <div className="h-6 w-16 rounded-full bg-[var(--marker-yellow)]/25" />
      </div>
      <div className="mt-3 flex gap-3">
        <div className="h-3 w-24 rounded bg-[var(--river-blue)]/8" />
        <div className="h-3 w-16 rounded bg-[var(--river-blue)]/8" />
      </div>
    </div>
  );
}

export function AdminSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <ul className="space-y-2" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <AdminSkeletonCard />
        </li>
      ))}
    </ul>
  );
}

export function AdminStatusBanner({
  tone,
  message,
  onRetry,
}: {
  tone: "error" | "success" | "loading";
  message: string;
  onRetry?: () => void;
}) {
  const { tr } = useAdminLocale();
  const styles = {
    error: "bg-[var(--river-blue)]/8 text-[var(--river-blue-deep)]",
    success: "bg-[var(--marker-yellow)]/20 text-[var(--ink)]",
    loading: "bg-white text-[var(--ink-muted)] ring-1 ring-[var(--river-blue)]/10",
  };

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm ${styles[tone]}`}
    >
      <span className="flex min-w-0 items-center gap-2">
        {tone === "loading" ? <AdminSpinner /> : null}
        <span>{message}</span>
      </span>
      {tone === "error" && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-[var(--river-blue)] hover:bg-[var(--river-blue)]/10"
        >
          {tr("tryAgain")}
        </button>
      ) : null}
    </div>
  );
}

export function AdminShellFallback() {
  const { tr } = useAdminLocale();
  return (
    <div className="chart-grid flex min-h-dvh flex-col bg-[var(--chart-paper)]">
      <header className="border-b border-[var(--river-blue)]/10 px-4 py-3">
        <div className="mx-auto max-w-lg animate-pulse space-y-2">
          <div className="h-3 w-28 rounded bg-[var(--river-blue)]/15" />
          <div className="h-5 w-40 rounded bg-[var(--river-blue)]/10" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4 pb-24">
        <p className="mb-4 flex items-center gap-2 text-sm text-[var(--ink-muted)]">
          <AdminSpinner />
          {tr("loadingAdmin")}
        </p>
        <AdminSkeletonList count={5} />
      </main>
    </div>
  );
}
