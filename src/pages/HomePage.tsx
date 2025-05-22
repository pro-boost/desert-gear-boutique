import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFeaturedProducts, getNewArrivals } from "@/services/productService";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";

const HomePage = () => {
  const { t } = useLanguage();
  const { getClient } = useSupabase();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const client = await getClient();
        const [featured, newProducts] = await Promise.all([
          getFeaturedProducts(client),
          getNewArrivals(client),
        ]);
        setFeaturedProducts(featured);
        setNewArrivals(newProducts);
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
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[60vh] rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
        <img
          src="/images/hero.jpg"
          alt="Desert Gear Boutique"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t("welcomeToDesertGear")}
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              {t("heroSubtitle")}
            </p>
            <Button asChild size="lg">
              <Link to="/products">{t("shopNow")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t("featuredProducts")}</h2>
          <Button asChild variant="ghost">
            <Link to="/products">{t("viewAll")}</Link>
          </Button>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {t("noFeaturedProducts")}
          </p>
        )}
      </section>

      {/* New Arrivals */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t("newArrivals")}</h2>
          <Button asChild variant="ghost">
            <Link to="/products">{t("viewAll")}</Link>
          </Button>
        </div>
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {t("noNewArrivals")}
          </p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
