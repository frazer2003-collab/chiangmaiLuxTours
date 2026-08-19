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
    tagline: "Overnight in Huay Xai, then the river to Luang Prabang",
    headline: "Cruise the Mighty Mekong",
    intro: SHARED_TOUR_INTRO,
    duration: "2 days · 1 night",
    durationDetail: "Overnight stop, then about 8–10 hours on the river",
    route: "Chiang Mai → Huay Xai → Luang Prabang",
    routeDetail: "Chiang Mai – Huay Xai (overnight) – Luang Prabang",
    from: "Chiang Mai",
    to: "Luang Prabang",
    perfectFor: SHARED_PERFECT_FOR,
    overnightNote:
      "This journey stops overnight in Huay Xai, then continues to Luang Prabang the next day.",
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
          "Continue downstream from Huay Xai to Luang Prabang by slow boat. About 8–10 hours on the river, depending on the season.",
      },
    ],
    includes: SHARED_INCLUDES,
    demoDates: ["2026-08-15", "2026-08-22", "2026-09-05", "2026-09-12"],
    chartPosition: 1,
    image: "/photos/boat-yellow.jpg",
    imageAlt: "Mekong slow boat with yellow hull on the river below jungle hills",
    gallery: [
      { src: "/photos/cabin.jpg", alt: "Wooden cabin seating along the slow boat aisle" },
      { src: "/photos/hotel-room.jpg", alt: "Overnight guesthouse room on the Chiang Mai route" },
      { src: "/photos/hotel-terrace.jpg", alt: "River-view terrace at the overnight stop" },
    ],
  },
  {
    id: "chiang-rai-luang-prabang",
    name: "Chiang Rai → Luang Prabang",
    posterTitle: "CHIANG RAI – LUANG PRABANG",
    tagline: "Same-day boat from Chiang Rai via Huay Xai",
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
          "Hotel pickup in Chiang Rai, transfer via Huay Xai, and slow boat passage to Luang Prabang. About 8–10 hours, depending on the season.",
      },
    ],
    includes: SHARED_INCLUDES,
    demoDates: ["2026-08-18", "2026-08-25", "2026-09-08"],
    chartPosition: 2,
    image: "/photos/boat-passengers.jpg",
    imageAlt: "Passengers on the open bow of a Mekong slow boat",
    gallery: [
      { src: "/photos/interior.jpg", alt: "Covered cabin with booth seating and life jackets" },
      { src: "/photos/van.jpg", alt: "Hotel transfer van included with the route" },
    ],
  },
  {
    id: "chiang-khong-luang-prabang",
    name: "Chiang Khong → Luang Prabang",
    posterTitle: "CHIANG KHONG – LUANG PRABANG",
    tagline: "Same-day boat from the Chiang Khong border pier",
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
          "Hotel transfer to Chiang Khong pier, continue via Huay Xai, and slow boat to Luang Prabang. About 8–10 hours, depending on the season.",
      },
    ],
    includes: SHARED_INCLUDES,
    demoDates: ["2026-08-14", "2026-08-21", "2026-09-04"],
    chartPosition: 3,
    image: "/photos/boat-dock.jpg",
    imageAlt: "Green and red slow boat moored on a Mekong sandbank",
    gallery: [
      { src: "/photos/fleet.jpg", alt: "Slow boats lined along the Chiang Khong riverbank" },
    ],
  },
  {
    id: "chiang-rai-slowboat-luang-prabang",
    name: "Chiang Rai → Luang Prabang (Slow Boat)",
    posterTitle: "CHIANG RAI – LUANG PRABANG (SLOW BOAT)",
    tagline: "Van to the border, then two days on a local slow boat",
    headline: "Cruise the Mighty Mekong",
    intro: "Travel by van from Chiang Rai to the Lao border, then board a local slow boat down the Mekong with an overnight stop in Pakbeng before arriving in Luang Prabang.",
    duration: "2 days · 1 night",
    durationDetail: "Day 1: van + slow boat to Pakbeng. Day 2: slow boat to Luang Prabang",
    route: "Chiang Rai → Huay Xai → Pakbeng → Luang Prabang",
    routeDetail: "Chiang Rai – Huay Xai – Pakbeng (overnight) – Luang Prabang",
    from: "Chiang Rai",
    to: "Luang Prabang",
    perfectFor: "Travellers who want the classic two-day Mekong slow boat experience",
    overnightNote:
      "Overnight in Pakbeng is not included. You arrange your own accommodation in Pakbeng and rejoin the slow boat the next morning.",
    price: "Contact us",
    meetingPoint: "Chiang Rai — hotel pickup at 5:00 am",
    highlights: [
      "Van + local slow boat · 2 days · 1 night",
      "Classic Mekong corridor via Pakbeng",
      "Border crossing assistance included",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: [
      { title: "Van Transfer", description: "11-seater van from hotel to the border." },
      { title: "Border Crossing", description: "Shuttle bus across to Lao immigration at Huay Xai." },
      { title: "Local Slow Boat", description: "Huay Xai to Pakbeng on day 1, Pakbeng to Luang Prabang on day 2." },
      { title: "Mekong Scenery", description: "Jungle hills, riverside villages, and open river views." },
    ],
    itinerary: [
      {
        label: "Day 1",
        detail:
          "Hotel pickup in Chiang Rai at 5:00 am by 11-seater van. Arrive at the border around 7:00 am. Shuttle bus across to Lao immigration (about 20–30 minutes). Transfer to slow boat pier — local slow boat departs Huay Xai at 9:30 am, arriving Pakbeng around 4:00 pm. Overnight in Pakbeng (arranged by you).",
      },
      {
        label: "Day 2",
        detail:
          "From your hotel to the slow boat pier in Pakbeng. Slow boat departs at 8:30 am, arriving Luang Prabang around 4:00 pm. Trip ends at Luang Prabang slow boat pier.",
      },
    ],
    includes: [
      "Hotel transfer from Chiang Rai",
      "Border shuttle bus",
      "Local slow boat ticket (2 days)",
      "Friendly local crew",
    ],
    demoDates: ["2026-08-22", "2026-09-05", "2026-09-19"],
    chartPosition: 5,
    image: "/photos/slowboat-pier.jpg",
    imageAlt: "Local slow boats moored at the Mekong pier with a Lao flag",
    gallery: [
      { src: "/photos/van-11-seater.jpg", alt: "11-seater transfer van at the border station" },
    ],
  },
  {
    id: "chiang-rai-train-luang-prabang",
    name: "Chiang Rai → Luang Prabang (Train)",
    posterTitle: "CHIANG RAI – LUANG PRABANG (TRAIN)",
    tagline: "Van to the border, then train K11 to Luang Prabang in one day",
    headline: "Cross the Border by Train",
    intro: "Travel by van from Chiang Rai to the Lao border, continue by van to Natuey train station, and ride Train K11 to Luang Prabang — all in one day. The same route can also take you to Vang Vieng or Vientiane.",
    duration: "1 day trip",
    durationDetail: "Van to the border, van to Natuey station, then Train K11",
    route: "Chiang Rai → Huay Xai → Natuey → Luang Prabang",
    routeDetail: "Chiang Rai – Huay Xai – Natuey Station – Luang Prabang (Train K11)",
    from: "Chiang Rai",
    to: "Luang Prabang",
    perfectFor: "Travellers who prefer speed and want to reach Luang Prabang, Vang Vieng, or Vientiane by train",
    price: "Contact us",
    meetingPoint: "Chiang Rai — hotel pickup at 5:00 am",
    highlights: [
      "Van + van + Train K11 · 1 day",
      "Arrives Luang Prabang by 4:30 pm",
      "Also connects to Vang Vieng and Vientiane",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: [
      { title: "Van Transfer", description: "11-seater van from hotel to the border." },
      { title: "Border Crossing", description: "Shuttle bus across to Lao immigration at Huay Xai." },
      { title: "Van to Station", description: "11-seater van from Huay Xai border to Natuey train station." },
      { title: "Train K11", description: "Modern rail from Natuey to Luang Prabang, Vang Vieng, or Vientiane." },
    ],
    itinerary: [
      {
        label: "Morning",
        detail:
          "Hotel pickup in Chiang Rai at 5:00 am by 11-seater van. Arrive at the border around 7:00 am. Shuttle bus across to Lao immigration (about 30–45 minutes).",
      },
      {
        label: "Midday",
        detail:
          "Pick up from Huay Xai border by 11-seater van to Natuey train station, arriving around 1:30 pm.",
      },
      {
        label: "Afternoon",
        detail:
          "Board Train K11. Arrives Luang Prabang at 4:30 pm, Vang Vieng at 5:35 pm, or Vientiane at 7:30 pm.",
      },
    ],
    includes: [
      "Hotel transfer from Chiang Rai",
      "Border shuttle bus",
      "Van transfer to Natuey station",
      "Train K11 ticket",
    ],
    demoDates: ["2026-08-25", "2026-09-08", "2026-09-22"],
    chartPosition: 6,
    image: "/photos/train-k11.jpg",
    imageAlt: "Train K11 at Natuey station platform in Laos",
    gallery: [
      { src: "/photos/van-border.jpg", alt: "11-seater transfer van at the border crossing" },
    ],
  },
  {
    id: "huay-xai-luang-prabang",
    name: "Huay Xai → Luang Prabang",
    posterTitle: "HUAY XAI – LUANG PRABANG",
    tagline: "Same-day boat from Huay Xai Village via Pakbeng",
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
          "Depart Huay Xai Village with hotel transfer, pass Pakbeng, and continue to Luang Prabang by slow boat. About 8–10 hours, depending on the season.",
      },
    ],
    includes: SHARED_INCLUDES,
    demoDates: ["2026-08-20", "2026-08-27", "2026-09-10"],
    chartPosition: 4,
    image: "/photos/fleet.jpg",
    imageAlt: "Slow boat fleet at Huay Xai on the Mekong",
    gallery: [
      { src: "/photos/cabin-lounge.jpg", alt: "Wooden lounge seating inside the slow boat" },
    ],
  },
];

export function getTour(id: string): Tour | undefined {
  return tours.find((t) => t.id === id);
}
