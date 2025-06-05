-- Add a new column for UUID
ALTER TABLE categories ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();

-- Add name_fr and name_ar columns if they don't exist
ALTER TABLE categories 
  ADD COLUMN IF NOT EXISTS name_fr TEXT,
  ADD COLUMN IF NOT EXISTS name_ar TEXT;

-- Update existing categories to set name_fr and name_ar
UPDATE categories 
SET name_fr = name,
    name_ar = name
WHERE name_fr IS NULL OR name_ar IS NULL;

-- Make name_fr and name_ar not null after setting values
ALTER TABLE categories 
  ALTER COLUMN name_fr SET NOT NULL,
  ALTER COLUMN name_ar SET NOT NULL;

-- Drop the old name column and its index
DROP INDEX IF EXISTS categories_name_idx;
ALTER TABLE categories DROP COLUMN IF EXISTS name;

-- Create new indexes
CREATE INDEX IF NOT EXISTS categories_name_fr_idx ON categories (name_fr);
CREATE INDEX IF NOT EXISTS categories_name_ar_idx ON categories (name_ar);

-- Make id the primary key
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE categories ADD PRIMARY KEY (id);

-- Update products table to reference the new category id
ALTER TABLE products 
  DROP CONSTRAINT IF EXISTS fk_products_category,
  ALTER COLUMN category_id TYPE UUID USING category_id::UUID;

-- Add foreign key constraint
ALTER TABLE products
  ADD CONSTRAINT fk_products_category
  FOREIGN KEY (category_id)
  REFERENCES categories(id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE; 