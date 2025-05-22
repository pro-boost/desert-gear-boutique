import { SupabaseClient } from '@supabase/supabase-js';
import { Product, ProductFilters, SAMPLE_PRODUCTS, PRODUCT_CATEGORIES } from '@/types/product';
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
const convertToSnakeCase = (product: Omit<Product, 'id' | 'createdAt'>): ProductRecord => {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    discount_price: product.discountPrice ?? null,
    category: product.category,
    images: product.images,
    in_stock: product.inStock,
    featured: product.featured,
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

// Get categories from localStorage or use default ones
export const getCategories = (): string[] => {
  const storedCategories = localStorage.getItem('categories');
  if (storedCategories) {
    try {
      return JSON.parse(storedCategories);
    } catch (error) {
      console.error("Failed to parse categories from localStorage:", error);
      // If parsing fails, use default categories
      saveCategories(PRODUCT_CATEGORIES);
      return [...PRODUCT_CATEGORIES];
    }
  }

  // If no categories in localStorage, use imported default categories
  saveCategories(PRODUCT_CATEGORIES);
  return [...PRODUCT_CATEGORIES];
};

// Add a new category
export const addCategory = (category: string): boolean => {
  const categories = getCategories();
  
  // Check if category already exists (case insensitive)
  if (categories.some(c => c.toLowerCase() === category.toLowerCase())) {
    return false;
  }
  
  categories.push(category);
  saveCategories(categories);
  return true;
};

// Reset products to sample data
export const resetProducts = (): void => {
  // Clear existing products
  localStorage.removeItem('products');
  // Save sample products
  saveProducts(SAMPLE_PRODUCTS);
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
  product: Omit<Product, 'id' | 'createdAt'>
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

    if (error) throw error;

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

// Filter products based on criteria
export const filterProducts = async (
  client: SupabaseClient<Database>,
  filters: ProductFilters
): Promise<Product[]> => {
  try {
    let query = client
      .from('products')
      .select('*');

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    // Apply stock status filter
    if (filters.inStock !== undefined) {
      query = query.eq('in_stock', filters.inStock);
    }

    // Apply search filter
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(convertToCamelCase<Product>);
  } catch (error) {
    console.error('Error filtering products:', error);
    toast.error('Failed to filter products');
    return [];
  }
};

// Get featured products
export const getFeaturedProducts = async (client: SupabaseClient<Database>): Promise<Product[]> => {
  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(convertToCamelCase<Product>);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    toast.error('Failed to fetch featured products');
    return [];
  }
};

// Get new arrivals (most recent products)
export const getNewArrivals = async (
  client: SupabaseClient<Database>,
  count: number = 4
): Promise<Product[]> => {
  try {
    const { data, error } = await client
      .from('products')
      .select('*')
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

// Get products by category
export const getProductsByCategory = async (
  client: SupabaseClient<Database>,
  category: string
): Promise<Product[]> => {
  try {
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(convertToCamelCase<Product>);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    toast.error('Failed to fetch products by category');
    return [];
  }
};
