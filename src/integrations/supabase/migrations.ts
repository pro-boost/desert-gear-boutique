import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const migrateProductsTable = async (client: SupabaseClient<Database>): Promise<void> => {
  try {
    // First, get all products to update
    const { data: products, error: fetchError } = await client
      .from('products')
      .select('*');

    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      throw fetchError;
    }

    // Update each product with the new structure
    for (const product of products) {
      // Type assertion to handle the old schema
      const oldProduct = product as unknown as { description?: string };
      
      const { error: updateError } = await client
        .from('products')
        .update({
          description_fr: oldProduct.description || '', // Use the old description field if it exists
          description_ar: '', // Initialize with empty string
        })
        .eq('id', product.id);

      if (updateError) {
        console.error(`Error updating product ${product.id}:`, updateError);
        throw updateError;
      }
    }

    console.log('Products table migration completed successfully');
  } catch (error) {
    console.error('Error migrating products table:', error);
    throw error;
  }
};

const insertProduct = async (client: SupabaseClient<Database>, product: Omit<Database['public']['Tables']['products']['Insert'], 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await client
    .from('products')
    .insert({
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}; 