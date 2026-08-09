export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";

export type DbTour = {
  id: string;
  price_thb: number;
  updated_at: string;
};

export type DbTourDate = {
  id: string;
  tour_id: string;
  date: string;
  capacity: number;
  booked_count: number;
  created_at: string;
};

export type DbBooking = {
  id: string;
  tour_id: string;
  tour_date_id: string | null;
  travel_date: string;
  passengers: number;
  guest_name: string;
  guest_email: string;
  status: BookingStatus;
  internal_notes: string;
  refund_note: string;
  stripe_payment_id: string | null;
  created_at: string;
  updated_at: string;
};

export type AvailableDate = {
  date: string;
  spotsLeft: number;
  capacity: number;
};

export type CatalogTourDate = AvailableDate & {
  id?: string;
};

export function formatPriceThb(amount: number): string {
  return `฿${amount.toLocaleString("en-US")} / person`;
}

export function parsePriceThbFromLabel(label: string): number {
  const digits = label.replace(/[^\d]/g, "");
  return Number.parseInt(digits, 10) || 0;
}

const ACTIVE_STATUSES: BookingStatus[] = ["pending", "confirmed"];

export function bookingCountsTowardCapacity(status: BookingStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}
