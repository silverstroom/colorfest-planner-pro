
-- Add anticipo tracking to cost_items
ALTER TABLE public.cost_items ADD COLUMN anticipo_persona TEXT;
ALTER TABLE public.cost_items ADD COLUMN anticipo_importo NUMERIC NOT NULL DEFAULT 0;
