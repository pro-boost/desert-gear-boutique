import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { filterProducts, getCategories } from "@/services/productService";
import { ProductFilters as Filters, Product } from "@/types/product";
import { useSupabase } from "@/hooks/useSupabase";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ProductSearch } from "@/components/products/ProductSearch";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";

const ProductsPage = () => {
  const { t } = useLanguage();
  const { getClient } = useSupabase();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  // Initialize filters from URL
  const initialCategory = searchParams.get("category") || "all";
  const initialSize = searchParams.get("size") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [filters, setFilters] = useState<Filters>({
    category: initialCategory,
    size: initialSize,
    search: initialSearch,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<
    { name: string; sizes: string[] }[]
  >([]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const client = await getClient();
        const categoriesData = await getCategories(client);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, [getClient]);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const client = await getClient();
        const { products: filteredProducts, total } = await filterProducts(
          client,
          filters
        );
        setProducts(filteredProducts);
        setTotalProducts(total);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters, getClient]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setSearchParams((prev) => {
      if (value) {
        prev.set("search", value);
      } else {
        prev.delete("search");
      }
      return prev;
    });
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
    setSearchParams((prev) => {
      if (value && value !== "all") {
        prev.set("category", value);
      } else {
        prev.delete("category");
      }
      return prev;
    });
  };

  const handleSizeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, size: value }));
    setSearchParams((prev) => {
      if (value && value !== "all") {
        prev.set("size", value);
      } else {
        prev.delete("size");
      }
      return prev;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      category: "all",
      size: "all",
      search: "",
    });
    setSearchParams((prev) => {
      prev.delete("category");
      prev.delete("size");
      prev.delete("search");
      return prev;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-8">
        {/* Filters Section */}
        <Card className="card-section">
          <CardHeader>
            <CardTitle>{t("filterProducts")}</CardTitle>
            <CardDescription>{t("filterProductsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <ProductSearch
                  onSearch={handleSearch}
                  initialValue={initialSearch}
                />
              </div>
              <ProductFilters
                filters={filters}
                categories={categories}
                onCategoryChange={handleCategoryChange}
                onSizeChange={handleSizeChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <ProductGrid products={products} onResetFilters={handleResetFilters} />
      </div>
    </div>
  );
};

export default ProductsPage;
