-- Add position column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'position'
  ) THEN
    -- Add position column
    ALTER TABLE public.products ADD COLUMN position integer;

    -- Update existing products with sequential positions
    WITH numbered_products AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
      FROM public.products
    )
    UPDATE public.products p
    SET position = np.row_num
    FROM numbered_products np
    WHERE p.id = np.id;

    -- Make position column not null after setting values
    ALTER TABLE public.products ALTER COLUMN position SET NOT NULL;

    -- Create index on position
    CREATE INDEX IF NOT EXISTS products_position_idx ON public.products USING btree (position);
  END IF;
END $$; 