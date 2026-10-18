import type { SupabaseClient } from "@supabase/supabase-js";
import type { BookingStatus, DbBooking } from "@/lib/db/types";

type StatusClient = SupabaseClient;

export async function setBookingStatus(
  supabase: StatusClient,
  prev: DbBooking,
  input: {
    status: BookingStatus;
    internalNotes: string;
    refundNote: string;
    stripeRefundId?: string | null;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabase.rpc("apply_booking_status", {
    p_booking_id: prev.id,
    p_status: input.status,
    p_internal_notes: input.internalNotes.slice(0, 500),
    p_refund_note: input.refundNote.slice(0, 500),
    p_stripe_refund_id: input.stripeRefundId ?? null,
  });

  if (!error) return { ok: true };
  return { ok: false, error: bookingStatusError(error.message) };
}

function bookingStatusError(message: string): string {
  if (message.includes("unauthorized")) return "Unauthorized";
  if (message.includes("not_enough_capacity")) {
    return "Not enough capacity to restore this booking.";
  }
  if (message.includes("booking_not_found")) return "Booking not found.";
  if (message.includes("date_missing")) return "Could not update seat count.";
  return message;
}
