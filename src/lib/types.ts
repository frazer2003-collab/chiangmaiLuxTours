export type Tour = {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  route: string;
  from: string;
  to: string;
  priceNote: string;
  meetingPoint: string;
  highlights: string[];
  itinerary: { label: string; detail: string }[];
  includes: string[];
  demoDates: string[];
  chartPosition: number;
};

export type BookingDraft = {
  tourId: string;
  date: string;
  passengers: number;
  email: string;
  name: string;
};

export type BookingStep = "tour" | "date" | "details" | "payment" | "confirmed";
