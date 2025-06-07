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

const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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

  const handleWhatsAppInquiry = () => {
    const message = [
      `*${t("productInquiryHeader")}* 🛍️`,
      "━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      `*${t("productLabel")}:* ${product.name}`,
      `*${t("priceLabel")}:* ${(product.discountPrice || product.price).toFixed(
        2
      )} ${t("currencyLabel")}`,
      product.sizes && product.sizes.length > 0
        ? `*${t("availableSizesLabel")}:* ${product.sizes.join(" | ")}`
        : "",
      "",
      t("inquiryGreeting"),
      "",
      t("inquiryMessage"),
      "",
      t("inquiryThankYou"),
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━",
    ]
      .filter(Boolean)
      .join("\n");

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "212661880323";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    toast.success(t("inquirySent"));
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
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto flex gap-2">
          <Button
            className="flex-1"
            onClick={() => navigate(`/products/${product.id}`)}
            disabled={!product.inStock}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {t("seeProduct")}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/20 transition-colors"
            onClick={handleWhatsAppInquiry}
          >
            <WhatsAppIcon />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;
