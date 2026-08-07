import type { Tour } from "./types";

export const tours: Tour[] = [
  {
    id: "slow-boat-down",
    name: "Slow Boat: Huay Xai → Luang Prabang",
    tagline: "The classic two-day Mekong journey downstream",
    duration: "2 days · 1 night in Pak Beng",
    route: "Huay Xai → Pak Beng → Luang Prabang",
    from: "Huay Xai",
    to: "Luang Prabang",
    priceNote: "Price placeholder — confirmed before payment goes live",
    meetingPoint: "Huay Xai pier (Bokeo Province)",
    highlights: [
      "Overnight stop in Pak Beng",
      "Scenic Mekong gorge sections",
      "Licensed operator · TAT 21/01279",
    ],
    itinerary: [
      {
        label: "Day 1",
        detail: "Depart Huay Xai morning. River day with lunch on board. Arrive Pak Beng evening.",
      },
      {
        label: "Day 2",
        detail: "Continue downstream to Luang Prabang. Arrive afternoon.",
      },
    ],
    includes: [
      "Boat passage per published schedule",
      "Meeting point directions (placeholder)",
      "Email booking confirmation",
    ],
    demoDates: ["2026-08-15", "2026-08-22", "2026-09-05", "2026-09-12"],
    chartPosition: 1,
  },
  {
    id: "slow-boat-up",
    name: "Slow Boat: Luang Prabang → Huay Xai",
    tagline: "Reverse the classic corridor at an easy pace",
    duration: "2 days · 1 night in Pak Beng",
    route: "Luang Prabang → Pak Beng → Huay Xai",
    from: "Luang Prabang",
    to: "Huay Xai",
    priceNote: "Price placeholder — confirmed before payment goes live",
    meetingPoint: "Luang Prabang pier",
    highlights: [
      "Same river experience, upstream schedule",
      "Ideal if your route continues to Thailand",
      "Licensed operator · TAT 21/01279",
    ],
    itinerary: [
      {
        label: "Day 1",
        detail: "Depart Luang Prabang. Overnight Pak Beng.",
      },
      {
        label: "Day 2",
        detail: "Arrive Huay Xai for border or overland connections.",
      },
    ],
    includes: [
      "Boat passage per published schedule",
      "Meeting point directions (placeholder)",
      "Email booking confirmation",
    ],
    demoDates: ["2026-08-18", "2026-08-25", "2026-09-08"],
    chartPosition: 2,
  },
  {
    id: "connection-package",
    name: "Thailand ↔ Laos Connection",
    tagline: "Transfer and border crossing to reach the river",
    duration: "1–2 days depending on hub",
    route: "Chiang Mai / Chiang Rai / Chiang Khong → Mekong corridor",
    from: "Your chosen hub",
    to: "Huay Xai or Chiang Khong pier",
    priceNote: "Price placeholder — varies by hub",
    meetingPoint: "Chiang Mai, Chiang Rai, Chiang Khong, or Huay Xai Village",
    highlights: [
      "Hotel pickup available (placeholder schedule)",
      "Border crossing assistance",
      "Connects to slow boat departures",
    ],
    itinerary: [
      {
        label: "Transfer leg",
        detail: "Pickup from your hub. Overland to border and pier.",
      },
      {
        label: "River leg",
        detail: "Join a scheduled slow boat or connection (selected at booking).",
      },
    ],
    includes: [
      "Ground transfer segment (placeholder)",
      "Border crossing coordination",
      "Connection to boat schedule",
    ],
    demoDates: ["2026-08-14", "2026-08-21", "2026-09-04"],
    chartPosition: 3,
  },
  {
    id: "private-charter",
    name: "Private Charter / Custom Day",
    tagline: "Your boat, your schedule on the Mekong",
    duration: "Flexible · day or multi-day",
    route: "Custom within operating corridor",
    from: "Agreed pickup",
    to: "Agreed drop-off",
    priceNote: "Quoted on request — placeholder flow",
    meetingPoint: "Arranged after inquiry",
    highlights: [
      "Private vessel and crew",
      "Custom stops and timing",
      "Groups and special occasions",
    ],
    itinerary: [
      {
        label: "Planning",
        detail: "Share dates, group size, and preferred stops.",
      },
      {
        label: "Voyage",
        detail: "Charter operated to your agreed plan.",
      },
    ],
    includes: [
      "Private boat hire (placeholder)",
      "Custom itinerary planning",
      "Email confirmation with details",
    ],
    demoDates: ["2026-08-20", "2026-08-27", "2026-09-10"],
    chartPosition: 4,
  },
];

export function getTour(id: string): Tour | undefined {
  return tours.find((t) => t.id === id);
}
