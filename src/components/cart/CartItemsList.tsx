import React from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "./CartItemRow";

interface CartItemsListProps {
  onProceedToCheckout: () => void;
}

export const CartItemsList: React.FC<CartItemsListProps> = ({
  onProceedToCheckout,
}) => {
  const { items, clearCart } = useCart();
  const { t } = useLanguage();

  return (
    <div className="p-4">
      {/* Headers on larger screens */}
      <div className="hidden sm:grid grid-cols-12 gap-4 text-sm text-muted-foreground mb-2 px-4">
        <div className="col-span-5">{t("product")}</div>
        <div className="col-span-2 text-right">{t("price")}</div>
        <div className="col-span-3 text-center">{t("quantity")}</div>
        <div className="col-span-2 text-right">{t("total")}</div>
      </div>

      {/* Cart Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <CartItemRow
            key={`${item.product.id}-${item.selectedSize}`}
            item={item}
          />
        ))}
      </div>

      {/* Clear Cart Button */}
      <div className="mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={clearCart}
          className="w-full sm:w-auto"
        >
          {t("clearCart")}
        </Button>
      </div>
    </div>
  );
};
