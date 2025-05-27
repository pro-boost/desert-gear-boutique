import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { filterProducts, getCategories } from "@/services/productService";
import { ProductFilters, Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const ProductsPage = () => {
  const { t } = useLanguage();
  const { getClient } = useSupabase();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Initialize the filters from the URL query parameters
  const initialCategory = searchParams.get("category") || "all";
  const stockParam = searchParams.get("inStock");
  const initialInStock =
    stockParam === "true" ? true : stockParam === "false" ? false : undefined;
  const initialSearch = searchParams.get("search") || "";

  const [filters, setFilters] = useState<ProductFilters>({
    category: initialCategory,
    inStock: initialInStock,
    search: initialSearch,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<
    { name: string; sizes: string[] }[]
  >([]);
  const [searchValue, setSearchValue] = useState(initialSearch);

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
    setSearchValue(value);
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

  const handleStockChange = (value: string) => {
    const inStock =
      value === "true" ? true : value === "false" ? false : undefined;
    setFilters((prev) => ({ ...prev, inStock }));
    setSearchParams((prev) => {
      if (inStock !== undefined) {
        prev.set("inStock", String(inStock));
      } else {
        prev.delete("inStock");
      }
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Filters Section */}
          <Card>
            <CardHeader>
              <CardTitle>{t("filterProducts")}</CardTitle>
              <CardDescription>
                {t("filterProductsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t("searchProducts")}
                      value={searchValue}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select
                    value={filters.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allCategories")}</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {t(category.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={
                      filters.inStock === undefined
                        ? "all"
                        : String(filters.inStock)
                    }
                    onValueChange={handleStockChange}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder={t("stockStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allProducts")}</SelectItem>
                      <SelectItem value="true">{t("inStock")}</SelectItem>
                      <SelectItem value="false">{t("outOfStock")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && !loading && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg text-muted-foreground">
                  {t("noProductsFound")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
