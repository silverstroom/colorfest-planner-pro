
-- Cost items table
CREATE TABLE public.cost_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  paid NUMERIC NOT NULL DEFAULT 0,
  to_pay NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Revenue items table
CREATE TABLE public.revenue_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  estimated NUMERIC NOT NULL DEFAULT 0,
  actual NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_items ENABLE ROW LEVEL SECURITY;

-- Public access policies (everyone can read/write)
CREATE POLICY "Public read cost_items" ON public.cost_items FOR SELECT USING (true);
CREATE POLICY "Public insert cost_items" ON public.cost_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update cost_items" ON public.cost_items FOR UPDATE USING (true);
CREATE POLICY "Public delete cost_items" ON public.cost_items FOR DELETE USING (true);

CREATE POLICY "Public read revenue_items" ON public.revenue_items FOR SELECT USING (true);
CREATE POLICY "Public insert revenue_items" ON public.revenue_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update revenue_items" ON public.revenue_items FOR UPDATE USING (true);
CREATE POLICY "Public delete revenue_items" ON public.revenue_items FOR DELETE USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_cost_items_updated_at
  BEFORE UPDATE ON public.cost_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_revenue_items_updated_at
  BEFORE UPDATE ON public.revenue_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
