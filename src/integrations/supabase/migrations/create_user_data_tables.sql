-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Create user_cart_items table
CREATE TABLE IF NOT EXISTS user_cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    selected_size TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id, selected_size)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cart_items_user_id ON user_cart_items(user_id);

-- Add RLS policies
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for user_favorites
CREATE POLICY "Users can view their own favorites"
    ON user_favorites FOR SELECT
    USING (user_id = (auth.jwt() ->> 'user_id')::text);

CREATE POLICY "Users can insert their own favorites"
    ON user_favorites FOR INSERT
    WITH CHECK (user_id = (auth.jwt() ->> 'user_id')::text);

CREATE POLICY "Users can delete their own favorites"
    ON user_favorites FOR DELETE
    USING (user_id = (auth.jwt() ->> 'user_id')::text);

-- Create policies for user_cart_items
CREATE POLICY "Users can view their own cart items"
    ON user_cart_items FOR SELECT
    USING (user_id = (auth.jwt() ->> 'user_id')::text);

CREATE POLICY "Users can insert their own cart items"
    ON user_cart_items FOR INSERT
    WITH CHECK (user_id = (auth.jwt() ->> 'user_id')::text);

CREATE POLICY "Users can update their own cart items"
    ON user_cart_items FOR UPDATE
    USING (user_id = (auth.jwt() ->> 'user_id')::text);

CREATE POLICY "Users can delete their own cart items"
    ON user_cart_items FOR DELETE
    USING (user_id = (auth.jwt() ->> 'user_id')::text); 