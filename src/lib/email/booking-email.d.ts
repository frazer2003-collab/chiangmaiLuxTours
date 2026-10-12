export type BookingEmailKind = "received" | "paid" | "manual";

export type BookingEmailRecord = {
  id: string;
  guest_name: string;
  guest_email: string;
  travel_date: string;
  passengers: number;
};

export function buildBookingEmail(input: {
  kind: BookingEmailKind;
  booking: BookingEmailRecord;
  routeName: string;
  adminUrl: string;
}): {
  idempotencyKey: string;
  subject: string;
  text: string;
};

export function shouldNotifyManualConfirmation(
  previousStatus: string,
  nextStatus: string,
  stripePaymentId: string | null,
): boolean;
