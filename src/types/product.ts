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
