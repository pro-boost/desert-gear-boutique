
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

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'boot-1',
    name: 'Tactical Combat Boots',
    description: 'Professional military-grade combat boots with advanced durability and comfort features.',
    price: 1200,
    discountPrice: 999,
    category: 'boots',
    images: ['https://images.unsplash.com/photo-1452378174528-3090a4bba7b2'],
    inStock: true,
    featured: true,
    createdAt: Date.now(),
    sizes: ['40', '41', '42', '43', '44']
  },
  {
    id: 'jacket-1',
    name: 'Military Field Jacket',
    description: 'All-weather tactical jacket with multiple pockets and waterproof coating.',
    price: 1500,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1493962853295-0fd70327578a'],
    inStock: true,
    featured: true,
    createdAt: Date.now(),
    sizes: ['M', 'L', 'XL']
  },
  {
    id: 'backpack-1',
    name: 'Tactical Backpack',
    description: '45L military-grade backpack with MOLLE system and hydration compatibility.',
    price: 800,
    discountPrice: 650,
    category: 'accessories',
    images: ['https://images.unsplash.com/photo-1465379944081-7f47de8d74ac'],
    inStock: true,
    featured: false,
    createdAt: Date.now(),
    sizes: ['ONE SIZE']
  },
  {
    id: 'pants-1',
    name: 'Combat Cargo Pants',
    description: 'Reinforced tactical pants with multiple pockets and ripstop fabric.',
    price: 600,
    category: 'pants',
    images: ['https://images.unsplash.com/photo-1466721591366-2d5fba72006d'],
    inStock: false,
    featured: false,
    createdAt: Date.now(),
    sizes: ['40', '42', '44']
  }
];
