
-- Add sort_order column
ALTER TABLE public.cost_items ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

-- Set initial sort_order based on current created_at order within each category
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY created_at ASC) - 1 AS rn
  FROM public.cost_items
)
UPDATE public.cost_items SET sort_order = ordered.rn
FROM ordered WHERE cost_items.id = ordered.id;
