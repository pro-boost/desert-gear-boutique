
import { Product, ProductFilters, SAMPLE_PRODUCTS } from '@/types/product';

// Save products to localStorage
export const saveProducts = (products: Product[]): void => {
  localStorage.setItem('products', JSON.stringify(products));
};

// Get products from localStorage or use default samples
export const getProducts = (): Product[] => {
  const storedProducts = localStorage.getItem('products');
  if (storedProducts) {
    return JSON.parse(storedProducts);
  }

  // If no products in localStorage, use imported sample products
  saveProducts(SAMPLE_PRODUCTS);
  return SAMPLE_PRODUCTS;
};

// Get a product by ID
export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(product => product.id === id);
};

// Add a new product
export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  const products = getProducts();
  
  const newProduct: Product = {
    ...product,
    id: `${product.category}-${Date.now()}`,
    createdAt: Date.now(),
  };
  
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

// Update an existing product
export const updateProduct = (updatedProduct: Product): Product => {
  const products = getProducts();
  
  const updatedProducts = products.map(product => 
    product.id === updatedProduct.id ? updatedProduct : product
  );
  
  saveProducts(updatedProducts);
  return updatedProduct;
};

// Delete a product by ID
export const deleteProduct = (id: string): void => {
  const products = getProducts();
  const filteredProducts = products.filter(product => product.id !== id);
  saveProducts(filteredProducts);
};

// Filter products based on criteria
export const filterProducts = (filters: ProductFilters): Product[] => {
  const products = getProducts();
  
  return products.filter(product => {
    // Filter by category if specified
    if (filters.category && filters.category !== 'all') {
      if (product.category !== filters.category) {
        return false;
      }
    }
    
    // Filter by stock status if specified
    if (filters.inStock !== undefined) {
      if (product.inStock !== filters.inStock) {
        return false;
      }
    }
    
    // Filter by search term if specified
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      const descMatch = product.description.toLowerCase().includes(searchTerm);
      if (!nameMatch && !descMatch) {
        return false;
      }
    }
    
    return true;
  });
};

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  const products = getProducts();
  return products.filter(product => product.featured);
};

// Get new arrivals (most recent products)
export const getNewArrivals = (count: number = 4): Product[] => {
  const products = getProducts();
  return [...products]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, count);
};

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  const products = getProducts();
  return products.filter(product => product.category === category);
};
