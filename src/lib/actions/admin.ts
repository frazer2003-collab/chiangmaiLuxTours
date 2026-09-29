"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth/staff";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  bookingCountsTowardCapacity,
  type BookingStatus,
  type DbBooking,
  type DbTourDate,
} from "@/lib/db/types";
import {
  closedCapacity,
  validateBatchDates,
} from "@/lib/admin-date-schedule";

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function fetchAdminBookings(): Promise<
  ActionResult<DbBooking[]>
> {
  try {
    const { supabase } = await requireStaff();
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []) as DbBooking[] };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function fetchAdminTourDates(
  tourId: string,
): Promise<ActionResult<DbTourDate[]>> {
  try {
    const { supabase } = await requireStaff();
    const { data, error } = await supabase
      .from("tour_dates")
      .select("*")
      .eq("tour_id", tourId)
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date");

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []) as DbTourDate[] };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function fetchAdminTourPrices(): Promise<
  ActionResult<{ id: string; price_thb: number }[]>
> {
  try {
    const { supabase } = await requireStaff();
    const { data, error } = await supabase.from("tours").select("id, price_thb");
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: data ?? [] };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function updateBooking(input: {
  id: string;
  status: BookingStatus;
  internalNotes: string;
  refundNote: string;
}): Promise<ActionResult> {
  try {
    const { supabase } = await requireStaff();

    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", input.id)
      .single();

    if (fetchError || !existing) {
      return { ok: false, error: "Booking not found." };
    }

    const prev = existing as DbBooking;
    const wasActive = bookingCountsTowardCapacity(prev.status);
    const willBeActive = bookingCountsTowardCapacity(input.status);
    const delta =
      (willBeActive ? prev.passengers : 0) - (wasActive ? prev.passengers : 0);

    if (delta !== 0 && prev.tour_date_id) {
      const { data: dateRow, error: dateError } = await supabase
        .from("tour_dates")
        .select("booked_count, capacity")
        .eq("id", prev.tour_date_id)
        .single();

      if (dateError || !dateRow) {
        return { ok: false, error: "Could not update seat count." };
      }

      const nextCount = dateRow.booked_count + delta;
      if (nextCount < 0 || nextCount > dateRow.capacity) {
        return {
          ok: false,
          error: "Not enough capacity to restore this booking.",
        };
      }

      const { error: countError } = await supabase
        .from("tour_dates")
        .update({ booked_count: nextCount })
        .eq("id", prev.tour_date_id);

      if (countError) return { ok: false, error: countError.message };
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: input.status,
        internal_notes: input.internalNotes.slice(0, 500),
        refund_note: input.refundNote.slice(0, 500),
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id);

    if (updateError) return { ok: false, error: updateError.message };

    await revalidateAdmin();
    return { ok: true };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function markBookingRefunded(input: {
  id: string;
  refundNote: string;
}): Promise<ActionResult> {
  try {
    const { supabase } = await requireStaff();
    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", input.id)
      .single();

    if (fetchError || !existing) {
      return { ok: false, error: "Booking not found." };
    }

    const prev = existing as DbBooking;
    if (prev.status === "refunded") return { ok: true };

    const result = await updateBooking({
      id: input.id,
      status: "refunded",
      internalNotes: prev.internal_notes,
      refundNote: input.refundNote.slice(0, 500),
    });

    return result;
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function updateTourPrice(input: {
  tourId: string;
  priceThb: number;
}): Promise<ActionResult> {
  try {
    const { supabase } = await requireStaff();
    const price = Math.floor(input.priceThb);
    if (price <= 0) return { ok: false, error: "Enter a valid price." };

    const { error } = await supabase
      .from("tours")
      .update({ price_thb: price, updated_at: new Date().toISOString() })
      .eq("id", input.tourId);

    if (error) return { ok: false, error: error.message };
    await revalidateAdmin();
    return { ok: true };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function addTourDate(input: {
  tourId: string;
  date: string;
  capacity: number;
}): Promise<ActionResult> {
  try {
    const { supabase } = await requireStaff();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      return { ok: false, error: "Invalid date." };
    }
    const capacity = Math.max(0, Math.floor(input.capacity));
    if (capacity <= 0) return { ok: false, error: "Capacity must be at least 1." };

    const { error } = await supabase.from("tour_dates").insert({
      tour_id: input.tourId,
      date: input.date,
      capacity,
      booked_count: 0,
    });

    if (error) {
      if (error.code === "23505") {
        return { ok: false, error: "That date already exists for this tour." };
      }
      return { ok: false, error: error.message };
    }

    await revalidateAdmin();
    return { ok: true };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function addTourDates(input: {
  tourId: string;
  dates: string[];
  capacity: number;
}): Promise<ActionResult<{ added: number; skipped: number }>> {
  try {
    const { supabase } = await requireStaff();
    const validated = validateBatchDates(
      input.dates,
      new Date().toISOString().slice(0, 10),
    );
    if (!validated.ok) {
      return { ok: false, error: "Choose a valid future date range." };
    }

    const capacity = Math.floor(input.capacity);
    if (capacity <= 0 || capacity > 999) {
      return { ok: false, error: "Capacity must be between 1 and 999." };
    }

    const rows = validated.dates.map((date) => ({
      tour_id: input.tourId,
      date,
      capacity,
      booked_count: 0,
    }));
    const { data, error } = await supabase
      .from("tour_dates")
      .upsert(rows, {
        onConflict: "tour_id,date",
        ignoreDuplicates: true,
      })
      .select("id");

    if (error) return { ok: false, error: error.message };

    const added = data?.length ?? 0;
    await revalidateAdmin();
    return {
      ok: true,
      data: { added, skipped: validated.dates.length - added },
    };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function updateTourDateCapacity(input: {
  id: string;
  capacity: number;
}): Promise<ActionResult> {
  try {
    const { supabase } = await requireStaff();
    const capacity = Math.max(0, Math.floor(input.capacity));

    const { data: row, error: fetchError } = await supabase
      .from("tour_dates")
      .select("booked_count")
      .eq("id", input.id)
      .single();

    if (fetchError || !row) return { ok: false, error: "Date not found." };
    if (capacity < row.booked_count) {
      return {
        ok: false,
        error: `Capacity cannot be below ${row.booked_count} (already booked).`,
      };
    }

    const { error } = await supabase
      .from("tour_dates")
      .update({ capacity })
      .eq("id", input.id);

    if (error) return { ok: false, error: error.message };
    await revalidateAdmin();
    return { ok: true };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function removeTourDate(input: {
  id: string;
  force?: boolean;
}): Promise<ActionResult> {
  try {
    const { supabase } = await requireStaff();
    const { data: row, error: fetchError } = await supabase
      .from("tour_dates")
      .select("booked_count")
      .eq("id", input.id)
      .single();

    if (fetchError || !row) return { ok: false, error: "Date not found." };

    if (row.booked_count > 0 && !input.force) {
      return {
        ok: false,
        error: "This date has bookings. Close it (capacity 0) instead, or confirm removal.",
      };
    }

    const { error } = await supabase
      .from("tour_dates")
      .delete()
      .eq("id", input.id);

    if (error) return { ok: false, error: error.message };
    await revalidateAdmin();
    return { ok: true };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function closeTourDate(input: { id: string }): Promise<ActionResult> {
  try {
    const { supabase } = await requireStaff();
    const { data: row, error: fetchError } = await supabase
      .from("tour_dates")
      .select("booked_count")
      .eq("id", input.id)
      .single();

    if (fetchError || !row) return { ok: false, error: "Date not found." };

    const { error } = await supabase
      .from("tour_dates")
      .update({ capacity: closedCapacity(row.booked_count) })
      .eq("id", input.id);

    if (error) return { ok: false, error: error.message };
    await revalidateAdmin();
    return { ok: true };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function removeTourDates(input: {
  ids: string[];
}): Promise<ActionResult<{ removed: number; closed: number }>> {
  try {
    const { supabase } = await requireStaff();
    const ids = [...new Set(input.ids.filter(Boolean))];
    if (ids.length === 0 || ids.length > 366) {
      return { ok: false, error: "Select between 1 and 366 dates." };
    }

    const { data, error: fetchError } = await supabase
      .from("tour_dates")
      .select("id, booked_count")
      .in("id", ids);

    if (fetchError) return { ok: false, error: fetchError.message };
    if (!data || data.length !== ids.length) {
      return { ok: false, error: "One or more dates could not be found." };
    }

    const emptyIds = data.filter((row) => row.booked_count === 0).map((row) => row.id);
    const bookedRows = data.filter((row) => row.booked_count > 0);

    const closeResults = await Promise.all(
      bookedRows.map((row) =>
        supabase
          .from("tour_dates")
          .update({ capacity: closedCapacity(row.booked_count) })
          .eq("id", row.id),
      ),
    );
    const closeError = closeResults.find((result) => result.error)?.error;
    if (closeError) return { ok: false, error: closeError.message };

    if (emptyIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("tour_dates")
        .delete()
        .in("id", emptyIds);
      if (deleteError) return { ok: false, error: deleteError.message };
    }

    await revalidateAdmin();
    return {
      ok: true,
      data: { removed: emptyIds.length, closed: bookedRows.length },
    };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}

export async function signOutAdmin(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    /* ignore */
  }
  revalidatePath("/admin");
}
