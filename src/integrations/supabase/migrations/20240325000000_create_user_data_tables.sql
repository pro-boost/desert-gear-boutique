-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create secure RPC functions for favorites
CREATE OR REPLACE FUNCTION insert_user_favorite(p_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_favorites (user_id, product_id)
  VALUES ((auth.jwt() ->> 'sub')::text, p_product_id);
END;
$$;

CREATE OR REPLACE FUNCTION delete_user_favorite(p_product_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM user_favorites
  WHERE user_id = (auth.jwt() ->> 'sub')::text
  AND product_id = p_product_id;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_favorites()
RETURNS TABLE (
  id UUID,
  product_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT f.id, f.product_id, f.created_at, f.updated_at
  FROM user_favorites f
  WHERE f.user_id = (auth.jwt() ->> 'sub')::text;
END;
$$;

-- Create secure RPC functions for cart
CREATE OR REPLACE FUNCTION upsert_cart_item(
  p_product_id UUID,
  p_quantity INTEGER,
  p_selected_size TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_cart_items (user_id, product_id, quantity, selected_size)
  VALUES ((auth.jwt() ->> 'sub')::text, p_product_id, p_quantity, p_selected_size)
  ON CONFLICT (user_id, product_id, selected_size)
  DO UPDATE SET
    quantity = EXCLUDED.quantity,
    updated_at = NOW();
END;
$$;

CREATE OR REPLACE FUNCTION delete_cart_item(
  p_product_id UUID,
  p_selected_size TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM user_cart_items
  WHERE user_id = (auth.jwt() ->> 'sub')::text
  AND product_id = p_product_id
  AND selected_size = p_selected_size;
END;
$$;

CREATE OR REPLACE FUNCTION clear_cart()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM user_cart_items
  WHERE user_id = (auth.jwt() ->> 'sub')::text;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_cart_items()
RETURNS TABLE (
  id UUID,
  product_id UUID,
  quantity INTEGER,
  selected_size TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.product_id, c.quantity, c.selected_size, c.created_at, c.updated_at
  FROM user_cart_items c
  WHERE c.user_id = (auth.jwt() ->> 'sub')::text;
END;
$$;

-- Create a function to create user data tables
CREATE OR REPLACE FUNCTION create_user_data_tables()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create user_favorites table
  CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    product_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_favorites_product_id_fkey FOREIGN KEY (product_id)
      REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_favorite UNIQUE (user_id, product_id)
  );

  -- Create user_cart_items table
  CREATE TABLE IF NOT EXISTS user_cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    selected_size TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_cart_items_product_id_fkey FOREIGN KEY (product_id)
      REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_product_size UNIQUE (user_id, product_id, selected_size)
  );

  -- Enable Row Level Security
  ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
  ALTER TABLE user_cart_items ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own favorites" ON user_favorites;
  DROP POLICY IF EXISTS "Users can manage their own favorites" ON user_favorites;
  DROP POLICY IF EXISTS "Users can view their own cart items" ON user_cart_items;
  DROP POLICY IF EXISTS "Users can manage their own cart items" ON user_cart_items;

  -- Create policies for user_favorites
  CREATE POLICY "Users can view their own favorites"
    ON user_favorites FOR SELECT
    TO authenticated
    USING (user_id = (auth.jwt() ->> 'sub')::text);

  CREATE POLICY "Users can manage their own favorites"
    ON user_favorites FOR ALL
    TO authenticated
    USING (user_id = (auth.jwt() ->> 'sub')::text)
    WITH CHECK (user_id = (auth.jwt() ->> 'sub')::text);

  -- Create policies for user_cart_items
  CREATE POLICY "Users can view their own cart items"
    ON user_cart_items FOR SELECT
    TO authenticated
    USING (user_id = (auth.jwt() ->> 'sub')::text);

  CREATE POLICY "Users can manage their own cart items"
    ON user_cart_items FOR ALL
    TO authenticated
    USING (user_id = (auth.jwt() ->> 'sub')::text)
    WITH CHECK (user_id = (auth.jwt() ->> 'sub')::text);

  -- Create indexes
  CREATE INDEX IF NOT EXISTS user_favorites_user_id_idx ON user_favorites (user_id);
  CREATE INDEX IF NOT EXISTS user_favorites_product_id_idx ON user_favorites (product_id);
  CREATE INDEX IF NOT EXISTS user_cart_items_user_id_idx ON user_cart_items (user_id);
  CREATE INDEX IF NOT EXISTS user_cart_items_product_id_idx ON user_cart_items (product_id);

  -- Create triggers
  DROP TRIGGER IF EXISTS update_user_favorites_updated_at ON user_favorites;
  CREATE TRIGGER update_user_favorites_updated_at
    BEFORE UPDATE ON user_favorites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  DROP TRIGGER IF EXISTS update_user_cart_items_updated_at ON user_cart_items;
  CREATE TRIGGER update_user_cart_items_updated_at
    BEFORE UPDATE ON user_cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  -- Grant execute permissions on RPC functions
  GRANT EXECUTE ON FUNCTION insert_user_favorite(UUID) TO authenticated;
  GRANT EXECUTE ON FUNCTION delete_user_favorite(UUID) TO authenticated;
  GRANT EXECUTE ON FUNCTION get_user_favorites() TO authenticated;
  GRANT EXECUTE ON FUNCTION upsert_cart_item(UUID, INTEGER, TEXT) TO authenticated;
  GRANT EXECUTE ON FUNCTION delete_cart_item(UUID, TEXT) TO authenticated;
  GRANT EXECUTE ON FUNCTION clear_cart() TO authenticated;
  GRANT EXECUTE ON FUNCTION get_user_cart_items() TO authenticated;
END;
$$;

-- Execute the function to create the tables
SELECT create_user_data_tables(); 