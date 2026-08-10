"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function BookingCancelledNotice() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("booking") === "cancelled") {
      setVisible(true);
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div
      className="border-b border-[var(--marker-yellow)]/40 bg-[var(--marker-yellow)]/15 px-4 py-3 text-center text-sm text-[var(--ink)]"
      role="status"
    >
      Payment was cancelled. Your seats were released — choose a route to try again.
      <button
        type="button"
        className="ml-2 font-semibold text-[var(--river-blue)] underline-offset-2 hover:underline"
        onClick={() => setVisible(false)}
      >
        Dismiss
      </button>
    </div>
  );
}
