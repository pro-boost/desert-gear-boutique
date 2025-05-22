import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border bg-muted/50">
        <h2 className="font-semibold">
          {items.length} {items.length === 1 ? t("item") : t("items")}
        </h2>
      </div>

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

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <Button variant="outline" size="sm" onClick={clearCart}>
            {t("clearCart")}
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("continueShop")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
