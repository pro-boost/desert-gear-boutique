import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, Target } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, delay = 0 }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { isSignedIn } = useUser();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(true);

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = () => {
    if (!isSignedIn) {
      toast.error(t("pleaseSignIn"));
      navigate("/sign-in");
      return;
    }

    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error(t("selectSizeFirst"));
      return;
    }

    addToCart(product, 1, selectedSize);
    toast.success(t("addedToCart"));
  };

  return (
    <Card
      className={cn(
        "card-product group min-h-full relative transition-all duration-300 flex flex-col",
        delay ? `animate-fade-in [animation-delay:${delay}ms]` : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col flex-1">
        <div className="relative aspect-square">
          <Link to={`/products/${product.id}`} className="block h-full">
            {isImageLoading && (
              <div className="absolute  inset-0 bg-muted animate-pulse" />
            )}
            <img
              src={product.images[0]}
              alt={product.name}
              className={cn(
                "w-full h-full object-contain transition-transform duration-300 group-hover:scale-105",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
              loading="lazy"
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setIsImageLoading(false);
                // You could set a fallback image here
              }}
            />
          </Link>

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {!product.inStock && (
              <Badge variant="destructive" className="animate-pulse">
                {t("outOfStock")}
              </Badge>
            )}
            {hasDiscount && (
              <Badge
                variant="secondary"
                className="bg-tactical max-w-max text-tactical-foreground dark:shadow-[0_2px_10px_rgba(255,138,76,0.15)]"
              >
                -{Math.round((1 - product.discountPrice / product.price) * 100)}
                %
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm hover:bg-background transition-all dark:shadow-[0_2px_10px_rgba(255,138,76,0.1)]",
              isFavorite(product.id) && "text-primary hover:text-primary/90"
            )}
            onClick={(e) => {
              e.preventDefault();
              if (!isSignedIn) {
                toast.error(t("pleaseSignIn"));
                navigate("/sign-in");
                return;
              }
              if (isFavorite(product.id)) {
                removeFromFavorites(product.id);
                toast.success(t("removedFromFavorites"));
              } else {
                addToFavorites(product);
                toast.success(t("addedToFavorites"));
              }
            }}
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-all",
                isFavorite(product.id) ? "fill-current" : "fill-none"
              )}
            />
          </Button>
        </div>

        <CardContent className="p-4 space-y-3">
          <Link
            to={`/products/${product.id}`}
            className="block hover:underline focus:outline-none focus:underline"
          >
            <h3 className="font-semibold text-lg line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-primary">
                  ${product.discountPrice}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold">${product.price}</span>
            )}
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "min-w-[2.5rem] h-8 px-2",
                    selectedSize === size &&
                      "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto">
          <Button
            className="w-full"
            onClick={() => navigate(`/products/${product.id}`)}
            disabled={!product.inStock}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {t("seeProduct")}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;
