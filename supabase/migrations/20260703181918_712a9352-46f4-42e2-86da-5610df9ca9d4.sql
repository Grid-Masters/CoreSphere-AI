-- ============================================================
-- Phase D — Recognition: Hall of Excellence
-- Tables: recognition_photos, recognition_archives
-- Storage policies for the private "recognition" bucket
-- ============================================================

-- Champion / recognition portrait photos
CREATE TABLE public.recognition_photos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_email text NOT NULL,
  category text NOT NULL,
  photo_path text NOT NULL,
  caption text,
  uploaded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.recognition_photos TO authenticated;
GRANT ALL ON public.recognition_photos TO service_role;

ALTER TABLE public.recognition_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated view recognition photos"
  ON public.recognition_photos FOR SELECT TO authenticated USING (true);

CREATE POLICY "L&D and admins manage recognition photos"
  ON public.recognition_photos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'sysadmin') OR public.has_role(auth.uid(), 'group_head'))
  WITH CHECK (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'sysadmin') OR public.has_role(auth.uid(), 'group_head'));

CREATE TRIGGER update_recognition_photos_updated_at
  BEFORE UPDATE ON public.recognition_photos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Monthly recognition ceremony archives
CREATE TABLE public.recognition_archives (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month text NOT NULL,
  category text NOT NULL,
  department text,
  winner_email text NOT NULL,
  winner_name text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  citation text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.recognition_archives TO authenticated;
GRANT ALL ON public.recognition_archives TO service_role;

ALTER TABLE public.recognition_archives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated view recognition archives"
  ON public.recognition_archives FOR SELECT TO authenticated USING (true);

CREATE POLICY "L&D and admins manage recognition archives"
  ON public.recognition_archives FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'sysadmin') OR public.has_role(auth.uid(), 'group_head'))
  WITH CHECK (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'sysadmin') OR public.has_role(auth.uid(), 'group_head'));

-- Storage policies for the private "recognition" bucket
CREATE POLICY "Authenticated read recognition files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'recognition');

CREATE POLICY "L&D and admins upload recognition files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'recognition' AND (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'sysadmin') OR public.has_role(auth.uid(), 'group_head')));

CREATE POLICY "L&D and admins update recognition files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'recognition' AND (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'sysadmin') OR public.has_role(auth.uid(), 'group_head')));

CREATE POLICY "L&D and admins delete recognition files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'recognition' AND (public.has_role(auth.uid(), 'ld') OR public.has_role(auth.uid(), 'sysadmin') OR public.has_role(auth.uid(), 'group_head')));
