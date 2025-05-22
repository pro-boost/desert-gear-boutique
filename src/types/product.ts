export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  createdAt: number;
  sizes: string[]; // Available sizes for the product
}

export interface ProductFilters {
  category?: string;
  inStock?: boolean;
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
