import type { Tour } from "./types";
import { CONTACT } from "./types";

export { CONTACT };

export const tours: Tour[] = [
  {
    id: "chiang-rai-luang-prabang",
    name: "Chiang Rai → Luang Prabang (Luxury Boat)",
    posterTitle: "CHIANG RAI – LUANG PRABANG (LUXURY BOAT)",
    tagline: "Two days on a luxury slow boat, with meals and hotel drop-off",
    headline: "Cruise the Mighty Mekong",
    intro:
      "Hotel pickup in Chiang Rai, then a luxury slow boat down the Mekong. Lunch both days, breakfast on day two, tea and coffee, a riverside village stop, and the Pak Ou Caves. Overnight in Pakbeng, then a minivan to your hotel in Luang Prabang.",
    duration: "2 days · 1 night",
    durationDetail: "Day 1: Chiang Rai to Pakbeng. Day 2: Pakbeng to Luang Prabang, with Pak Ou Caves",
    route: "Chiang Rai → Huay Xai → Pakbeng → Luang Prabang",
    routeDetail: "Chiang Rai – Huay Xai – Pakbeng (overnight) – Pak Ou Caves – Luang Prabang",
    from: "Chiang Rai",
    to: "Luang Prabang",
    perfectFor: "Travellers who want a guided two-day Mekong cruise with meals on board",
    overnightNote:
      "Overnight in Pakbeng is not included. You transfer on your own to a hotel you have booked, then rejoin the boat the next morning.",
    price: "฿6,300 / person",
    meetingPoint: "Chiang Rai — hotel pickup at 5:00 am",
    highlights: [
      "Luxury slow boat · 2 days · 1 night",
      "Lunch both days, breakfast on day two, tea and coffee",
      "Riverside village stop and Pak Ou Caves",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: [
      { title: "Hotel Transfers", description: "Pickup in Chiang Rai and drop-off at your hotel in Luang Prabang." },
      { title: "Luxury Slow Boat", description: "Huay Xai to Pakbeng on day 1, Pakbeng to Luang Prabang on day 2." },
      { title: "Onboard Meals", description: "Lunch both days, breakfast on day two, plus tea and coffee." },
      { title: "Pak Ou Caves", description: "Guided stop at Tham Ting and the Baan Bo craft village." },
    ],
    itinerary: [
      {
        label: "Day 1",
        detail:
          "Private minivan pickup from your Chiang Rai hotel at 5:00 am. Thai immigration at the Chiang Khong checkpoint around 6:45 am, then the Friendship Bridge shuttle to Huay Xai. Laos visa on arrival about 7:30–8:30 am (about 40 USD, paid by you). Private transfer to the Huay Xai slow boat pier. The luxury slow boat departs between 9:00 and 10:00 am for Pakbeng, with lunch, tea, and coffee on board and a guided stop at a riverside village. Arrive Pakbeng around 4:00 pm and transfer on your own to your pre-booked hotel.",
      },
      {
        label: "Day 2",
        detail:
          "Return to Pakbeng pier at 8:00 am for breakfast on board. Depart between 8:30 and 9:00 am. Buffet lunch, coffee, and tea are served on the way to Luang Prabang, with stops at Baan Bo craft village and the Pak Ou Caves (Tham Ting). Arrive at the Luang Prabang slow boat terminal around 3:30 pm, then a minivan to your hotel.",
      },
    ],
    includes: [
      "Hotel pickup in Chiang Rai",
      "Border shuttle and pier transfer",
      "Luxury slow boat ticket (2 days)",
      "Lunch both days and breakfast on day two",
      "Tea and coffee",
      "Guided village stop and Pak Ou Caves",
      "Minivan drop-off at your Luang Prabang hotel",
    ],
    demoDates: ["2026-08-26", "2026-09-05", "2026-09-19"],
    chartPosition: 1,
    image: "/photos/boat-yellow.jpg",
    imageAlt: "Mekong slow boat with yellow hull on the river below jungle hills",
    gallery: [
      { src: "/photos/cabin.jpg", alt: "Wooden cabin seating along the slow boat aisle" },
      { src: "/photos/interior.jpg", alt: "Covered cabin with booth seating and life jackets" },
    ],
  },
  {
    id: "chiang-rai-slowboat-luang-prabang",
    name: "Chiang Rai → Luang Prabang (Local Boat)",
    posterTitle: "CHIANG RAI – LUANG PRABANG (LOCAL BOAT)",
    tagline: "Van to the border, then two days on a local boat",
    headline: "Cruise the Mighty Mekong",
    intro:
      "Travel by van from Chiang Rai to the Lao border, then board a local boat down the Mekong with an overnight stop in Pakbeng before arriving in Luang Prabang.",
    duration: "2 days · 1 night",
    durationDetail: "Day 1: van + local boat to Pakbeng. Day 2: local boat to Luang Prabang",
    route: "Chiang Rai → Huay Xai → Pakbeng → Luang Prabang",
    routeDetail: "Chiang Rai – Huay Xai – Pakbeng (overnight) – Luang Prabang",
    from: "Chiang Rai",
    to: "Luang Prabang",
    perfectFor: "Travellers who want the classic two-day Mekong local boat",
    overnightNote:
      "Overnight in Pakbeng is not included. You arrange your own accommodation in Pakbeng and rejoin the local boat the next morning.",
    price: "฿1,690 / person",
    meetingPoint: "Chiang Rai — hotel pickup at 5:00 am",
    highlights: [
      "Van + local boat · 2 days · 1 night",
      "Classic Mekong corridor via Pakbeng",
      "Border crossing assistance included",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: [
      { title: "Van Transfer", description: "11-seater van from hotel to the border." },
      { title: "Border Crossing", description: "Shuttle bus across to Lao immigration at Huay Xai." },
      { title: "Local Boat", description: "Huay Xai to Pakbeng on day 1, Pakbeng to Luang Prabang on day 2." },
      { title: "Mekong Scenery", description: "Jungle hills, riverside villages, and open river views." },
    ],
    itinerary: [
      {
        label: "Day 1",
        detail:
          "Hotel pickup in Chiang Rai at 5:00 am by 11-seater van. Arrive at the border around 7:00 am. Shuttle bus across to Lao immigration (about 20–30 minutes). Transfer to the boat pier — the local boat departs Huay Xai at 9:30 am, arriving Pakbeng around 4:00 pm. Overnight in Pakbeng (arranged by you).",
      },
      {
        label: "Day 2",
        detail:
          "From your hotel to the boat pier in Pakbeng. The local boat departs at 8:30 am, arriving Luang Prabang around 4:00 pm. The trip ends at the Luang Prabang boat pier.",
      },
    ],
    includes: [
      "Hotel transfer from Chiang Rai",
      "Border shuttle bus",
      "Local boat ticket (2 days)",
      "Friendly local crew",
    ],
    demoDates: ["2026-08-26", "2026-09-05", "2026-09-19"],
    chartPosition: 2,
    image: "/photos/slowboat-pier.jpg",
    imageAlt: "Local boats moored at the Mekong pier with a Lao flag",
    gallery: [
      { src: "/photos/van-11-seater.jpg", alt: "11-seater transfer van at the border station" },
    ],
  },
  {
    id: "chiang-khong-luang-prabang",
    name: "Chiang Khong → Luang Prabang (Luxury Boat)",
    posterTitle: "CHIANG KHONG – LUANG PRABANG (LUXURY BOAT)",
    tagline: "Two days on a luxury slow boat from the Chiang Khong border",
    headline: "Cruise the Mighty Mekong",
    intro:
      "Hotel pickup in Chiang Khong, then a luxury slow boat down the Mekong. Lunch both days, breakfast on day two, tea and coffee, a riverside village stop, and the Pak Ou Caves. Overnight in Pakbeng, then a minivan to your hotel in Luang Prabang.",
    duration: "2 days · 1 night",
    durationDetail: "Day 1: Chiang Khong to Pakbeng. Day 2: Pakbeng to Luang Prabang, with Pak Ou Caves",
    route: "Chiang Khong → Huay Xai → Pakbeng → Luang Prabang",
    routeDetail: "Chiang Khong – Huay Xai – Pakbeng (overnight) – Pak Ou Caves – Luang Prabang",
    from: "Chiang Khong",
    to: "Luang Prabang",
    perfectFor: "Travellers starting at the Chiang Khong border who want a guided two-day cruise",
    overnightNote:
      "Overnight in Pakbeng is not included. You transfer on your own to a hotel you have booked, then rejoin the boat the next morning.",
    price: "฿5,700 / person",
    meetingPoint: "Chiang Khong — hotel pickup at 7:00 am",
    highlights: [
      "Luxury slow boat · 2 days · 1 night",
      "Lunch both days, breakfast on day two, tea and coffee",
      "Riverside village stop and Pak Ou Caves",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: [
      { title: "Hotel Transfers", description: "Pickup in Chiang Khong and drop-off at your hotel in Luang Prabang." },
      { title: "Luxury Slow Boat", description: "Huay Xai to Pakbeng on day 1, Pakbeng to Luang Prabang on day 2." },
      { title: "Onboard Meals", description: "Lunch both days, breakfast on day two, plus tea and coffee." },
      { title: "Pak Ou Caves", description: "Guided stop at Tham Ting and the Baan Bo craft village." },
    ],
    itinerary: [
      {
        label: "Day 1",
        detail:
          "Private minivan pickup from your Chiang Khong hotel at 7:00 am. Thai immigration at the Chiang Khong checkpoint around 7:20 am, then the Friendship Bridge shuttle to Huay Xai at 7:30 am. Laos visa on arrival about 7:40–8:50 am (about 40 USD, paid by you). Private transfer to the Huay Xai slow boat pier at 9:00 am. The luxury slow boat departs between 9:30 and 10:00 am for Pakbeng, with lunch, tea, and coffee on board and a guided stop at a riverside village. Arrive Pakbeng around 4:00 pm and transfer on your own to your pre-booked hotel.",
      },
      {
        label: "Day 2",
        detail:
          "Return to Pakbeng pier at 8:00 am for breakfast on board. Depart between 8:30 and 9:00 am. Buffet lunch, coffee, and tea are served on the way to Luang Prabang, with stops at Baan Bo craft village and the Pak Ou Caves (Tham Ting). Arrive at the Luang Prabang slow boat terminal around 3:30 pm, then a minivan to your hotel.",
      },
    ],
    includes: [
      "Hotel pickup in Chiang Khong",
      "Border shuttle and pier transfer",
      "Luxury slow boat ticket (2 days)",
      "Lunch both days and breakfast on day two",
      "Tea and coffee",
      "Guided village stop and Pak Ou Caves",
      "Minivan drop-off at your Luang Prabang hotel",
    ],
    demoDates: ["2026-08-14", "2026-08-21", "2026-09-04"],
    chartPosition: 3,
    image: "/photos/boat-dock.jpg",
    imageAlt: "Slow boat moored on a Mekong sandbank near Chiang Khong",
    gallery: [
      { src: "/photos/fleet.jpg", alt: "Slow boats lined along the riverbank" },
      { src: "/photos/cabin-lounge.jpg", alt: "Wooden lounge seating inside the slow boat" },
    ],
  },
  {
    id: "chiang-rai-train-luang-prabang",
    name: "Chiang Rai → Luang Prabang (Train)",
    posterTitle: "CHIANG RAI – LUANG PRABANG (TRAIN)",
    tagline: "Van to the border, then train K11 to Luang Prabang in one day",
    headline: "Cross the Border by Train",
    intro: "Travel by van from Chiang Rai to the Lao border, continue by van to Natuey train station, and ride Train K11 to Luang Prabang — all in one day.",
    duration: "1 day trip",
    durationDetail: "Van to the border, van to Natuey station, then Train K11",
    route: "Chiang Rai → Huay Xai → Natuey → Luang Prabang",
    routeDetail: "Chiang Rai – Huay Xai – Natuey Station – Luang Prabang (Train K11)",
    from: "Chiang Rai",
    to: "Luang Prabang",
    perfectFor: "Travellers who prefer speed and want to reach Luang Prabang in a single day",
    price: "฿1,800 / person",
    meetingPoint: "Chiang Rai — hotel pickup at 5:00 am",
    highlights: [
      "Van + van + Train K11 · 1 day",
      "Arrives Luang Prabang by 4:30 pm",
      "Border crossing assistance included",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: [
      { title: "Van Transfer", description: "11-seater van from hotel to the border." },
      { title: "Border Crossing", description: "Shuttle bus across to Lao immigration at Huay Xai." },
      { title: "Van to Station", description: "11-seater van from Huay Xai border to Natuey train station." },
      { title: "Train K11", description: "Modern rail from Natuey to Luang Prabang." },
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
          "Train K11 departs Natuey at 2:20 pm and arrives Luang Prabang at 4:30 pm.",
      },
    ],
    includes: [
      "Hotel transfer from Chiang Rai",
      "Border shuttle bus",
      "Van transfer to Natuey station",
      "Train K11 ticket",
    ],
    demoDates: ["2026-10-03", "2026-10-10", "2026-10-17"],
    chartPosition: 4,
    image: "/photos/train-k11.jpg",
    imageAlt: "Train K11 at Natuey station platform in Laos",
    gallery: [
      { src: "/photos/van-border.jpg", alt: "11-seater transfer van at the border crossing" },
    ],
  },
  {
    id: "chiang-rai-train-vang-vieng",
    name: "Chiang Rai → Vang Vieng (Train)",
    posterTitle: "CHIANG RAI – VANG VIENG (TRAIN)",
    tagline: "Van to the border, then train K11 to Vang Vieng in one day",
    headline: "Cross the Border by Train",
    intro: "Travel by van from Chiang Rai to the Lao border, continue by van to Natuey train station, and ride Train K11 straight through to Vang Vieng — all in one day.",
    duration: "1 day trip",
    durationDetail: "Van to the border, van to Natuey station, then Train K11",
    route: "Chiang Rai → Huay Xai → Natuey → Vang Vieng",
    routeDetail: "Chiang Rai – Huay Xai – Natuey Station – Vang Vieng (Train K11)",
    from: "Chiang Rai",
    to: "Vang Vieng",
    perfectFor: "Travellers heading for the limestone karsts and rivers of Vang Vieng",
    price: "฿1,800 / person",
    meetingPoint: "Chiang Rai — hotel pickup at 5:00 am",
    highlights: [
      "Van + van + Train K11 · 1 day",
      "Arrives Vang Vieng by 5:35 pm",
      "Border crossing assistance included",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: [
      { title: "Van Transfer", description: "11-seater van from hotel to the border." },
      { title: "Border Crossing", description: "Shuttle bus across to Lao immigration at Huay Xai." },
      { title: "Van to Station", description: "11-seater van from Huay Xai border to Natuey train station." },
      { title: "Train K11", description: "Modern rail from Natuey through Luang Prabang to Vang Vieng." },
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
          "Train K11 departs Natuey at 2:20 pm, calls at Luang Prabang at 4:30 pm, and arrives Vang Vieng at 5:35 pm.",
      },
    ],
    includes: [
      "Hotel transfer from Chiang Rai",
      "Border shuttle bus",
      "Van transfer to Natuey station",
      "Train K11 ticket",
    ],
    demoDates: ["2026-10-03", "2026-10-10", "2026-10-17"],
    chartPosition: 5,
    image: "/photos/train-k11.jpg",
    imageAlt: "Train K11 at Natuey station platform in Laos",
    gallery: [
      { src: "/photos/van-border.jpg", alt: "11-seater transfer van at the border crossing" },
    ],
  },
  {
    id: "chiang-rai-train-vientiane",
    name: "Chiang Rai → Vientiane (Train)",
    posterTitle: "CHIANG RAI – VIENTIANE (TRAIN)",
    tagline: "Van to the border, then train K11 to Vientiane in one day",
    headline: "Cross the Border by Train",
    intro: "Travel by van from Chiang Rai to the Lao border, continue by van to Natuey train station, and ride Train K11 all the way to the Lao capital — all in one day.",
    duration: "1 day trip",
    durationDetail: "Van to the border, van to Natuey station, then Train K11",
    route: "Chiang Rai → Huay Xai → Natuey → Vientiane",
    routeDetail: "Chiang Rai – Huay Xai – Natuey Station – Vientiane (Train K11)",
    from: "Chiang Rai",
    to: "Vientiane",
    perfectFor: "Travellers continuing to the Lao capital or onward connections",
    price: "฿1,800 / person",
    meetingPoint: "Chiang Rai — hotel pickup at 5:00 am",
    highlights: [
      "Van + van + Train K11 · 1 day",
      "Arrives Vientiane by 7:30 pm",
      "Border crossing assistance included",
      `TAT Licence ID ${CONTACT.licence}`,
    ],
    experiences: [
      { title: "Van Transfer", description: "11-seater van from hotel to the border." },
      { title: "Border Crossing", description: "Shuttle bus across to Lao immigration at Huay Xai." },
      { title: "Van to Station", description: "11-seater van from Huay Xai border to Natuey train station." },
      { title: "Train K11", description: "Modern rail from Natuey through Luang Prabang and Vang Vieng to Vientiane." },
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
          "Train K11 departs Natuey at 2:20 pm, calls at Luang Prabang at 4:30 pm and Vang Vieng at 5:35 pm, and arrives Vientiane at 7:30 pm.",
      },
    ],
    includes: [
      "Hotel transfer from Chiang Rai",
      "Border shuttle bus",
      "Van transfer to Natuey station",
      "Train K11 ticket",
    ],
    demoDates: ["2026-10-03", "2026-10-10", "2026-10-17"],
    chartPosition: 6,
    image: "/photos/train-k11.jpg",
    imageAlt: "Train K11 at Natuey station platform in Laos",
    gallery: [
      { src: "/photos/van-border.jpg", alt: "11-seater transfer van at the border crossing" },
    ],
  },
];

const RETIRED_TOUR_NAMES: Record<string, string> = {
  "chiang-mai-luang-prabang": "Chiang Mai → Luang Prabang",
  "huay-xai-luang-prabang": "Huay Xai → Luang Prabang",
};

export function getTour(id: string): Tour | undefined {
  return tours.find((t) => t.id === id);
}

/** Name for a live listing, or a readable label for a route that is no longer sold. */
export function tourDisplayName(id: string): string {
  return getTour(id)?.name ?? RETIRED_TOUR_NAMES[id] ?? id;
}
