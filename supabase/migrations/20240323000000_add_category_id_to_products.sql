-- Add category_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'category_id'
  ) THEN
    -- Add category_id column
    ALTER TABLE public.products ADD COLUMN category_id TEXT;

    -- Update existing products to use the category name as category_id
    UPDATE public.products
    SET category_id = category
    WHERE category IS NOT NULL;

    -- Make category_id column not null after setting values
    ALTER TABLE public.products ALTER COLUMN category_id SET NOT NULL;

    -- Create foreign key constraint to categories table
    ALTER TABLE public.products
    ADD CONSTRAINT fk_products_category
    FOREIGN KEY (category_id)
    REFERENCES public.categories(name)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

    -- Create index on category_id
    CREATE INDEX IF NOT EXISTS products_category_id_idx ON public.products USING btree (category_id);

    -- Drop the old category column and its index
    DROP INDEX IF EXISTS products_category_idx;
    ALTER TABLE public.products DROP COLUMN IF EXISTS category;
  END IF;
END $$; 