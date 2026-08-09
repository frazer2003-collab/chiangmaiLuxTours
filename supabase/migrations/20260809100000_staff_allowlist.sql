-- Staff allowlist: use when Supabase Dashboard won't edit Raw App Meta Data.
-- Run in SQL Editor after the main admin migration.

CREATE TABLE IF NOT EXISTS public.staff_emails (
  email text PRIMARY KEY CHECK (email = lower(email))
);

ALTER TABLE public.staff_emails ENABLE ROW LEVEL SECURITY;

-- Signed-in users may check whether their own email is on the list.
CREATE POLICY "staff_emails_self_read"
  ON public.staff_emails FOR SELECT
  TO authenticated
  USING (lower(email) = lower(auth.jwt() ->> 'email'));

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'staff'
    OR EXISTS (
      SELECT 1
      FROM public.staff_emails se
      WHERE se.email = lower(coalesce(auth.jwt() ->> 'email', ''))
    ),
    false
  );
$$;

-- Add your staff login email(s) here (lowercase):
INSERT INTO public.staff_emails (email) VALUES
  ('admin@hotmail.com')
ON CONFLICT (email) DO NOTHING;

-- Optional: also set app metadata via SQL (dashboard JSON view is read-only):
UPDATE auth.users
SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"staff"}'::jsonb
WHERE lower(email) = lower('admin@hotmail.com');
