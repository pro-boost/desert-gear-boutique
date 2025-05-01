
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { filterProducts, getCategories } from '@/services/productService';
import { ProductFilters, Product } from '@/types/product';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from 'lucide-react';

const ProductsPage = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // Get initial filter values from URL parameters
  const initialCategory = searchParams.get('category') || 'all';
  // Set inStock to true by default
  const initialInStock = searchParams.get('inStock') === 'false' ? false : true; // Default to true
  const initialSearch = searchParams.get('search') || '';
  
  // State for filters
  const [filters, setFilters] = useState<ProductFilters>({
    category: initialCategory as any,
    inStock: initialInStock,
    search: initialSearch,
  });
  
  // State for products and categories
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(initialSearch);
  
  // Load categories
  useEffect(() => {
    setCategories(getCategories());
  }, []);
  
  // Update filters when URL parameters change (for footer links)
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
  }, [location.search, searchParams]);
  
  // Load products when filters change
  useEffect(() => {
    const filtered = filterProducts(filters);
    setProducts(filtered);
    
    // Update URL parameters
    const newParams = new URLSearchParams();
    if (filters.category && filters.category !== 'all') {
      newParams.set('category', filters.category);
    }
    if (filters.inStock === false) {
      newParams.set('inStock', 'false');
    } else {
      newParams.set('inStock', 'true');
    }
    if (filters.search) {
      newParams.set('search', filters.search);
    }
    setSearchParams(newParams);
  }, [filters, setSearchParams]);
  
  // Handle filter changes
  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
  };
  
  const handleStockChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, inStock: checked }));
  };
  
  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchValue }));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const clearFilters = () => {
    setFilters({ category: 'all', inStock: true, search: '' }); // Default inStock to true
    setSearchValue('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-8">{t('ourProducts')}</h1>
          
          {/* Filters */}
          <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-grow">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={t('search')}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0"
                    onClick={handleSearch}
                  >
                    <Search size={18} />
                  </Button>
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="w-full md:w-48">
                <Select 
                  value={filters.category || 'all'} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allProducts')}</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {t(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* In Stock Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="inStock" 
                  checked={filters.inStock} 
                  onCheckedChange={handleStockChange} 
                />
                <label htmlFor="inStock" className="text-sm cursor-pointer">
                  {t('inStock')}
                </label>
              </div>
              
              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters}>
                {t('cancel')}
              </Button>
            </div>
          </div>
          
          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                {t('cancel')}
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
