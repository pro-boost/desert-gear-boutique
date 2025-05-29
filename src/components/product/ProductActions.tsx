import React from "react";
import { ArrowRight, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types/product";

interface ProductActionsProps {
  product: Product;
  selectedSizes: string[];
  isFavorite: boolean;
  onBuyNow: () => void;
  onAddToCart: () => void;
  onFavoriteToggle: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  selectedSizes,
  isFavorite,
  onBuyNow,
  onAddToCart,
  onFavoriteToggle,
}) => {
  const { t } = useLanguage();
  const isDisabled = !product.inStock || selectedSizes.length === 0;

  return (
    <div className="flex flex-wrap gap-3 pt-4">
      <Button
        className="flex-1 min-w-[120px] sm:min-w-[200px] py-6 text-lg whitespace-normal break-words"
        disabled={isDisabled}
        onClick={onBuyNow}
      >
        <ArrowRight className="mr-2 h-5 w-5 flex-shrink-0" />
        {t("buyNow")}
      </Button>
      <div className="flex gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          size="icon"
          className="flex-1 sm:w-14 h-14"
          disabled={isDisabled}
          onClick={onAddToCart}
        >
          <ShoppingCart className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="flex-1 sm:w-14 h-14"
          onClick={onFavoriteToggle}
        >
          <Heart
            className={`h-6 w-6 ${
              isFavorite
                ? "fill-tactical text-tactical"
                : "text-muted-foreground"
            }`}
          />
        </Button>
      </div>
    </div>
  );
};

export default ProductActions;
