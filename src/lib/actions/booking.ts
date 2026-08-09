"use server";

import {
  isGuestGender,
  normalizeEmail,
  normalizeGuestText,
  validateLeadGuestBooking,
  validateDate,
} from "@/lib/booking-validation";
import { stubPassengerDetail, toStoredPassengerDetail } from "@/lib/booking-passengers";
import type { PassengerFormState } from "@/lib/booking-passengers";
import { createServiceClient } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type SubmitBookingResult =
  | { ok: true; bookingId: string }
  | { ok: false; error: string };

export async function submitBooking(input: {
  tourId: string;
  date: string;
  passengers: number;
  leadGuest: { familyName: string; givenName: string };
  email: string;
  allowedDates: string[];
}): Promise<SubmitBookingResult> {
  const dateError = validateDate(input.date, input.allowedDates);
  if (dateError) return { ok: false, error: dateError };

  const passengerCount = Math.min(12, Math.max(1, Math.floor(input.passengers)));

  const validationError = validateLeadGuestBooking(input.leadGuest, input.email);
  if (validationError) return { ok: false, error: validationError };

  const leadForm: PassengerFormState = {
    familyName: input.leadGuest.familyName,
    givenName: input.leadGuest.givenName,
    gender: "na",
    idNumber: "",
    nationality: "",
    dateOfBirth: "",
  };

  const passengersDetail = [
    toStoredPassengerDetail(leadForm, "na"),
    ...Array.from({ length: passengerCount - 1 }, (_, i) => stubPassengerDetail(i + 1)),
  ];

  passengersDetail[0].family_name = normalizeGuestText(passengersDetail[0].family_name, 80);
  passengersDetail[0].given_name = normalizeGuestText(passengersDetail[0].given_name, 80);

  if (!isGuestGender(passengersDetail[0].gender)) {
    passengersDetail[0].gender = "na";
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
      if (error.message.includes("date_not_available")) {
        return { ok: false, error: "That date is no longer available." };
      }
      if (error.message.includes("not_enough_capacity")) {
        return {
          ok: false,
          error: "Not enough seats left for that date. Choose another date or fewer passengers.",
        };
      }
      if (
        error.message.includes("invalid_passengers_detail") ||
        error.message.includes("invalid_passenger_identity")
      ) {
        return { ok: false, error: "Check the lead guest name and try again." };
      }
      return { ok: false, error: "Could not save booking. Please try again." };
    }

    return { ok: true, bookingId: String(data) };
  } catch {
    return { ok: false, error: "Could not save booking. Please try again." };
  }
}
