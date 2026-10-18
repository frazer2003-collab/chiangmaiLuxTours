ALTER TYPE public.booking_status ADD VALUE IF NOT EXISTS 'to_refund';

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS stripe_refund_id text;

-- Seat count and booking status change together, so a retried refund
-- cannot release the same seats twice.
CREATE OR REPLACE FUNCTION public.apply_booking_status(
  p_booking_id uuid,
  p_status public.booking_status,
  p_internal_notes text,
  p_refund_note text,
  p_stripe_refund_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.bookings%ROWTYPE;
  v_date public.tour_dates%ROWTYPE;
  v_delta integer;
  v_was_active boolean;
  v_will_active boolean;
BEGIN
  IF coalesce(auth.role(), '') <> 'service_role' AND NOT public.is_staff() THEN
    RAISE EXCEPTION 'unauthorized' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_row
  FROM public.bookings
  WHERE id = p_booking_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'booking_not_found' USING ERRCODE = 'P0001';
  END IF;

  v_was_active := v_row.status IN ('pending', 'confirmed');
  v_will_active := p_status IN ('pending', 'confirmed');
  v_delta :=
    (CASE WHEN v_will_active THEN v_row.passengers ELSE 0 END)
    - (CASE WHEN v_was_active THEN v_row.passengers ELSE 0 END);

  IF v_delta <> 0 AND v_row.tour_date_id IS NOT NULL THEN
    SELECT * INTO v_date
    FROM public.tour_dates
    WHERE id = v_row.tour_date_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'date_missing' USING ERRCODE = 'P0001';
    END IF;

    IF v_date.booked_count + v_delta < 0
      OR v_date.booked_count + v_delta > v_date.capacity THEN
      RAISE EXCEPTION 'not_enough_capacity' USING ERRCODE = 'P0001';
    END IF;

    UPDATE public.tour_dates
    SET booked_count = booked_count + v_delta
    WHERE id = v_date.id;
  END IF;

  UPDATE public.bookings
  SET
    status = p_status,
    internal_notes = left(coalesce(p_internal_notes, ''), 500),
    refund_note = left(coalesce(p_refund_note, ''), 500),
    stripe_refund_id = coalesce(nullif(p_stripe_refund_id, ''), stripe_refund_id),
    updated_at = now()
  WHERE id = p_booking_id;
END;
$$;

REVOKE ALL ON FUNCTION public.apply_booking_status(uuid, public.booking_status, text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.apply_booking_status(uuid, public.booking_status, text, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.apply_booking_status(uuid, public.booking_status, text, text, text) TO authenticated, service_role;
