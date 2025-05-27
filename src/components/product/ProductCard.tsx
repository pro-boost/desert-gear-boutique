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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image } from "@/components/ui/image";

interface ProductCardProps {
  product: Product;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, delay = 0 }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  const favorited = isFavorite(product.id);
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
        delay ? `animate-fade-in [animation-delay:${delay}ms]` : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-square">
          <Link to={`/products/${product.id}`} className="block h-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
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
                className="bg-tactical-light text-primary-foreground"
              >
                -{Math.round((1 - product.discountPrice / product.price) * 100)}
                %
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-orange-500 text-white">
                <Target className="w-3 h-3 mr-1" />
                {t("featured")}
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/50 backdrop-blur-sm hover:bg-background/70 z-10"
            onClick={handleFavoriteToggle}
            type="button"
          >
            <Heart
              size={18}
              className={`transition-colors ${
                favorited ? "fill-orange-500 text-orange-500" : ""
              }`}
            />
          </Button>
        </div>

        <CardContent className="flex-grow p-4">
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-1 transition-colors group-hover:text-orange-600">
              {product.name}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="font-bold text-lg text-orange-600">
                  {product.discountPrice.toFixed(2)} Dh
                </span>
                <span className="text-muted-foreground line-through text-sm">
                  {product.price.toFixed(2)} Dh
                </span>
              </>
            ) : (
              <span className="font-bold text-lg">
                {product.price.toFixed(2)} Dh
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            variant={product.inStock ? "default" : "outline"}
            className={`w-full ${
              isHovered && product.inStock
                ? "bg-orange-500 shadow-lg shadow-orange-500/20"
                : "bg-primary"
            }`}
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {product.inStock ? t("viewDetails") : t("outOfStock")}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;
