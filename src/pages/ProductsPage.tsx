import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { filterProducts, getCategories } from "@/services/productService";
import { ProductFilters, Product } from "@/types/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const ProductsPage = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Initialize the filters from the URL query parameters
  const initialCategory = searchParams.get("category") || "all";
  const stockParam = searchParams.get("inStock");
  const initialInStock =
    stockParam === "true" ? true : stockParam === "false" ? false : undefined;
  const initialSearch = searchParams.get("search") || "";

  const [filters, setFilters] = useState<ProductFilters>({
    category: initialCategory as any,
    inStock: initialInStock,
    search: initialSearch,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState(initialSearch);

  useEffect(() => {
    // Fetch the categories once when the component mounts
    setCategories(getCategories());
  }, []);

  useEffect(() => {
    // Whenever the filters change, we update the URL search parameters
    const newParams = new URLSearchParams();
    if (filters.category && filters.category !== "all") {
      newParams.set("category", filters.category);
    }
    if (filters.inStock !== undefined) {
      newParams.set("inStock", String(filters.inStock));
    }
    if (filters.search) {
      newParams.set("search", filters.search);
    }
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  useEffect(() => {
    // Whenever the searchParams or filters change, fetch the filtered products
    const filtered = filterProducts(filters);
    setProducts(filtered);
  }, [filters]);

  // Handle category changes
  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      category: value,
      // Reset the inStock filter when category changes
      inStock: undefined,
    }));
  };

  // Handle stock toggle
  const handleToggleStock = () => {
    setFilters((prev) => {
      let nextStock: boolean | undefined;
      if (prev.inStock === undefined) nextStock = true;
      else if (prev.inStock === true) nextStock = false;
      else nextStock = undefined;
      return { ...prev, inStock: nextStock };
    });
  };

  // Handle search input
  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchValue }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setFilters({ category: "all", inStock: undefined, search: "" });
    setSearchValue("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-8">
            {t("ourProducts")}
          </h1>

          {/* Filters */}
          <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-grow w-full md:w-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={t("search")}
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
                  value={filters.category || "all"}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("category")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allProducts")}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {t(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Toggle Stock Filter */}
              <div className="w-full md:w-48">
                <Select
                  value={
                    filters.inStock === undefined
                      ? "all"
                      : filters.inStock
                      ? "in"
                      : "out"
                  }
                  onValueChange={(value) => {
                    let stockValue: boolean | undefined;
                    if (value === "in") stockValue = true;
                    else if (value === "out") stockValue = false;
                    else stockValue = undefined;
                    setFilters((prev) => ({ ...prev, inStock: stockValue }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("stock")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allStock")}</SelectItem>
                    <SelectItem value="in">{t("inStock")}</SelectItem>
                    <SelectItem value="out">{t("outOfStock")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters}>
                {t("cancel")}
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products found matching your criteria.
              </p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                {t("cancel")}
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
