-- Two more Train K11 routes from Chiang Rai: Vang Vieng and Vientiane.
-- Same train as the Luang Prabang service, so the departure days are copied
-- from it to keep the three schedules in sync.

INSERT INTO public.tours (id, price_thb) VALUES
  ('chiang-rai-train-vang-vieng', 1800),
  ('chiang-rai-train-vientiane', 1800)
ON CONFLICT (id) DO UPDATE SET price_thb = EXCLUDED.price_thb;

INSERT INTO public.tour_dates (tour_id, date, capacity, booked_count)
SELECT v.new_tour_id, d.date, d.capacity, 0
FROM public.tour_dates d
CROSS JOIN (VALUES
  ('chiang-rai-train-vang-vieng'),
  ('chiang-rai-train-vientiane')
) AS v(new_tour_id)
WHERE d.tour_id = 'chiang-rai-train-luang-prabang'
ON CONFLICT (tour_id, date) DO NOTHING;
