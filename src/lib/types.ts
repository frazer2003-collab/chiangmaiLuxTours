export type TourExperience = {
  title: string;
  description: string;
};

export type Tour = {
  id: string;
  name: string;
  posterTitle: string;
  tagline: string;
  headline: string;
  intro: string;
  duration: string;
  durationDetail: string;
  route: string;
  routeDetail: string;
  from: string;
  to: string;
  perfectFor: string;
  overnightNote?: string;
  price: string;
  meetingPoint: string;
  highlights: string[];
  experiences: TourExperience[];
  itinerary: { label: string; detail: string }[];
  includes: string[];
  demoDates: string[];
  chartPosition: number;
  image: string;
  imageAlt: string;
  gallery?: { src: string; alt: string }[];
};

export type BookingDraft = {
  tourId: string;
  date: string;
  passengers: number;
  email: string;
  name: string;
};

export type BookingStep = "tour" | "date" | "details" | "payment" | "confirmed";

export const CONTACT = {
  phones: ["+66 (0) 95 102 9528", "+66 (0) 61 442 5645"],
  email: "prpbee711@gmail.com",
  licence: "21/01279",
} as const;

export const SHARED_TOUR_INTRO =
  "Glide down the Mekong River on a special slow boat journey to Luang Prabang. Relax and enjoy the stunning scenery, riverside life and unforgettable experiences along the way.";

export const SHARED_EXPERIENCES: TourExperience[] = [
  {
    title: "Mekong Scenery",
    description: "Jungle hills & riverside villages.",
  },
  {
    title: "Relax On Deck",
    description: "Open-air seating & river views.",
  },
  {
    title: "Onboard Comfort",
    description: "Cushioned covered wooden cabin.",
  },
  {
    title: "Happy Travellers",
    description: "A friendly community of slow travellers.",
  },
];

export const SHARED_PERFECT_FOR =
  "Scenery lovers, photographers & slow travellers";

export const SHARED_DURATION_DETAIL =
  "Approx. 8–10 hrs · varies by season";

export const SHARED_INCLUDES = [
  "Hotel transfer included",
  "Covered wooden slow boat",
  "Scenic Mekong River route",
  "Friendly local crew",
];
