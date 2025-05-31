-- Create a function to alter the products table
CREATE OR REPLACE FUNCTION alter_products_table(
  action text,
  columns jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  column_name text;
  column_type text;
  column_def text;
BEGIN
  IF action = 'add_columns' THEN
    FOR column_name, column_type IN SELECT * FROM jsonb_each_text(columns)
    LOOP
      column_def := format('ALTER TABLE products ADD COLUMN IF NOT EXISTS %I %s', column_name, column_type);
      EXECUTE column_def;
    END LOOP;
  ELSIF action = 'drop_columns' THEN
    FOR column_name IN SELECT jsonb_array_elements_text(columns)
    LOOP
      column_def := format('ALTER TABLE products DROP COLUMN IF EXISTS %I', column_name);
      EXECUTE column_def;
    END LOOP;
  ELSE
    RAISE EXCEPTION 'Invalid action: %', action;
  END IF;
END;
$$;

-- Add new description columns
SELECT alter_products_table('add_columns', '{"description_fr": "text", "description_ar": "text"}'::jsonb);

-- Copy data from old description to description_fr
UPDATE products
SET description_fr = description
WHERE description IS NOT NULL;

-- Drop old columns (description, in_stock, and featured)
SELECT alter_products_table('drop_columns', '["description", "in_stock", "featured"]'::jsonb);

-- Drop the function after use
DROP FUNCTION IF EXISTS alter_products_table(text, jsonb); 