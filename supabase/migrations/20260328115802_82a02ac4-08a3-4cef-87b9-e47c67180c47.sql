-- Create spots table
CREATE TABLE public.spots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_desc TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'সৈকত',
  location TEXT NOT NULL DEFAULT '',
  how_to_reach TEXT NOT NULL DEFAULT '',
  what_to_see TEXT NOT NULL DEFAULT '',
  tips TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  popular BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spot_images table
CREATE TABLE public.spot_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id UUID NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lists table
CREATE TABLE public.lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create list_spots junction table
CREATE TABLE public.list_spots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  spot_id UUID NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(list_id, spot_id)
);

-- Enable RLS on all tables
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spot_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_spots ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can view spots" ON public.spots FOR SELECT USING (true);
CREATE POLICY "Anyone can view spot images" ON public.spot_images FOR SELECT USING (true);
CREATE POLICY "Anyone can view lists" ON public.lists FOR SELECT USING (true);
CREATE POLICY "Anyone can view list spots" ON public.list_spots FOR SELECT USING (true);

-- Admin write policies (authenticated users only)
CREATE POLICY "Auth users can insert spots" ON public.spots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update spots" ON public.spots FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete spots" ON public.spots FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can insert spot images" ON public.spot_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update spot images" ON public.spot_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete spot images" ON public.spot_images FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can insert lists" ON public.lists FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update lists" ON public.lists FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete lists" ON public.lists FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can insert list spots" ON public.list_spots FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update list spots" ON public.list_spots FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete list spots" ON public.list_spots FOR DELETE TO authenticated USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_spots_updated_at BEFORE UPDATE ON public.spots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON public.lists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_spots_slug ON public.spots(slug);
CREATE INDEX idx_spots_category ON public.spots(category);
CREATE INDEX idx_spot_images_spot_id ON public.spot_images(spot_id);
CREATE INDEX idx_list_spots_list_id ON public.list_spots(list_id);
CREATE INDEX idx_list_spots_spot_id ON public.list_spots(spot_id);

-- Create storage bucket for spot images
INSERT INTO storage.buckets (id, name, public) VALUES ('spot-images', 'spot-images', true);

-- Storage policies
CREATE POLICY "Anyone can view spot images in storage" ON storage.objects FOR SELECT USING (bucket_id = 'spot-images');
CREATE POLICY "Auth users can upload spot images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'spot-images');
CREATE POLICY "Auth users can update spot images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'spot-images');
CREATE POLICY "Auth users can delete spot images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'spot-images');