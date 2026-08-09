-- Allow booking with lead guest name only; passport manifest deferred

DROP FUNCTION IF EXISTS public.create_booking(text, date, integer, text, jsonb);

CREATE OR REPLACE FUNCTION public.create_booking(
  p_tour_id text,
  p_date date,
  p_passengers integer,
  p_guest_email text,
  p_passengers_detail jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.tour_dates%ROWTYPE;
  v_booking_id uuid;
  v_first jsonb;
  v_family text;
  v_given text;
  v_full_name text;
  v_gender text;
  v_idx integer;
  v_item jsonb;
BEGIN
  IF p_passengers < 1 OR p_passengers > 12 THEN
    RAISE EXCEPTION 'invalid_passenger_count' USING ERRCODE = 'P0001';
  END IF;

  IF p_passengers_detail IS NULL
    OR jsonb_typeof(p_passengers_detail) <> 'array'
    OR jsonb_array_length(p_passengers_detail) <> p_passengers THEN
    RAISE EXCEPTION 'invalid_passengers_detail' USING ERRCODE = 'P0001';
  END IF;

  v_first := p_passengers_detail -> 0;
  v_family := trim(v_first->>'family_name');
  v_given := trim(v_first->>'given_name');

  IF v_family = '' OR v_given = '' THEN
    RAISE EXCEPTION 'invalid_passenger_identity' USING ERRCODE = 'P0001';
  END IF;

  FOR v_idx IN 0..(p_passengers - 1) LOOP
    v_item := p_passengers_detail -> v_idx;
    IF (v_item->>'gender') IS NOT NULL
      AND (v_item->>'gender') NOT IN ('male', 'female', 'na') THEN
      RAISE EXCEPTION 'invalid_passenger_identity' USING ERRCODE = 'P0001';
    END IF;
  END LOOP;

  v_gender := coalesce(v_first->>'gender', 'na');
  v_full_name := trim(both ' ' from v_family || ' ' || v_given);

  SELECT * INTO v_row
  FROM public.tour_dates
  WHERE tour_id = p_tour_id AND date = p_date
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'date_not_available' USING ERRCODE = 'P0001';
  END IF;

  IF v_row.booked_count + p_passengers > v_row.capacity THEN
    RAISE EXCEPTION 'not_enough_capacity' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.bookings (
    tour_id,
    tour_date_id,
    travel_date,
    passengers,
    guest_name,
    guest_email,
    guest_family_name,
    guest_given_name,
    guest_gender,
    guest_id_number,
    guest_nationality,
    guest_date_of_birth,
    passengers_detail,
    status
  ) VALUES (
    p_tour_id,
    v_row.id,
    p_date,
    p_passengers,
    v_full_name,
    lower(trim(p_guest_email)),
    v_family,
    v_given,
    v_gender,
    coalesce(trim(v_first->>'id_number'), ''),
    coalesce(trim(v_first->>'nationality'), ''),
    NULLIF(trim(v_first->>'date_of_birth'), '')::date,
    p_passengers_detail,
    'pending'
  )
  RETURNING id INTO v_booking_id;

  UPDATE public.tour_dates
  SET booked_count = booked_count + p_passengers
  WHERE id = v_row.id;

  RETURN v_booking_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_booking(
  text, date, integer, text, jsonb
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_booking(
  text, date, integer, text, jsonb
) TO service_role;
