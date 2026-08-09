"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DbBooking, DbTourDate } from "@/lib/db/types";
import { AdminLocaleProvider, useAdminLocale } from "./AdminLocaleProvider";
import { LanguageToggle } from "./LanguageToggle";
import { BookingsTab } from "./BookingsTab";
import { DatesTab } from "./DatesTab";
import { ToursTab } from "./ToursTab";

type Tab = "bookings" | "dates" | "tours";

function AdminShellInner({
  bookings,
  datesByTour,
  prices,
  pendingCount,
}: {
  bookings: DbBooking[];
  datesByTour: Record<string, DbTourDate[]>;
  prices: Record<string, number>;
  pendingCount: number;
}) {
  const { tr } = useAdminLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signingOut, startSignOut] = useTransition();

  const tab = (searchParams.get("tab") as Tab) || "bookings";

  function setTab(next: Tab) {
    router.replace(`/admin?tab=${next}`, { scroll: false });
  }

  function signOut() {
    startSignOut(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/admin/login");
      router.refresh();
    });
  }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "bookings", label: tr("bookings"), badge: pendingCount || undefined },
    { id: "dates", label: tr("dates") },
    { id: "tours", label: tr("tours") },
  ];

  return (
    <div className="chart-grid flex min-h-dvh flex-col bg-[var(--chart-paper)]">
      <header className="sticky top-0 z-10 border-b border-[var(--river-blue)]/10 bg-[var(--chart-paper)]/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--river-blue)]">
              {tr("appName")}
            </p>
            <h1 className="text-lg font-semibold text-[var(--ink)]">{tr("adminTitle")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              type="button"
              disabled={signingOut}
              onClick={signOut}
              className="min-h-10 rounded-full px-3 text-sm font-medium text-[var(--river-blue)] hover:bg-[var(--river-blue)]/8"
            >
              {tr("signOut")}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4 pb-24">
        {tab === "bookings" ? (
          <BookingsTab initialBookings={bookings} />
        ) : null}
        {tab === "dates" ? <DatesTab initialDatesByTour={datesByTour} /> : null}
        {tab === "tours" ? <ToursTab initialPrices={prices} /> : null}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-10 border-t border-[var(--river-blue)]/10 bg-white/95 backdrop-blur-sm"
        aria-label="Admin sections"
      >
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-1 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`relative flex min-h-12 flex-col items-center justify-center rounded-xl px-2 text-xs font-semibold transition ${
                tab === item.id
                  ? "bg-[var(--river-blue)]/10 text-[var(--river-blue-deep)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {item.label}
              {item.badge ? (
                <span className="absolute right-3 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--marker-yellow)] px-1 text-[10px] font-bold text-[var(--ink)]">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function AdminShell(props: {
  bookings: DbBooking[];
  datesByTour: Record<string, DbTourDate[]>;
  prices: Record<string, number>;
  pendingCount: number;
}) {
  return (
    <AdminLocaleProvider>
      <AdminShellInner {...props} />
    </AdminLocaleProvider>
  );
}

export function AdminLoginForm({ configured }: { configured: boolean }) {
  return (
    <AdminLocaleProvider>
      <AdminLoginFormInner configured={configured} />
    </AdminLocaleProvider>
  );
}

function AdminLoginFormInner({ configured }: { configured: boolean }) {
  const { tr } = useAdminLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!configured) {
      setError(tr("supabaseMissing"));
      return;
    }
    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(tr("loginError"));
          return;
        }
        router.replace("/admin");
        router.refresh();
      } catch {
        setError(tr("loginError"));
      }
    });
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--chart-paper)] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_14px_40px_-22px_rgba(27,61,92,0.45)] ring-1 ring-[var(--river-blue)]/10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--river-blue)]">
              {tr("appName")}
            </p>
            <h1 className="text-xl font-semibold text-[var(--ink)]">{tr("adminTitle")}</h1>
          </div>
          <LanguageToggle />
        </div>

        {!configured ? (
          <p className="mb-4 text-sm text-[var(--ink-muted)]">{tr("supabaseMissing")}</p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              {tr("email")}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-[var(--river-blue)]/20 px-3 text-base"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              {tr("password")}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-[var(--river-blue)]/20 px-3 text-base"
            />
          </div>
          {error ? (
            <p className="text-sm text-[var(--river-blue-deep)]" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="min-h-11 w-full rounded-full bg-[var(--river-blue)] text-sm font-semibold text-white hover:bg-[var(--river-blue-deep)] disabled:opacity-50"
          >
            {tr("signIn")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--ink-muted)]">
          <Link href="/" className="text-[var(--river-blue)] underline-offset-2 hover:underline">
            ← Site
          </Link>
        </p>
      </div>
    </div>
  );
}
