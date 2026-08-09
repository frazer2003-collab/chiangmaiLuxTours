"use client";

import dynamic from "next/dynamic";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CatalogTour } from "@/lib/tour-catalog";
import { tours as staticTours } from "@/lib/tours";
import { parsePriceThbFromLabel } from "@/lib/db/types";

const BookingSheet = dynamic(
  () => import("../BookingSheet").then((mod) => mod.BookingSheet),
  { ssr: false },
);

type BookingContextValue = {
  openBooking: (tourId: string, trigger?: HTMLElement | null) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);
const CatalogContext = createContext<CatalogTour[]>([]);

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
}

export function useCatalogTours() {
  return useContext(CatalogContext);
}

function buildStaticCatalog(): CatalogTour[] {
  return staticTours.map((tour) => ({
    ...tour,
    priceThb: parsePriceThbFromLabel(tour.price),
    availableDates: tour.demoDates.map((date) => ({
      date,
      spotsLeft: 20,
      capacity: 20,
    })),
  }));
}

export function BookingProvider({
  children,
  catalogTours,
}: {
  children: ReactNode;
  catalogTours?: CatalogTour[];
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingTourId, setBookingTourId] = useState<string | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const catalog = catalogTours?.length ? catalogTours : buildStaticCatalog();

  const openBooking = useCallback(
    (tourId: string, trigger?: HTMLElement | null) => {
      returnFocusRef.current = trigger ?? null;
      setBookingTourId(tourId);
      setBookingOpen(true);
    },
    [],
  );

  const closeBooking = useCallback(() => {
    setBookingOpen(false);
  }, []);

  return (
    <CatalogContext.Provider value={catalog}>
      <BookingContext.Provider value={{ openBooking }}>
        {children}
        <BookingSheet
          open={bookingOpen}
          tourId={bookingTourId}
          onClose={closeBooking}
          returnFocusRef={returnFocusRef}
        />
      </BookingContext.Provider>
    </CatalogContext.Provider>
  );
}
