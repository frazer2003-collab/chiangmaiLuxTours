import { CONTACT } from "@/lib/types";

export const PAY_NOW_HOLD =
  "Pay now holds your seats, then Stripe takes payment. Closing Stripe without paying releases them.";

export const CHANGE_CANCEL_SUMMARY =
  "To change or cancel after payment, WhatsApp us before departure. We handle that case by case — we do not promise an automatic refund.";

export const PASSPORT_PRIVACY_SUMMARY =
  "Passport and ID details are for the passenger manifest and border crossing. Stripe processes payment. We do not store your card number.";

export const DATES_UNAVAILABLE =
  "Open dates are unavailable right now. WhatsApp us to reserve a departure.";

export const BOOKING_SAVE_FAILED =
  "We could not save this booking right now. WhatsApp us to reserve, or try again in a moment.";

export const CHANGE_CANCEL_FAQ = `WhatsApp ${CONTACT.phones[0]} or email ${CONTACT.email} before departure. We confirm what we can do for your booking — changes are handled case by case, not as an automatic refund. If you close Stripe without paying, your seats are released.`;
