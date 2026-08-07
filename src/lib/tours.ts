import type { Tour } from "./types";
import {
  CONTACT,
  SHARED_DURATION_DETAIL,
  SHARED_EXPERIENCES,
  SHARED_INCLUDES,
  SHARED_PERFECT_FOR,
  SHARED_TOUR_INTRO,
} from "./types";

export { CONTACT };

export const tours: Tour[] = [
  {
    id: "chiang-mai-luang-prabang",
    name: "Chiang Mai → Luang Prabang",
    posterTitle: "CHIANG MAI – LUANG PRABANG",
    tagline: "The Journey of a Lifetime",
    headline: "Cruise the Mighty Mekong",
    intro: SHARED_TOUR_INTRO,
    duration: "2 days · 1 night",
    durationDetail: SHARED_DURATION_DETAIL,
    route: "Chiang Mai → Huay Xai → Luang Prabang",
    routeDetail: "Chiang Mai – Huay Xai (overnight) – Luang Prabang",
    from: "Chiang Mai",
    to: "Luang Prabang",
    perfectFor: SHARED_PERFECT_FOR,
    overnightNote:
      "Overnight included: This journey adds an overnight stop in Huay Xai, then continues down the Mekong to Luang Prabang the next day.",
    price: "฿8,300 / person",
    meetingPoint: "Chiang Mai — hotel transfer included",
    highlights: [
      "Premium slow boat · 2 days · 1 night",
      "Overnight stop in Huay Xai en route to Luang Prabang",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: SHARED_EXPERIENCES,
    itinerary: [
      {
        label: "Day 1",
        detail:
          "Depart Chiang Mai with hotel transfer included. Travel to Huay Xai for an overnight stop on the Mekong corridor.",
      },
      {
        label: "Day 2",
        detail:
          "Continue downstream from Huay Xai to Luang Prabang by slow boat. Approx. 8–10 hrs on the river · varies by season.",
      },
    ],
    includes: SHARED_INCLUDES,
    demoDates: ["2026-08-15", "2026-08-22", "2026-09-05", "2026-09-12"],
    chartPosition: 1,
  },
  {
    id: "chiang-rai-luang-prabang",
    name: "Chiang Rai → Luang Prabang",
    posterTitle: "CHIANG RAI – LUANG PRABANG",
    tagline: "The Journey of a Lifetime",
    headline: "Cruise the Mighty Mekong",
    intro: SHARED_TOUR_INTRO,
    duration: "1 day trip",
    durationDetail: SHARED_DURATION_DETAIL,
    route: "Chiang Rai → Huay Xai → Luang Prabang",
    routeDetail: "Chiang Rai – Huay Xai – Luang Prabang",
    from: "Chiang Rai",
    to: "Luang Prabang",
    perfectFor: SHARED_PERFECT_FOR,
    price: "฿6,900 / person",
    meetingPoint: "Chiang Rai — hotel transfer included",
    highlights: [
      "Premium slow boat · 1 day trip",
      "Scenic Mekong route via Huay Xai to Luang Prabang",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: SHARED_EXPERIENCES,
    itinerary: [
      {
        label: "Full day",
        detail:
          "Hotel pickup in Chiang Rai, transfer via Huay Xai, and slow boat passage to Luang Prabang. Approx. 8–10 hrs · varies by season.",
      },
    ],
    includes: SHARED_INCLUDES,
    demoDates: ["2026-08-18", "2026-08-25", "2026-09-08"],
    chartPosition: 2,
  },
  {
    id: "chiang-khong-luang-prabang",
    name: "Chiang Khong → Luang Prabang",
    posterTitle: "CHIANG KHONG – LUANG PRABANG",
    tagline: "The Journey of a Lifetime",
    headline: "Cruise the Mighty Mekong",
    intro: SHARED_TOUR_INTRO,
    duration: "1 day trip",
    durationDetail: SHARED_DURATION_DETAIL,
    route: "Chiang Khong → Huay Xai → Luang Prabang",
    routeDetail: "Chiang Khong – Huay Xai – Luang Prabang",
    from: "Chiang Khong",
    to: "Luang Prabang",
    perfectFor: SHARED_PERFECT_FOR,
    price: "฿6,300 / person",
    meetingPoint: "Chiang Khong — hotel transfer to the pier",
    highlights: [
      "Premium slow boat · 1 day trip",
      "Border pier departure with hotel transfer to the pier",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: SHARED_EXPERIENCES,
    itinerary: [
      {
        label: "Full day",
        detail:
          "Hotel transfer to Chiang Khong pier, continue via Huay Xai, and slow boat to Luang Prabang. Approx. 8–10 hrs · varies by season.",
      },
    ],
    includes: SHARED_INCLUDES,
    demoDates: ["2026-08-14", "2026-08-21", "2026-09-04"],
    chartPosition: 3,
  },
  {
    id: "huay-xai-luang-prabang",
    name: "Huay Xai → Luang Prabang",
    posterTitle: "HUAY XAI – LUANG PRABANG",
    tagline: "The Journey of a Lifetime",
    headline: "Cruise the Mighty Mekong",
    intro: SHARED_TOUR_INTRO,
    duration: "1 day trip",
    durationDetail: SHARED_DURATION_DETAIL,
    route: "Huay Xai → Pakbeng → Luang Prabang",
    routeDetail: "Huay Xai – Pakbeng – Luang Prabang",
    from: "Huay Xai",
    to: "Luang Prabang",
    perfectFor: SHARED_PERFECT_FOR,
    price: "฿5,800 / person",
    meetingPoint: "Huay Xai Village, Bokeo Province — with hotel transfer",
    highlights: [
      "Premium slow boat · 1 day trip",
      "Classic Mekong corridor via Pakbeng to Luang Prabang",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: SHARED_EXPERIENCES,
    itinerary: [
      {
        label: "Full day",
        detail:
          "Depart Huay Xai Village with hotel transfer, pass Pakbeng, and continue to Luang Prabang by slow boat. Approx. 8–10 hrs · varies by season.",
      },
    ],
    includes: SHARED_INCLUDES,
    demoDates: ["2026-08-20", "2026-08-27", "2026-09-10"],
    chartPosition: 4,
  },
];

export function getTour(id: string): Tour | undefined {
  return tours.find((t) => t.id === id);
}
