import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { CartItemsList } from "@/components/cart/CartItemsList";

const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const CartPage = () => {
  const { t } = useLanguage();
  const { items, clearCart, totalPrice } = useCart();

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) {
      toast.error(t("cartEmpty"));
      return;
    }

    // Group items by product
    const groupedItems = items.reduce((acc, item) => {
      const key = item.product.id;
      if (!acc[key]) {
        acc[key] = {
          name: item.product.name,
          price: item.product.discountPrice || item.product.price,
          sizes: [],
          totalQuantity: 0,
          subtotal: 0,
        };
      }
      acc[key].sizes.push(item.selectedSize);
      acc[key].totalQuantity += item.quantity;
      acc[key].subtotal +=
        (item.product.discountPrice || item.product.price) * item.quantity;
      return acc;
    }, {} as Record<string, { name: string; price: number; sizes: string[]; totalQuantity: number; subtotal: number }>);

    // Convert grouped items to message format
    const itemsList = Object.values(groupedItems)
      .map((item) => {
        return `*${item.name}*
${t("quantityLabel")}: ${item.totalQuantity}
${t("sizesLabel")}: ${item.sizes.join(" - ")}
${t("pricePerItemLabel")}: ${item.price.toFixed(2)} ${t("currencyLabel")}
${t("subtotalLabel")}: ${item.subtotal.toFixed(2)} ${t("currencyLabel")}
-------------------`;
      })
      .join("\n\n");

    const message = [
      `*${t("newOrder")}* 🛍️`,
      "",
      `*${t("orderItems")}:*`,
      itemsList,
      "",
      `*${t("orderSummary")}:*`,
      `${t("total")}: ${items.reduce((sum, item) => sum + item.quantity, 0)}`,
      `${t("total")}: ${Math.round(totalPrice)} ${t("currencyLabel")}`,
      "",
      t("provideDeliveryDetails"),
    ].join("\n");

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "212661880323";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");

    // Show success message
    toast.success(t("orderInitiated"));
  };

  return (
    <main className="flex-grow py-3 px-2 sm:py-4 sm:px-3 md:py-6 md:px-4 lg:py-8 lg:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-heading font-bold">
            {t("cart")}
          </h1>
        </div>

        {items.length > 0 ? (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-8">
            {/* Cart Items - Takes 3 columns on desktop */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/50">
                  <h2 className="font-semibold">
                    {items.length} {items.length === 1 ? t("item") : t("items")}
                  </h2>
                </div>
                <CartItemsList onProceedToCheckout={handleWhatsAppCheckout} />
              </div>
            </div>

            {/* Order Summary and Checkout - Takes 2 columns on desktop */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border lg:sticky lg:top-6">
                <div className="p-6 space-y-6">
                  {/* Order Summary */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">
                      {t("orderSummary")}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">
                          {t("subtotal")}:
                        </span>
                        <span className="font-medium">
                          {Math.round(totalPrice)} Dh
                        </span>
                      </div>

                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">
                          {t("shipping")}:
                        </span>
                        <span>{t("free")}</span>
                      </div>

                      <div className="flex justify-between py-3 text-lg font-semibold">
                        <span>{t("total")}:</span>
                        <span className="text-primary text-xl">
                          {Math.round(totalPrice)} Dh
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Info */}
                  <div className="text-sm text-muted-foreground space-y-3">
                    <div className="flex flex-col space-y-2">
                      <Link
                        to="/shipping"
                        className="text-primary hover:underline inline-flex items-center text-base"
                      >
                        {t("shippingPolicy")}
                      </Link>
                      <Link
                        to="/returns"
                        className="text-primary hover:underline inline-flex items-center text-base"
                      >
                        {t("returnPolicy")}
                      </Link>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full"
                    onClick={handleWhatsAppCheckout}
                    size="lg"
                  >
                    <WhatsAppIcon />
                    <span className="ml-2">{t("proceedToCheckout")}</span>
                  </Button>

                  {/* Continue Shopping */}
                  <div className="text-center">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Link to="/products">{t("continueShop")}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart - Mobile first */
          <div className="flex items-center justify-center min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh]">
            <div className="text-center py-6 sm:py-8 md:py-10 max-w-[280px] sm:max-w-sm mx-auto px-3 sm:px-4">
              <ShoppingBasket
                size={40}
                className="mx-auto mb-3 sm:mb-4 text-muted-foreground sm:w-14 sm:h-14 md:w-16 md:h-16"
              />
              <h2 className="text-base sm:text-lg md:text-xl font-medium mb-2 sm:mb-3">
                {t("cartEmpty")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                {t("emptyCartMessage")}
              </p>
              <Button
                asChild
                className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6"
              >
                <Link to="/products">{t("shopNow")}</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CartPage;
