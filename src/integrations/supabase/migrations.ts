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

export const migrateCategoryId = async (client: SupabaseClient<Database>): Promise<void> => {
  try {
    // First, get all products to update
    const { data: products, error: fetchError } = await client
      .from('products')
      .select('id, category')
      .returns<Array<{ id: string; category: string }>>();

    if (fetchError) {
      console.error('Error fetching products:', fetchError);
      throw fetchError;
    }

    if (!products) {
      console.error('No products found');
      return;
    }

    // Add category_id column
    const { error: addColumnError } = await client.rpc('alter_products_table', {
      action: 'add_columns',
      columns: { category_id: 'text' }
    });

    if (addColumnError) {
      console.error('Error adding category_id column:', addColumnError);
      throw addColumnError;
    }

    // Update each product with the category name as category_id
    for (const product of products) {
      const { error: updateError } = await client
        .from('products')
        .update({ category_id: product.category })
        .eq('id', product.id);

      if (updateError) {
        console.error(`Error updating product ${product.id}:`, updateError);
        throw updateError;
      }
    }

    // Make category_id column not null
    const { error: alterError } = await client.rpc('alter_products_table', {
      action: 'alter_column',
      columns: { category_id: 'SET NOT NULL' }
    });

    if (alterError) {
      console.error('Error making category_id not null:', alterError);
      throw alterError;
    }

    // Create foreign key constraint
    const { error: fkError } = await client.rpc('alter_products_table', {
      action: 'add_constraint',
      columns: {
        constraint_name: 'fk_products_category',
        constraint_def: 'FOREIGN KEY (category_id) REFERENCES categories(name) ON DELETE RESTRICT ON UPDATE CASCADE'
      }
    });

    if (fkError) {
      console.error('Error adding foreign key constraint:', fkError);
      throw fkError;
    }

    // Create index
    const { error: indexError } = await client.rpc('alter_products_table', {
      action: 'create_index',
      columns: {
        index_name: 'products_category_id_idx',
        index_def: 'USING btree (category_id)'
      }
    });

    if (indexError) {
      console.error('Error creating index:', indexError);
      throw indexError;
    }

    // Drop old category column and its index
    const { error: dropError } = await client.rpc('alter_products_table', {
      action: 'drop_columns',
      columns: ['category']
    });

    if (dropError) {
      console.error('Error dropping category column:', dropError);
      throw dropError;
    }

    console.log('Category ID migration completed successfully');
  } catch (error) {
    console.error('Error migrating category_id:', error);
    throw error;
  }
}; 