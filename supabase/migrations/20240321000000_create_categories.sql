-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  name TEXT PRIMARY KEY,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for different operations

-- Allow public read access to all categories
CREATE POLICY "Allow public read access"
ON categories FOR SELECT
TO public
USING (true);

-- Allow authenticated users with admin role to perform all operations
CREATE POLICY "Allow admin users full access"
ON categories
TO authenticated
USING (
  -- Check if the user has the admin role in their JWT
  (auth.jwt() ->> 'role')::text = 'authenticated'
  AND
  -- Check if the user has admin metadata from Clerk
  (auth.jwt() ->> 'isAdmin')::boolean = true
)
WITH CHECK (
  (auth.jwt() ->> 'role')::text = 'authenticated'
  AND
  (auth.jwt() ->> 'isAdmin')::boolean = true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS categories_name_idx ON categories (name);
CREATE INDEX IF NOT EXISTS categories_created_at_idx ON categories (created_at DESC);

-- Insert default categories
INSERT INTO categories (name, sizes) VALUES
  ('boots', ARRAY['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']),
  ('jackets', ARRAY['S', 'M', 'L', 'XL', 'XXL']),
  ('accessories', ARRAY['One Size'])
ON CONFLICT (name) DO NOTHING; 