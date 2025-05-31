export interface Product {
  id: string;
  name: string;
  descriptionFr: string;
  descriptionAr: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  sizes: string[];
  createdAt: string;
  updatedAt: string;
  // Computed property to determine if product is in stock based on sizes
  inStock?: boolean;
}

export interface ProductFilters {
  category?: string;
  size?: string;
  search?: string;
}

// Add available categories for the application
export const PRODUCT_CATEGORIES = [
  'boots',
  'jackets', 
  'pants', 
  'accessories'
];

// European sizes
export const PRODUCT_SIZES = {
  boots: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
  jackets: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  pants: ['36', '38', '40', '42', '44', '46', '48', '50'],
  accessories: ['ONE SIZE']
};

// Helper function to determine if a product is in stock
export const isProductInStock = (product: Product): boolean => {
  // If the product has no sizes array or empty sizes array, it's out of stock
  return Array.isArray(product.sizes) && product.sizes.length > 0;
};
