-- Seed Chiang Rai van + slow boat and van + train tours for live booking

INSERT INTO public.tours (id, price_thb) VALUES
  ('chiang-rai-slowboat-luang-prabang', 1690),
  ('chiang-rai-train-luang-prabang', 1800)
ON CONFLICT (id) DO UPDATE SET price_thb = EXCLUDED.price_thb;

INSERT INTO public.tour_dates (tour_id, date, capacity, booked_count)
SELECT v.tour_id, v.date::date, v.capacity, 0
FROM (VALUES
  ('chiang-rai-slowboat-luang-prabang', '2026-08-26', 20),
  ('chiang-rai-slowboat-luang-prabang', '2026-09-05', 20),
  ('chiang-rai-slowboat-luang-prabang', '2026-09-19', 20),
  ('chiang-rai-train-luang-prabang', '2026-08-25', 20),
  ('chiang-rai-train-luang-prabang', '2026-09-08', 20),
  ('chiang-rai-train-luang-prabang', '2026-09-22', 20)
) AS v(tour_id, date, capacity)
ON CONFLICT (tour_id, date) DO NOTHING;
