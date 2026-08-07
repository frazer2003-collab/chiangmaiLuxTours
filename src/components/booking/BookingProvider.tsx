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

const BookingSheet = dynamic(
  () => import("../BookingSheet").then((mod) => mod.BookingSheet),
  { ssr: false },
);

type BookingContextValue = {
  openBooking: (tourId: string, trigger?: HTMLElement | null) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingTourId, setBookingTourId] = useState<string | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

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
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      <BookingSheet
        open={bookingOpen}
        tourId={bookingTourId}
        onClose={closeBooking}
        returnFocusRef={returnFocusRef}
      />
    </BookingContext.Provider>
  );
}
