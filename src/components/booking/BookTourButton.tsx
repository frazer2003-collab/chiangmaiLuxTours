"use client";

import { useBooking } from "./BookingProvider";

type Props = {
  tourId: string;
  className?: string;
  children: React.ReactNode;
};

export function BookTourButton({ tourId, className, children }: Props) {
  const { openBooking } = useBooking();

  return (
    <button
      type="button"
      className={className}
      onClick={(event) => openBooking(tourId, event.currentTarget)}
    >
      {children}
    </button>
  );
}
