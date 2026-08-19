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
import { getCatalog, getTourFromCatalog } from "@/lib/tour-catalog";
import { BOOKING_SAVE_FAILED, DATES_UNAVAILABLE } from "@/lib/guest-legal";

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
    return BOOKING_SAVE_FAILED;
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
  const catalog = await getCatalog();
  if (!catalog.inventoryLive) {
    return { ok: false, error: DATES_UNAVAILABLE };
  }

  const tour = getTourFromCatalog(catalog.tours, input.tourId);
  if (!tour) {
    return { ok: false, error: "That route is no longer available." };
  }

  const liveDates = tour.availableDates.map((slot) => slot.date);
  const dateError = validateDate(input.date, liveDates);
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
    return { ok: false, error: DATES_UNAVAILABLE };
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
        error: mapBookingRpcError(error.message) ?? BOOKING_SAVE_FAILED,
      };
    }

    if (data == null) {
      return { ok: false, error: BOOKING_SAVE_FAILED };
    }

    return { ok: true, bookingId: String(data) };
  } catch (error) {
    console.error("submitBooking error:", error);
    if (error instanceof Error && error.message.includes("Supabase service role")) {
      return {
        ok: false,
        error: DATES_UNAVAILABLE,
      };
    }
    return { ok: false, error: BOOKING_SAVE_FAILED };
  }
}
