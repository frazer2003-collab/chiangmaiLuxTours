import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getStaffSession } from "@/lib/auth/staff";
import { tours } from "@/lib/tours";
import type { DbBooking, DbTourDate } from "@/lib/db/types";
import { parsePriceThbFromLabel } from "@/lib/db/types";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getStaffSession();
  if (!session.user || !session.isStaff || !session.supabase) {
    redirect("/admin/login");
  }

  const { supabase } = session;
  const today = new Date().toISOString().slice(0, 10);

  const [bookingsRes, datesRes, pricesRes] = await Promise.all([
    supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    supabase
      .from("tour_dates")
      .select("*")
      .gte("date", today)
      .order("date"),
    supabase.from("tours").select("id, price_thb"),
  ]);

  const bookings = (bookingsRes.data ?? []) as DbBooking[];
  const datesByTour: Record<string, DbTourDate[]> = {};
  for (const row of (datesRes.data ?? []) as DbTourDate[]) {
    const list = datesByTour[row.tour_id] ?? [];
    list.push(row);
    datesByTour[row.tour_id] = list;
  }

  const prices: Record<string, number> = {};
  for (const tour of tours) {
    prices[tour.id] = parsePriceThbFromLabel(tour.price);
  }
  for (const row of pricesRes.data ?? []) {
    prices[row.id] = row.price_thb;
  }

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <Suspense fallback={null}>
      <AdminShell
        bookings={bookings}
        datesByTour={datesByTour}
        prices={prices}
        pendingCount={pendingCount}
      />
    </Suspense>
  );
}
