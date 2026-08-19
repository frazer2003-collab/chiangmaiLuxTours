import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CONTACT } from "@/lib/types";

export function GuestLegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--chart-paper)] text-[var(--ink)]">
      <header className="border-b border-[var(--river-blue)]/12 bg-[var(--chart-paper)]/92">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-h-11 items-center gap-3">
            <Image
              src="/logo.jpeg"
              alt="Mekong Transfer"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full ring-2 ring-[var(--marker-yellow)]"
            />
            <span className="text-sm font-semibold tracking-tight">Mekong Transfer</span>
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-full bg-[var(--river-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--river-blue-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]"
          >
            Back to routes
          </Link>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-[family-name:var(--font-chart)] text-3xl tracking-[-0.02em]">
          {title}
        </h1>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-[var(--ink-muted)]">
          {children}
        </div>
        <p className="mt-10 text-sm text-[var(--ink-muted)]">
          TAT Licence ID {CONTACT.licence} · {CONTACT.email} · {CONTACT.phones[0]}
        </p>
      </main>
    </div>
  );
}
