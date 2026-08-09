import type { BookingStatus } from "@/lib/db/types";
import type { AdminLocale } from "./i18n";
import { statusLabel } from "./i18n";

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-[var(--marker-yellow)]/25 text-[var(--ink)]",
  confirmed: "bg-[var(--river-blue)]/12 text-[var(--river-blue-deep)]",
  cancelled: "bg-[var(--ink-muted)]/15 text-[var(--ink-muted)]",
  refunded: "bg-[var(--river-navy)]/10 text-[var(--river-navy)]",
};

export function StatusChip({
  status,
  locale,
}: {
  status: BookingStatus;
  locale: AdminLocale;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabel(locale, status)}
    </span>
  );
}
