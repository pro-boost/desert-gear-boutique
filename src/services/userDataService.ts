import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { Product } from '@/types/product';
import { toast } from '@/components/ui/sonner';

// Define the database product type
type DatabaseProduct = {
  id: string;
  name: string;
  description_fr: string;
  description_ar: string;
  price: number;
  discount_price: number | null;
  category_id: string;
  images: string[];
  sizes: string[];
  created_at: string;
  updated_at: string;
};

// Helper function to convert snake_case to camelCase
const convertToCamelCase = (data: DatabaseProduct): Product => ({
  id: data.id,
  name: data.name,
  descriptionFr: data.description_fr,
  descriptionAr: data.description_ar,
  price: data.price,
  discountPrice: data.discount_price,
  categoryId: data.category_id,
  images: data.images,
  sizes: data.sizes,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
  inStock: Array.isArray(data.sizes) && data.sizes.length > 0
});

// Favorites operations
export const getUserFavorites = async (
  client: SupabaseClient<Database>
): Promise<Product[]> => {
  try {
    console.log('Fetching favorites');
    const { data: favorites, error } = await client.rpc('get_user_favorites');

    if (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }

    if (!favorites || favorites.length === 0) {
      console.log('No favorites found');
      return [];
    }

    // Fetch product details for each favorite
    const products = await Promise.all(
      favorites.map(async (favorite) => {
        const { data: product, error: productError } = await client
          .from('products')
          .select('*')
          .eq('id', favorite.product_id)
          .single();

        if (productError) {
          console.error(`Error fetching product ${favorite.product_id}:`, productError);
          throw productError;
        }

        return convertToCamelCase(product);
      })
    );

    console.log('Successfully fetched favorites:', products.length);
    return products;
  } catch (error) {
    console.error('Error in getUserFavorites:', error);
    throw error;
  }
};

export const addToFavorites = async (
  client: SupabaseClient<Database>,
  productId: string
): Promise<void> => {
  try {
    console.log('Adding to favorites:', productId);
    const { error } = await client.rpc('insert_user_favorite', {
      p_product_id: productId.toString()
    });

    if (error) {
      console.error('Error adding to favorites:', error);
      if (error.code === '400') {
        console.error('Bad request - invalid parameters:', error.message);
        throw new Error('Invalid product ID format');
      }
      throw error;
    }

    console.log('Successfully added to favorites');
  } catch (error) {
    console.error('Error in addToFavorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (
  client: SupabaseClient<Database>,
  productId: string
): Promise<void> => {
  try {
    console.log('Removing from favorites:', productId);
    const { error } = await client.rpc('delete_user_favorite', {
      p_product_id: productId.toString()
    });

    if (error) {
      console.error('Error removing from favorites:', error);
      if (error.code === '400') {
        console.error('Bad request - invalid parameters:', error.message);
        throw new Error('Invalid product ID format');
      }
      throw error;
    }

    console.log('Successfully removed from favorites');
  } catch (error) {
    console.error('Error in removeFromFavorites:', error);
    throw error;
  }
};

// Cart operations
export const getUserCartItems = async (
  client: SupabaseClient<Database>
): Promise<Array<{ product: Product; quantity: number; selectedSize: string }>> => {
  try {
    console.log('Fetching cart items');
    const { data: cartItems, error } = await client.rpc('get_user_cart_items');

    if (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }

    if (!cartItems || cartItems.length === 0) {
      console.log('No cart items found');
      return [];
    }

    // Fetch product details for each cart item
    const items = await Promise.all(
      cartItems.map(async (item) => {
        const { data: product, error: productError } = await client
          .from('products')
          .select('*')
          .eq('id', item.product_id)
          .single();

        if (productError) {
          console.error(`Error fetching product ${item.product_id}:`, productError);
          throw productError;
        }

        return {
          product: convertToCamelCase(product),
          quantity: item.quantity,
          selectedSize: item.selected_size
        };
      })
    );

    console.log('Successfully fetched cart items:', items.length);
    return items;
  } catch (error) {
    console.error('Error in getUserCartItems:', error);
    throw error;
  }
};

export const addToCart = async (
  client: SupabaseClient<Database>,
  productId: string,
  quantity: number,
  selectedSize: string
): Promise<void> => {
  try {
    console.log('Adding to cart:', { productId, quantity, selectedSize });
    const { error } = await client.rpc('upsert_cart_item', {
      p_product_id: productId.toString(),
      p_quantity: quantity,
      p_selected_size: selectedSize
    });

    if (error) {
      console.error('Error adding to cart:', error);
      if (error.code === '400') {
        console.error('Bad request - invalid parameters:', error.message);
        throw new Error('Invalid parameters format');
      }
      throw error;
    }

    console.log('Successfully added to cart');
  } catch (error) {
    console.error('Error in addToCart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (
  client: SupabaseClient<Database>,
  productId: string,
  quantity: number,
  selectedSize: string
): Promise<void> => {
  try {
    console.log('Updating cart item quantity:', { productId, quantity, selectedSize });
    const { error } = await client.rpc('upsert_cart_item', {
      p_product_id: productId.toString(),
      p_quantity: quantity,
      p_selected_size: selectedSize
    });

    if (error) {
      console.error('Error updating cart item quantity:', error);
      if (error.code === '400') {
        console.error('Bad request - invalid parameters:', error.message);
        throw new Error('Invalid parameters format');
      }
      throw error;
    }

    console.log('Successfully updated cart item quantity');
  } catch (error) {
    console.error('Error in updateCartItemQuantity:', error);
    throw error;
  }
};

export const removeFromCart = async (
  client: SupabaseClient<Database>,
  productId: string,
  selectedSize: string
): Promise<void> => {
  try {
    console.log('Removing from cart:', { productId, selectedSize });
    const { error } = await client.rpc('delete_cart_item', {
      p_product_id: productId.toString(),
      p_selected_size: selectedSize
    });

    if (error) {
      console.error('Error removing from cart:', error);
      if (error.code === '400') {
        console.error('Bad request - invalid parameters:', error.message);
        throw new Error('Invalid parameters format');
      }
      throw error;
    }

    console.log('Successfully removed from cart');
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    throw error;
  }
};

export const clearCart = async (
  client: SupabaseClient<Database>
): Promise<void> => {
  try {
    console.log('Clearing cart');
    const { error } = await client.rpc('clear_cart');

    if (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }

    console.log('Successfully cleared cart');
  } catch (error) {
    console.error('Error in clearCart:', error);
    throw error;
  }
}; 