function formatTravelDate(isoDate) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const copyByKind = {
  received: {
    subject: "Booking received",
    opening: "A guest has started a website booking.",
    payment: "Pending",
    key: "booking-received",
  },
  paid: {
    subject: "Payment confirmed",
    opening: "A website booking has been paid.",
    payment: "Confirmed",
    key: "booking-paid",
  },
  manual: {
    subject: "Booking confirmed",
    opening: "A booking has been confirmed by staff.",
    payment: "Confirmed manually",
    key: "booking-confirmed-manually",
  },
};

export function buildBookingEmail({ kind, booking, routeName, adminUrl }) {
  const copy = copyByKind[kind];
  if (!copy) throw new Error(`Unsupported booking email kind: ${kind}`);

  const travelDate = formatTravelDate(booking.travel_date);
  const passengerLabel =
    booking.passengers === 1 ? "1 passenger" : `${booking.passengers} passengers`;

  return {
    idempotencyKey: `${copy.key}/${booking.id}`,
    subject: `${copy.subject}: ${routeName} · ${travelDate}`,
    text: [
      copy.opening,
      "",
      `Guest: ${booking.guest_name}`,
      `Guest email: ${booking.guest_email}`,
      `Route: ${routeName}`,
      `Departure: ${travelDate}`,
      `Passengers: ${passengerLabel}`,
      `Payment: ${copy.payment}`,
      `Reference: ${booking.id}`,
      "",
      `Open the admin: ${adminUrl}`,
    ].join("\n"),
  };
}

export function shouldNotifyManualConfirmation(previousStatus, nextStatus, stripePaymentId) {
  return (
    previousStatus !== "confirmed" &&
    nextStatus === "confirmed" &&
    !stripePaymentId
  );
}
