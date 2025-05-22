import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFeaturedProducts, getNewArrivals } from "@/services/productService";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
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
import MapComponent from "@/components/MapComponent";
import { motion } from "framer-motion";

const HomePage = () => {
  const { t } = useLanguage();
  const { getClient } = useSupabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const client = await getClient();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 z-10"
        />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/images/main/soldier-8499582_1280.webp"
          alt="Desert Gear Boutique"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container max-w-5xl mx-auto px-4 relative z-20 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
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
      <section className="min-h-screen flex items-center bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-6xl mx-auto px-4 h-full py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-between items-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight">
              {t("ourProducts")}
            </h2>
            <Button
              asChild
              variant="ghost"
              className="text-lg hover:scale-105 transition-all"
            >
              <Link to="/products">{t("viewAll")}</Link>
            </Button>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="min-w-0 flex-[0_0_calc(100%-1.5rem)] sm:flex-[0_0_calc(50%-1.5rem)] md:flex-[0_0_calc(33.333%-1.5rem)] lg:flex-[0_0_calc(33.333%-1.5rem)] pl-6"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-background/90 backdrop-blur-sm hover:bg-background hover:scale-110 transition-all w-12 h-12"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-background/90 backdrop-blur-sm hover:bg-background hover:scale-110 transition-all w-12 h-12"
              onClick={scrollNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-b from-muted/30 to-background">
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
                className="flex flex-col h-full text-center p-8 rounded-2xl bg-card shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">
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
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
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
              className="h-full rounded-2xl overflow-hidden shadow-xl"
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
