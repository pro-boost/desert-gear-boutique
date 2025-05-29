import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { t } = useLanguage();
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="space-y-8">
      {/* Product Title and Price */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
          {product.name}
        </h1>
        <div className="flex flex-wrap justify-between items-end gap-2 sm:gap-4 mb-4 sm:mb-6">
          {hasDiscount ? (
            <>
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {product.discountPrice?.toFixed(2)} Dh
              </span>
              <span className="text-base sm:text-lg text-muted-foreground line-through">
                {product.price.toFixed(2)} Dh
              </span>
              <Badge
                variant="secondary"
                className="bg-tactical text-tactical-foreground text-xs sm:text-sm"
              >
                -
                {Math.round((1 - product.discountPrice! / product.price) * 100)}
                %
              </Badge>
            </>
          ) : (
            <span className="text-xl sm:text-2xl font-bold">
              {product.price.toFixed(2)} Dh
            </span>
          )}
        </div>
        <div className="mb-4 sm:mb-6">
          <Badge
            variant={product.inStock ? "outline" : "destructive"}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-tactical text-tactical-foreground"
          >
            {product.inStock ? t("inStock") : t("outOfStock")}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{t("description")}</h3>
        <p className="text-muted-foreground">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
