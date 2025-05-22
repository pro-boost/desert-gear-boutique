import React from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  onProceedToCheckout: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  onProceedToCheckout,
}) => {
  const { totalPrice } = useCart();
  const { t } = useLanguage();

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm mt-4">
      <div className="p-4 border-b border-border bg-muted/50">
        <h2 className="font-semibold">{t("total")}</h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground">{t("subtotal")}:</span>
          <span className="font-medium">{totalPrice.toFixed(2)} Dh</span>
        </div>

        <div className="flex justify-between py-2 border-b border-border">
          <span className="text-muted-foreground">{t("shipping")}:</span>
          <span>{t("free")}</span>
        </div>

        <div className="flex justify-between py-2 text-lg font-semibold">
          <span>{t("total")}:</span>
          <span>{totalPrice.toFixed(2)} Dh</span>
        </div>

        <Button className="w-full lg:hidden" onClick={onProceedToCheckout}>
          {t("proceedToCheckout")}
        </Button>

        <div className="text-center text-sm text-muted-foreground mt-4 lg:hidden">
          <p>{t("payAfterReceiving")}</p>
        </div>
      </div>
    </div>
  );
};
