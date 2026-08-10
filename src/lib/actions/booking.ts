"use server";

import {
  isGuestGender,
  normalizeEmail,
  normalizeGuestText,
  normalizeIdNumber,
  validateDate,
  validatePassengerForms,
} from "@/lib/booking-validation";
import { toStoredPassengerDetail } from "@/lib/booking-passengers";
import type { PassengerFormState } from "@/lib/booking-passengers";
import { createServiceClient } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type SubmitBookingResult =
  | { ok: true; bookingId: string }
  | { ok: false; error: string };

function mapBookingRpcError(message: string): string | null {
  if (message.includes("date_not_available")) {
    return "That date is no longer available.";
  }
  if (message.includes("not_enough_capacity")) {
    return "Not enough seats left for that date. Choose another date or fewer passengers.";
  }
  if (
    message.includes("invalid_passengers_detail") ||
    message.includes("invalid_passenger_identity")
  ) {
    return "Check every passenger's details and try again.";
  }
  if (
    message.includes("Could not find the function") ||
    message.includes("does not exist") ||
    message.includes("PGRST202")
  ) {
    return "Booking database is out of date. Run Supabase migrations through 20260809120000_booking_all_passengers.sql in the SQL editor.";
  }
  return null;
}

export async function submitBooking(input: {
  tourId: string;
  date: string;
  passengers: number;
  passengerForms: PassengerFormState[];
  email: string;
  allowedDates: string[];
}): Promise<SubmitBookingResult> {
  const dateError = validateDate(input.date, input.allowedDates);
  if (dateError) return { ok: false, error: dateError };

  const passengerCount = Math.min(12, Math.max(1, Math.floor(input.passengers)));

  const validationError = validatePassengerForms(
    input.passengerForms,
    passengerCount,
    input.email,
  );
  if (validationError) return { ok: false, error: validationError };

  const passengersDetail = input.passengerForms.slice(0, passengerCount).map((form) => {
    if (!isGuestGender(form.gender)) {
      throw new Error("invalid gender");
    }
    return toStoredPassengerDetail(form, form.gender);
  });

  for (const row of passengersDetail) {
    row.family_name = normalizeGuestText(row.family_name, 80);
    row.given_name = normalizeGuestText(row.given_name, 80);
    row.id_number = normalizeIdNumber(row.id_number);
    row.nationality = normalizeGuestText(row.nationality, 60);
  }

  const guestEmail = normalizeEmail(input.email);

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "Live booking is not configured yet. Contact us by phone or email to reserve.",
    };
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.rpc("create_booking", {
      p_tour_id: input.tourId,
      p_date: input.date,
      p_passengers: passengerCount,
      p_guest_email: guestEmail,
      p_passengers_detail: passengersDetail,
    });

    if (error) {
      console.error("create_booking RPC failed:", error.message, error.code);
      return {
        ok: false,
        error: mapBookingRpcError(error.message) ?? "Could not save booking. Please try again.",
      };
    }

    if (data == null) {
      return { ok: false, error: "Could not save booking. Please try again." };
    }

    return { ok: true, bookingId: String(data) };
  } catch (error) {
    console.error("submitBooking error:", error);
    if (error instanceof Error && error.message.includes("Supabase service role")) {
      return {
        ok: false,
        error: "Live booking is not configured yet. Contact us by phone or email to reserve.",
      };
    }
    return { ok: false, error: "Could not save booking. Please try again." };
  }
}
