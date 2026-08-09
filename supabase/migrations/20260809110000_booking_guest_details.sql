-- Guest identity fields for border / manifest requirements

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS guest_family_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS guest_given_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS guest_gender text NOT NULL DEFAULT 'na',
  ADD COLUMN IF NOT EXISTS guest_id_number text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS guest_nationality text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS guest_date_of_birth date;

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_guest_gender_check;

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_guest_gender_check
  CHECK (guest_gender IN ('male', 'female', 'na'));

DROP FUNCTION IF EXISTS public.create_booking(text, date, integer, text, text);

CREATE OR REPLACE FUNCTION public.create_booking(
  p_tour_id text,
  p_date date,
  p_passengers integer,
  p_guest_email text,
  p_guest_family_name text,
  p_guest_given_name text,
  p_guest_gender text,
  p_guest_id_number text,
  p_guest_nationality text,
  p_guest_date_of_birth date
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.tour_dates%ROWTYPE;
  v_booking_id uuid;
  v_family text := trim(p_guest_family_name);
  v_given text := trim(p_guest_given_name);
  v_full_name text := trim(both ' ' from v_family || ' ' || v_given);
BEGIN
  IF v_family = '' OR v_given = '' THEN
    RAISE EXCEPTION 'invalid_guest_name' USING ERRCODE = 'P0001';
  END IF;

  IF p_guest_gender NOT IN ('male', 'female', 'na') THEN
    RAISE EXCEPTION 'invalid_guest_gender' USING ERRCODE = 'P0001';
  END IF;

  IF trim(p_guest_id_number) = '' OR trim(p_guest_nationality) = '' THEN
    RAISE EXCEPTION 'invalid_guest_identity' USING ERRCODE = 'P0001';
  END IF;

  IF p_guest_date_of_birth IS NULL THEN
    RAISE EXCEPTION 'invalid_guest_dob' USING ERRCODE = 'P0001';
  END IF;

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
    p_guest_gender,
    trim(p_guest_id_number),
    trim(p_guest_nationality),
    p_guest_date_of_birth,
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
  text, date, integer, text, text, text, text, text, text, date
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_booking(
  text, date, integer, text, text, text, text, text, text, date
) TO service_role;
