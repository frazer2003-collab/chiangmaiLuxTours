"use client";

import { useBooking } from "./BookingProvider";
import { whatsappHref } from "@/lib/types";

type Props = {
  tourId: string;
  tourName: string;
  bookable: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function BookTourButton({ tourId, tourName, bookable, className, children }: Props) {
  const { openBooking } = useBooking();

  if (!bookable) {
    return (
      <a
        href={whatsappHref(`Hello Mekong Transfer — I want to book ${tourName}.`)}
        className={className}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={(event) => {
        event.stopPropagation();
        openBooking(tourId, event.currentTarget);
      }}
    >
      {children}
    </button>
  );
}
