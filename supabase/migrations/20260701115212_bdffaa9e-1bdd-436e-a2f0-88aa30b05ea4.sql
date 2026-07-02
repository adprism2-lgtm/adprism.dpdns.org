CREATE TABLE public.exhibitions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  drive_file_id text NOT NULL UNIQUE,
  video_url text NOT NULL,
  thumbnail_url text,
  sort_order integer NOT NULL DEFAULT 0,
  synced_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.exhibitions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exhibitions TO authenticated;
GRANT ALL ON public.exhibitions TO service_role;

ALTER TABLE public.exhibitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exhibitions"
  ON public.exhibitions FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert exhibitions"
  ON public.exhibitions FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update exhibitions"
  ON public.exhibitions FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete exhibitions"
  ON public.exhibitions FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_exhibitions_updated_at
  BEFORE UPDATE ON public.exhibitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();