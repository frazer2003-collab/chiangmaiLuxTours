-- Mekong Transfer admin schema: tours, dates, bookings
-- Run in Supabase SQL editor or via `supabase db push`

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'staff',
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.tours (
  id text PRIMARY KEY,
  price_thb integer NOT NULL CHECK (price_thb > 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tour_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id text NOT NULL REFERENCES public.tours (id) ON DELETE CASCADE,
  date date NOT NULL,
  capacity integer NOT NULL CHECK (capacity >= 0),
  booked_count integer NOT NULL DEFAULT 0 CHECK (booked_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tour_id, date),
  CHECK (booked_count <= capacity)
);

CREATE TYPE public.booking_status AS ENUM (
  'pending',
  'confirmed',
  'cancelled',
  'refunded'
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id text NOT NULL REFERENCES public.tours (id) ON DELETE RESTRICT,
  tour_date_id uuid REFERENCES public.tour_dates (id) ON DELETE SET NULL,
  travel_date date NOT NULL,
  passengers integer NOT NULL CHECK (passengers > 0 AND passengers <= 12),
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  internal_notes text NOT NULL DEFAULT '',
  refund_note text NOT NULL DEFAULT '',
  stripe_payment_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tour_dates_tour_date ON public.tour_dates (tour_id, date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON public.bookings (travel_date DESC);

-- ---------------------------------------------------------------------------
-- Atomic public booking (server-side only via service role)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_booking(
  p_tour_id text,
  p_date date,
  p_passengers integer,
  p_guest_name text,
  p_guest_email text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.tour_dates%ROWTYPE;
  v_booking_id uuid;
BEGIN
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
    status
  ) VALUES (
    p_tour_id,
    v_row.id,
    p_date,
    p_passengers,
    trim(p_guest_name),
    lower(trim(p_guest_email)),
    'pending'
  )
  RETURNING id INTO v_booking_id;

  UPDATE public.tour_dates
  SET booked_count = booked_count + p_passengers
  WHERE id = v_row.id;

  RETURN v_booking_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_booking(text, date, integer, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_booking(text, date, integer, text, text) TO service_role;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Tours: public read, staff write
CREATE POLICY "tours_public_read"
  ON public.tours FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "tours_staff_update"
  ON public.tours FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Tour dates: public read available future slots; staff full access
CREATE POLICY "tour_dates_public_read"
  ON public.tour_dates FOR SELECT
  TO anon, authenticated
  USING (
    date >= current_date
    AND booked_count < capacity
  );

CREATE POLICY "tour_dates_staff_select"
  ON public.tour_dates FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "tour_dates_staff_insert"
  ON public.tour_dates FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "tour_dates_staff_update"
  ON public.tour_dates FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "tour_dates_staff_delete"
  ON public.tour_dates FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- Bookings: staff only
CREATE POLICY "bookings_staff_select"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (public.is_staff());

CREATE POLICY "bookings_staff_update"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- ---------------------------------------------------------------------------
-- Seed (idempotent)
-- ---------------------------------------------------------------------------

INSERT INTO public.tours (id, price_thb) VALUES
  ('chiang-mai-luang-prabang', 8300),
  ('chiang-rai-luang-prabang', 6900),
  ('chiang-khong-luang-prabang', 6300),
  ('huay-xai-luang-prabang', 5800)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tour_dates (tour_id, date, capacity, booked_count)
SELECT v.tour_id, v.date::date, v.capacity, 0
FROM (VALUES
  ('chiang-mai-luang-prabang', '2026-08-15', 20),
  ('chiang-mai-luang-prabang', '2026-08-22', 20),
  ('chiang-mai-luang-prabang', '2026-09-05', 20),
  ('chiang-mai-luang-prabang', '2026-09-12', 20),
  ('chiang-rai-luang-prabang', '2026-08-18', 20),
  ('chiang-rai-luang-prabang', '2026-08-25', 20),
  ('chiang-rai-luang-prabang', '2026-09-08', 20),
  ('chiang-khong-luang-prabang', '2026-08-14', 20),
  ('chiang-khong-luang-prabang', '2026-08-21', 20),
  ('chiang-khong-luang-prabang', '2026-09-04', 20),
  ('huay-xai-luang-prabang', '2026-08-20', 20),
  ('huay-xai-luang-prabang', '2026-08-27', 20),
  ('huay-xai-luang-prabang', '2026-09-10', 20)
) AS v(tour_id, date, capacity)
ON CONFLICT (tour_id, date) DO NOTHING;
