"use server";

import {
  normalizeEmail,
  normalizeName,
  validateDate,
  validateEmail,
  validateName,
} from "@/lib/booking-validation";
import { createServiceClient } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type SubmitBookingResult =
  | { ok: true; bookingId: string }
  | { ok: false; error: string };

export async function submitBooking(input: {
  tourId: string;
  date: string;
  passengers: number;
  name: string;
  email: string;
  allowedDates: string[];
}): Promise<SubmitBookingResult> {
  const dateError = validateDate(input.date, input.allowedDates);
  if (dateError) return { ok: false, error: dateError };

  const nameError = validateName(input.name);
  if (nameError) return { ok: false, error: nameError };

  const emailError = validateEmail(input.email);
  if (emailError) return { ok: false, error: emailError };

  const passengers = Math.min(12, Math.max(1, Math.floor(input.passengers)));
  const guestName = normalizeName(input.name);
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
      p_passengers: passengers,
      p_guest_name: guestName,
      p_guest_email: guestEmail,
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
      return { ok: false, error: "Could not save booking. Please try again." };
    }

    return { ok: true, bookingId: String(data) };
  } catch {
    return { ok: false, error: "Could not save booking. Please try again." };
  }
}
