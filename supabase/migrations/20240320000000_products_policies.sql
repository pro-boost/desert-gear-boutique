-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for different operations

-- Allow public read access to all products
CREATE POLICY "Allow public read access"
ON products FOR SELECT
TO public
USING (true);

-- Allow authenticated users with admin role to perform all operations
CREATE POLICY "Allow admin users full access"
ON products
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
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products (featured);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products (created_at DESC); 