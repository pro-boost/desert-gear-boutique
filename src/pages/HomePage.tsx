import React, { useState, useEffect, useCallback, Suspense } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFeaturedProducts, getNewArrivals } from "@/services/productService";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Truck,
  Clock,
  Star,
  ArrowDown,
} from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import MapComponent from "@/components/map/MapComponent";
import { motion } from "framer-motion";
import { ProductSkeletonGrid } from "@/components/ui/product-skeleton";

// Lazy load the hero image
const HeroImage = React.lazy(() => import("../components/ui/HeroImage"));

const HomePage = () => {
  const { t } = useLanguage();
  const { getClient } = useSupabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Add state to track if we need navigation
  const [showNavigation, setShowNavigation] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Update useEffect to check if we need navigation
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
    const loadProducts = async () => {
      try {
        setLoading(true);
        const client = await getClient();
        // Fetch featured and new products in parallel
        const [featured, newProducts] = await Promise.all([
          getFeaturedProducts(client),
          getNewArrivals(client),
        ]);
        // Combine and deduplicate products
        const allProducts = [...featured, ...newProducts];
        const uniqueProducts = Array.from(
          new Map(allProducts.map((item) => [item.id, item])).values()
        );
        setProducts(uniqueProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [getClient]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50 z-10"
        />
        <Suspense
          fallback={<div className="absolute inset-0 bg-muted animate-pulse" />}
        >
          <HeroImage />
        </Suspense>
        <div className="container max-w-5xl mx-auto px-4 relative z-20 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
              {t("welcomeToDesertGear")}
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 font-light">
              {t("heroSubtitle")}
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 rounded-full transition-all hover:scale-105"
            >
              <Link to="/products">{t("shopNow")}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Products Carousel */}
      <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-background via-primary/5 to-secondary/10 max-w-screen">
        <div className="container max-w-6xl mx-auto px-4 h-full py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight">
              {t("ourProducts")}
            </h2>
          </motion.div>

          <div className="relative w-full max-w-7xl mx-auto">
            {loading ? (
              <ProductSkeletonGrid count={4} />
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
                  <>
                    {/* Desktop Navigation Buttons */}
                    <div className="hidden sm:block">
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 
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
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 
                                 bg-background/90 backdrop-blur-sm hover:bg-background 
                                 hover:scale-105 transition-all w-10 h-10
                                 shadow-lg border-primary/20 dark:border-primary/30"
                        onClick={scrollNext}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Mobile Navigation Buttons */}
                    <div className="sm:hidden flex justify-center gap-4 mt-6">
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
                  </>
                )}

                {/* View All Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex justify-center mt-12"
                >
                  <Button
                    asChild
                    variant="outline"
                    className="text-lg px-8 py-6 rounded-full border-2 border-primary/20 
                             hover:border-primary/40 hover:bg-primary/5 
                             dark:border-primary/30 dark:hover:border-primary/50
                             transition-all hover:scale-105"
                  >
                    <Link to="/products">{t("viewAll")}</Link>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-bl from-background via-accent/5 to-primary/10">
        <div className="container max-w-6xl mx-auto px-4 h-full py-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 tracking-tight"
          >
            {t("whyChooseUs")}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: t("qualityAssurance"),
                description: t("qualityAssuranceDescription"),
              },
              {
                icon: Truck,
                title: t("fastShipping"),
                description: t("fastShippingDescription"),
              },
              {
                icon: Clock,
                title: t("expertSupport"),
                description: t("expertSupportDescription"),
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-section"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/20 to-primary/10 border-2 border-primary/30 dark:border-primary/40 flex items-center justify-center">
                  <item.icon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-lg flex-grow">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Where to Find Us Section */}
      <section className=" min-h-screen flex flex-col justify-center items-center py-20 bg-gradient-to-tr from-background via-secondary/5 to-accent/10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                {t("aboutUs")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("aboutUsDescription")}
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                {t("productSelection")}
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 rounded-full transition-all hover:scale-105"
              >
                <Link to="/contact">{t("contactUs")}</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className=" overflow-hidden"
            >
              <MapComponent />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
