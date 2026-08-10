import Link from "next/link";
import { getCheckoutSessionSummary } from "@/lib/actions/checkout";
import { formatThbTotal } from "@/lib/stripe/env";

export default async function BookingCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const summary = sessionId ? await getCheckoutSessionSummary(sessionId) : null;

  const paid = summary?.paid ?? false;

  return (
    <main className="min-h-screen bg-[var(--chart-paper)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg rounded-2xl border border-[var(--river-blue)]/15 bg-white p-8 text-center shadow-[0_14px_40px_-22px_rgba(27,61,92,0.35)]">
        {paid ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--marker-yellow)] text-[var(--ink)]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-5 font-[family-name:var(--font-chart)] text-2xl tracking-[-0.02em] text-[var(--ink)]">
              Booking confirmed
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
              Payment received
              {summary?.totalThb ? ` (${formatThbTotal(summary.totalThb)})` : ""}.
              {summary?.email ? (
                <>
                  {" "}
                  Confirmation will be sent to{" "}
                  <strong className="text-[var(--ink)]">{summary.email}</strong> when email is
                  connected.
                </>
              ) : null}
            </p>
            {summary?.tourName ? (
              <p className="mt-2 text-sm font-medium text-[var(--river-blue)]">{summary.tourName}</p>
            ) : null}
          </>
        ) : (
          <>
            <h1 className="font-[family-name:var(--font-chart)] text-2xl tracking-[-0.02em] text-[var(--ink)]">
              Payment pending
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
              We could not verify your payment yet. If you completed checkout, refresh this page
              in a moment or contact us with your booking reference.
            </p>
          </>
        )}
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[var(--river-blue)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--river-blue-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
        >
          Back to routes
        </Link>
      </div>
    </main>
  );
}
