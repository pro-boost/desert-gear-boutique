import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/hooks/useFavorites";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

const FavoritesPage = () => {
  const { t } = useLanguage();
  const { items: favorites } = useFavorites();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <main className="container min-h-screen mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-12 text-center">
          {t("favorites")}
        </h1>
        <div className="flex flex-col justify-center">
          {favorites.length > 0 ? (
            <div className="relative">
              {/* Mobile Grid View */}
              <div className="grid grid-cols-1 gap-6 sm:hidden">
                {favorites.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Desktop Carousel View */}
              <div className="hidden sm:block overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {favorites.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="min-w-0 flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] px-3"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Navigation arrows for desktop carousel - only show if more than 4 products */}
              {favorites.length > 4 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10
                           bg-background/90 backdrop-blur-sm hover:bg-background 
                           hover:scale-105 transition-all w-10 h-10
                           shadow-lg border-primary/20 dark:border-primary/30"
                    onClick={scrollPrev}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10
                           bg-background/90 backdrop-blur-sm hover:bg-background 
                           hover:scale-105 transition-all w-10 h-10
                           shadow-lg border-primary/20 dark:border-primary/30"
                    onClick={scrollNext}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
              <div className="text-center py-16 max-w-md mx-auto">
                <Heart
                  size={64}
                  className="mx-auto mb-4 text-muted-foreground"
                />
                <h2 className="text-2xl font-medium mb-2">
                  {t("emptyFavorites")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("noFavoritesMessage")}
                </p>
                <Button asChild>
                  <Link to="/products">{t("shopNow")}</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default FavoritesPage;
