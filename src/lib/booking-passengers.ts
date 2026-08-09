import type { DbBooking, GuestGender, StoredPassengerDetail } from "@/lib/db/types";
import { formatGuestFullName } from "@/lib/booking-validation";

export type { StoredPassengerDetail };

export type PassengerFormState = {
  familyName: string;
  givenName: string;
  gender: GuestGender | "";
  idNumber: string;
  nationality: string;
  dateOfBirth: string;
};

export function emptyPassengerForm(): PassengerFormState {
  return {
    familyName: "",
    givenName: "",
    gender: "",
    idNumber: "",
    nationality: "",
    dateOfBirth: "",
  };
}

export function resizePassengerForms(
  current: PassengerFormState[],
  count: number,
): PassengerFormState[] {
  const next = [...current];
  while (next.length < count) next.push(emptyPassengerForm());
  return next.slice(0, count);
}

export function passengerDisplayName(passenger: StoredPassengerDetail): string {
  return formatGuestFullName(passenger.family_name, passenger.given_name);
}

export function getBookingPassengers(booking: DbBooking): StoredPassengerDetail[] {
  const raw = booking.passengers_detail;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.filter(isStoredPassenger);
  }

  if (booking.guest_family_name || booking.guest_given_name) {
    return [
      {
        family_name: booking.guest_family_name ?? "",
        given_name: booking.guest_given_name ?? "",
        gender: booking.guest_gender ?? "na",
        id_number: booking.guest_id_number ?? "",
        nationality: booking.guest_nationality ?? "",
        date_of_birth: booking.guest_date_of_birth ?? "",
      },
    ];
  }

  if (booking.guest_name) {
    const parts = booking.guest_name.trim().split(/\s+/);
    const given = parts.pop() ?? "";
    const family = parts.join(" ");
    return [
      {
        family_name: family,
        given_name: given,
        gender: "na",
        id_number: "",
        nationality: "",
        date_of_birth: "",
      },
    ];
  }

  return [];
}

function isStoredPassenger(value: unknown): value is StoredPassengerDetail {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.family_name === "string" &&
    typeof row.given_name === "string" &&
    (row.gender === "male" || row.gender === "female" || row.gender === "na") &&
    typeof row.id_number === "string" &&
    typeof row.nationality === "string" &&
    typeof row.date_of_birth === "string"
  );
}

export function toStoredPassengerDetail(
  form: PassengerFormState,
  gender: GuestGender,
): StoredPassengerDetail {
  return {
    family_name: form.familyName.trim(),
    given_name: form.givenName.trim(),
    gender,
    id_number: form.idNumber.trim(),
    nationality: form.nationality.trim(),
    date_of_birth: form.dateOfBirth,
  };
}

/** Stub rows for additional passengers when manifest is deferred. */
export function stubPassengerDetail(index: number): StoredPassengerDetail {
  return {
    family_name: "Passenger",
    given_name: String(index + 1),
    gender: "na",
    id_number: "",
    nationality: "",
    date_of_birth: "",
  };
}
