import React, { useState, useEffect, useCallback } from "react";
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
import {
  Search,
  Loader2,
  PackageX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ProductSkeletonGrid } from "@/components/ui/product-skeleton";
import useEmblaCarousel from "embla-carousel-react";

const ProductsPage = () => {
  const { t } = useLanguage();
  const { getClient } = useSupabase();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Initialize the filters from the URL query parameters
  const initialCategory = searchParams.get("category") || "all";
  const initialSize = searchParams.get("size") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [filters, setFilters] = useState<ProductFilters>({
    category: initialCategory,
    size: initialSize,
    search: initialSearch,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<
    { name: string; sizes: string[] }[]
  >([]);
  const [searchValue, setSearchValue] = useState(initialSearch);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
      "(min-width: 1280px)": { slidesToScroll: 4 },
    },
  });

  const [showNavigation, setShowNavigation] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      const updateNavigation = () => {
        const canScrollPrev = emblaApi.canScrollPrev();
        const canScrollNext = emblaApi.canScrollNext();
        setShowNavigation(canScrollPrev || canScrollNext);
      };

      emblaApi.on("select", updateNavigation);
      updateNavigation();

      return () => {
        emblaApi.off("select", updateNavigation);
      };
    }
  }, [emblaApi]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
                <Select value={filters.size} onValueChange={handleSizeChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t("selectSize")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allSizes")}</SelectItem>
                    {categories
                      .find((cat) => cat.name === filters.category)
                      ?.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Carousel */}
        <div className="relative w-full">
          {loading ? (
            <ProductSkeletonGrid count={8} />
          ) : products.length === 0 ? (
            <div className="card-section text-center py-12">
              <PackageX className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">
                {t("noProductsFound")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("tryDifferentFilters")}
              </p>
              <Button
                variant="outline"
                onClick={() => {
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
                }}
              >
                {t("resetFilters")}
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] px-3"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {!loading && showNavigation && (
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/90 backdrop-blur-sm hover:bg-background 
                             hover:scale-105 transition-all w-10 h-10
                             shadow-lg border-primary/20 dark:border-primary/30"
                    onClick={scrollPrev}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/90 backdrop-blur-sm hover:bg-background 
                             hover:scale-105 transition-all w-10 h-10
                             shadow-lg border-primary/20 dark:border-primary/30"
                    onClick={scrollNext}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
