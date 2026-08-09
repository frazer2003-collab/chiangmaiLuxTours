"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  describeSupabaseConfigProblem,
  isSupabasePublicConfigured,
} from "@/lib/supabase/env";
import { hasStaffRole } from "@/lib/auth/staff-check";
import { mapLoginError } from "@/lib/auth/login-errors";
import { AdminSpinner } from "./AdminFeedback";
import type { DbBooking, DbTourDate } from "@/lib/db/types";
import { AdminLocaleProvider, useAdminLocale } from "./AdminLocaleProvider";
import type { TranslationKey } from "./i18n";
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

  const tabs: { id: Tab; label: string; hint: TranslationKey; badge?: number }[] = [
    { id: "bookings", label: tr("bookings"), hint: "tabBookingsHint", badge: pendingCount || undefined },
    { id: "dates", label: tr("dates"), hint: "tabDatesHint" },
    { id: "tours", label: tr("tours"), hint: "tabToursHint" },
  ];

  const activeTab = tabs.find((item) => item.id === tab) ?? tabs[0];

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
        <div
          className="mb-4 rounded-2xl bg-white px-4 py-3 ring-2 ring-[var(--marker-yellow)]/35 ring-offset-2 ring-offset-[var(--chart-paper)]"
          aria-live="polite"
        >
          <h2 className="text-lg font-semibold text-[var(--ink)]">{activeTab.label}</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">{tr(activeTab.hint)}</p>
        </div>

        <div
          key={tab}
          role="tabpanel"
          id="admin-panel"
          aria-labelledby={`admin-tab-${tab}`}
          className="admin-tab-panel"
        >
          {tab === "bookings" ? (
            <BookingsTab initialBookings={bookings} />
          ) : null}
          {tab === "dates" ? <DatesTab initialDatesByTour={datesByTour} /> : null}
          {tab === "tours" ? <ToursTab initialPrices={prices} /> : null}
        </div>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-10 border-t border-[var(--river-blue)]/15 bg-white/95 shadow-[0_-8px_24px_-12px_rgba(15,39,64,0.18)] backdrop-blur-sm"
        aria-label={tr("adminSections")}
      >
        <div
          className="mx-auto grid max-w-lg grid-cols-3 gap-1.5 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          role="tablist"
        >
          {tabs.map((item) => {
            const active = tab === item.id;
            return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`admin-tab-${item.id}`}
              aria-selected={active}
              aria-controls="admin-panel"
              onClick={() => setTab(item.id)}
              className={`relative flex min-h-[3.25rem] flex-col items-center justify-center rounded-xl px-2 text-xs font-semibold transition duration-150 ${
                active
                  ? "bg-[var(--river-blue)] text-white shadow-[0_6px_16px_-6px_rgba(37,99,168,0.65)]"
                  : "text-[var(--ink-muted)] hover:bg-[var(--river-blue)]/6 hover:text-[var(--ink)]"
              }`}
            >
              {active ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 top-1 h-1 rounded-full bg-[var(--marker-yellow)]"
                />
              ) : null}
              {item.label}
              {item.badge ? (
                <span
                  className={`absolute right-2 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                    active
                      ? "bg-[var(--marker-yellow)] text-[var(--ink)]"
                      : "bg-[var(--marker-yellow)] text-[var(--ink)]"
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
            );
          })}
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
  const { locale, tr } = useAdminLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const configProblem = describeSupabaseConfigProblem();
    if (configProblem) {
      console.error("[admin login]", configProblem);
      setError(tr("loginSetupUnavailable"));
      return;
    }
    if (!configured || !isSupabasePublicConfigured()) {
      setError(tr("loginSetupUnavailable"));
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          console.error("[admin login]", signInError.message);
          setError(mapLoginError(locale, signInError.message));
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (hasStaffRole(user)) {
          router.replace("/admin");
          router.refresh();
          return;
        }

        const { data: staffRow, error: staffError } = await supabase
          .from("staff_emails")
          .select("email")
          .eq("email", user!.email!.toLowerCase())
          .maybeSingle();

        if (staffError) {
          console.error("[admin login]", staffError.message);
          setError(tr("loginAccessCheckFailed"));
          await supabase.auth.signOut();
          return;
        }

        if (!staffRow) {
          await supabase.auth.signOut();
          setError(tr("loginNotStaff"));
          return;
        }

        router.replace("/admin");
        router.refresh();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[admin login]", msg);
        setError(mapLoginError(locale, msg));
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
            <p className="mt-1 text-sm text-[var(--ink-muted)]">{tr("loginSubtitle")}</p>
          </div>
          <LanguageToggle />
        </div>

        {!configured ? (
          <p className="mb-4 text-sm text-[var(--ink-muted)]" role="status">
            {tr("loginSetupUnavailable")}
          </p>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-disabled={!configured || pending}
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              {tr("email")}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              disabled={!configured || pending}
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
              disabled={!configured || pending}
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
            disabled={pending || !configured}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--river-blue)] text-sm font-semibold text-white hover:bg-[var(--river-blue-deep)] disabled:opacity-50"
          >
            {pending ? <AdminSpinner className="h-4 w-4 text-white" /> : null}
            {pending ? tr("signingIn") : tr("signIn")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--ink-muted)]">
          <Link href="/" className="text-[var(--river-blue)] underline-offset-2 hover:underline">
            ← {tr("backToSite")}
          </Link>
        </p>
      </div>
    </div>
  );
}
