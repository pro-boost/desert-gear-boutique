import { SupabaseClient } from '@supabase/supabase-js';
import { Product, ProductFilters, PRODUCT_CATEGORIES } from '@/types/product';
import { toast } from '@/components/ui/sonner';
import type { Database } from '@/integrations/supabase/types';

type ProductRecord = Database['public']['Tables']['products']['Insert'];

// Helper function to convert snake_case to camelCase
const convertToCamelCase = <T>(obj: Record<string, unknown>): T => {
  if (Array.isArray(obj)) {
    return obj.map(convertToCamelCase) as T;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = convertToCamelCase(obj[key] as Record<string, unknown>);
      return acc;
    }, {} as Record<string, unknown>) as T;
  }
  return obj as T;
};

// Helper function to convert camelCase to snake_case
const convertToSnakeCase = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): ProductRecord => {
  return {
    name: product.name,
    description_fr: product.descriptionFr,
    description_ar: product.descriptionAr,
    price: product.price,
    discount_price: product.discountPrice ?? null,
    category: product.category,
    images: product.images,
    sizes: product.sizes,
  };
};

// Save products to localStorage
export const saveProducts = (products: Product[]): void => {
  localStorage.setItem('products', JSON.stringify(products));
};

// Save categories to localStorage
export const saveCategories = (categories: string[]): void => {
  localStorage.setItem('categories', JSON.stringify(categories));
};

// Add interfaces for category management
interface Category {
  nameFr: string;
  nameAr: string;
  sizes: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Check if categories table exists
export const ensureCategoriesTable = async (
  client: SupabaseClient<Database>
): Promise<boolean> => {
  try {
    // Use a simple count query like the authentication test
    const { data, error } = await client
      .from('categories')
      .select('count')
      .limit(1);

    if (error) {
      // If the error is about the table not existing, we'll handle that in the addCategory function
      if (error.message.includes('does not exist')) {
        console.log('Categories table does not exist yet');
        return true; // Return true to allow the addCategory function to create it
      }
      console.error('Error accessing categories table:', error);
      toast.error('Failed to access categories table');
        return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking categories table:', error);
    toast.error('Failed to check categories table');
    return false;
  }
};

// Get categories from localStorage or use default ones
export const getCategories = async (
  client: SupabaseClient<Database>
): Promise<Category[]> => {
  try {
    await ensureCategoriesTable(client);

    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('name_fr');

    if (error) throw error;

    return data.map(category => ({
      nameFr: category.name_fr,
      nameAr: category.name_ar,
      sizes: category.sizes,
      createdAt: category.created_at,
      updatedAt: category.updated_at
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    toast.error('Failed to fetch categories');
    return [];
  }
};

// Add a new category
export const addCategory = async (
  client: SupabaseClient<Database>,
  category: Omit<Category, 'createdAt' | 'updatedAt'>
): Promise<Category | null> => {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await client
      .from('categories')
      .insert({
        name_fr: category.nameFr,
        name_ar: category.nameAr,
        sizes: category.sizes,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error?.message?.includes('does not exist')) {
      console.log('Creating categories table...');
      const { error: createError } = await client.rpc('create_categories_table');
      
      if (createError) {
        console.error('Error creating categories table:', createError);
        toast.error('Failed to create categories table');
        return null;
      }

      const { data: retryData, error: retryError } = await client
        .from('categories')
        .insert({
          name_fr: category.nameFr,
          name_ar: category.nameAr,
          sizes: category.sizes,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();

      if (retryError) throw retryError;
      return {
        nameFr: retryData.name_fr,
        nameAr: retryData.name_ar,
        sizes: retryData.sizes,
        createdAt: retryData.created_at,
        updatedAt: retryData.updated_at
      };
    }

    if (error) throw error;

    return {
      nameFr: data.name_fr,
      nameAr: data.name_ar,
      sizes: data.sizes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error adding category:', error);
    toast.error('Failed to add category');
    return null;
  }
};

// Update a category
export const updateCategory = async (
  client: SupabaseClient<Database>,
  category: Omit<Category, 'createdAt' | 'updatedAt'>
): Promise<Category | null> => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await client
      .from('categories')
      .update({
        name_ar: category.nameAr,
        sizes: category.sizes,
        updated_at: now
      })
      .eq('name_fr', category.nameFr)
      .select()
      .single();

    if (error) throw error;

    return {
      nameFr: data.name_fr,
      nameAr: data.name_ar,
      sizes: data.sizes,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error('Error updating category:', error);
    toast.error('Failed to update category');
    return null;
  }
};

// Delete a category
export const deleteCategory = async (
  client: SupabaseClient<Database>,
  categoryNameFr: string
): Promise<boolean> => {
  try {
    const { error } = await client
      .from('categories')
      .delete()
      .eq('name_fr', categoryNameFr);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.error('Failed to delete category');
    return false;
  }
};

// Get all products
export const getProducts = async (client: SupabaseClient<Database>): Promise<Product[]> => {
  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(convertToCamelCase<Product>);
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.error('Failed to fetch products');
    return [];
  }
};

// Get a single product by ID
export const getProductById = async (client: SupabaseClient<Database>, id: string): Promise<Product | null> => {
  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return convertToCamelCase<Product>(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    toast.error('Failed to fetch product');
    return null;
  }
};

// Add a new product
export const addProduct = async (
  client: SupabaseClient<Database>,
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product | null> => {
  try {
    const productData: ProductRecord = {
      ...convertToSnakeCase(product),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Error details:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned after insert');
    }

    return convertToCamelCase<Product>(data);
  } catch (error) {
    console.error('Error adding product:', error);
    toast.error('Failed to add product');
    return null;
  }
};

// Update a product
export const updateProduct = async (
  client: SupabaseClient<Database>,
  product: Product
): Promise<Product | null> => {
  try {
    const productData: Database['public']['Tables']['products']['Update'] = {
      ...convertToSnakeCase(product),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('products')
      .update(productData)
      .eq('id', product.id)
      .select()
      .single();

    if (error) throw error;

    return convertToCamelCase<Product>(data);
  } catch (error) {
    console.error('Error updating product:', error);
    toast.error('Failed to update product');
    return null;
  }
};

// Delete a product
export const deleteProduct = async (
  client: SupabaseClient<Database>,
  id: string
): Promise<boolean> => {
  try {
    const { error } = await client
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    toast.error('Failed to delete product');
    return false;
  }
};

// Define essential fields for product listings
const ESSENTIAL_FIELDS = 'id, name, description_fr, description_ar, price, discount_price, images, category, sizes, created_at, updated_at';

// Get featured products with essential fields
export const getFeaturedProducts = async (client: SupabaseClient<Database>): Promise<Product[]> => {
  try {
    const { data, error } = await client
      .from('products')
      .select(ESSENTIAL_FIELDS)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;

    return data.map(convertToCamelCase<Product>);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    toast.error('Failed to fetch featured products');
    return [];
  }
};

// Get new arrivals with essential fields
export const getNewArrivals = async (
  client: SupabaseClient<Database>,
  count: number = 6
): Promise<Product[]> => {
  try {
    const { data, error } = await client
      .from('products')
      .select(ESSENTIAL_FIELDS)
      .order('created_at', { ascending: false })
      .limit(count);

    if (error) throw error;

    return data.map(convertToCamelCase<Product>);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    toast.error('Failed to fetch new arrivals');
    return [];
  }
};

// Get products by category with essential fields and pagination
export const getProductsByCategory = async (
  client: SupabaseClient<Database>,
  category: string,
  page: number = 1,
  pageSize: number = 12
): Promise<{ products: Product[]; total: number }> => {
  try {
    // Get total count
    const { count, error: countError } = await client
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category', category);

    if (countError) throw countError;

    // Get paginated products
    const { data, error } = await client
      .from('products')
      .select(ESSENTIAL_FIELDS)
      .eq('category', category)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;

    return {
      products: data.map(convertToCamelCase<Product>),
      total: count || 0
    };
  } catch (error) {
    console.error('Error fetching products by category:', error);
    toast.error('Failed to fetch products by category');
    return { products: [], total: 0 };
  }
};

// Filter products with essential fields and pagination
export const filterProducts = async (
  client: SupabaseClient<Database>,
  filters: ProductFilters,
  page: number = 1,
  pageSize: number = 12
): Promise<{ products: Product[]; total: number }> => {
  try {
    let query = client
      .from('products')
      .select(ESSENTIAL_FIELDS, { count: 'exact' });

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Apply size filter
    if (filters.size && filters.size !== 'all') {
      query = query.contains('sizes', [filters.size]);
    }

    // Apply search filter
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description_fr.ilike.%${filters.search}%,description_ar.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;

    return {
      products: data.map(convertToCamelCase<Product>),
      total: count || 0
    };
  } catch (error) {
    console.error('Error filtering products:', error);
    toast.error('Failed to filter products');
    return { products: [], total: 0 };
  }
};
