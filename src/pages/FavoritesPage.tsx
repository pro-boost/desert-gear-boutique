import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/hooks/useFavorites";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const FavoritesPage = () => {
  const { t } = useLanguage();
  const { items: favorites } = useFavorites();

  return (
    <main className="flex-grow py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold mb-8">
          {t("favorites")}
        </h1>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
            <div className="text-center py-16 max-w-md mx-auto">
              <Heart size={64} className="mx-auto mb-4 text-muted-foreground" />
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
    </main>
  );
};

export default FavoritesPage;
