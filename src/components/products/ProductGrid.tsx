import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import useEmblaCarousel from "embla-carousel-react";

interface ProductGridProps {
  products: Product[];
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onResetFilters,
}) => {
  const { t } = useLanguage();
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

  if (products.length === 0) {
    return (
      <div className="card-section text-center py-12">
        <PackageX className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-2xl font-semibold mb-2">{t("noProductsFound")}</h3>
        <p className="text-muted-foreground mb-6">{t("tryDifferentFilters")}</p>
        <Button variant="outline" onClick={onResetFilters}>
          {t("resetFilters")}
        </Button>
      </div>
    );
  }

  return (
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

      {showNavigation && (
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
  );
};
