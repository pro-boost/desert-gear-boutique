import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, MessageCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { CartItemsList } from "@/components/cart/CartItemsList";

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
Quantity: ${item.totalQuantity}
Sizes: ${item.sizes.join(" - ")}
Price per item: ${item.price.toFixed(2)} Dh
Subtotal: ${item.subtotal.toFixed(2)} Dh
-------------------`;
      })
      .join("\n\n");

    const message = `*New Order from Desert Gear Boutique* 🛍️

*Order Items:*
${itemsList}

*Order Summary:*
Total Items: ${items.reduce((sum, item) => sum + item.quantity, 0)}
Total Amount: ${totalPrice.toFixed(2)} Dh

Please provide your delivery details in the chat.`;

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
                          {totalPrice.toFixed(2)} Dh
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
                          {totalPrice.toFixed(2)} Dh
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
                    onClick={handleWhatsAppCheckout}
                    className="w-full h-12 text-base"
                    size="lg"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t("proceedToCheckout")}
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
