CREATE TABLE public.whatsapp_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  path TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.whatsapp_clicks TO anon, authenticated;
GRANT SELECT ON public.whatsapp_clicks TO authenticated;
GRANT ALL ON public.whatsapp_clicks TO service_role;
ALTER TABLE public.whatsapp_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log a whatsapp click" ON public.whatsapp_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view whatsapp clicks" ON public.whatsapp_clicks FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));