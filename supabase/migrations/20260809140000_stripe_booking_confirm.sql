-- Confirm booking after successful Stripe Checkout payment

CREATE OR REPLACE FUNCTION public.confirm_booking_payment(
  p_booking_id uuid,
  p_stripe_payment_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF trim(p_stripe_payment_id) = '' THEN
    RAISE EXCEPTION 'invalid_stripe_payment_id' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.bookings
  SET
    status = 'confirmed',
    stripe_payment_id = trim(p_stripe_payment_id),
    updated_at = now()
  WHERE id = p_booking_id
    AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'booking_not_pending' USING ERRCODE = 'P0001';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_pending_booking(p_booking_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.bookings%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM public.bookings
  WHERE id = p_booking_id AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  IF v_row.tour_date_id IS NOT NULL THEN
    UPDATE public.tour_dates
    SET booked_count = GREATEST(0, booked_count - v_row.passengers)
    WHERE id = v_row.tour_date_id;
  END IF;

  UPDATE public.bookings
  SET status = 'cancelled', updated_at = now()
  WHERE id = p_booking_id;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_booking_payment(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.confirm_booking_payment(uuid, text) TO service_role;

REVOKE ALL ON FUNCTION public.cancel_pending_booking(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cancel_pending_booking(uuid) TO service_role;
