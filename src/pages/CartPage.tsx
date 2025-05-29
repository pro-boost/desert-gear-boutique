import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ShippingAddress } from "@/services/shippingService";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { saveShippingAddress, createOrder } from "@/services/shippingService";
import { CartItemsList } from "@/components/cart/CartItemsList";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { CheckoutForm } from "@/components/cart/CheckoutForm";

const CartPage = () => {
  const { t } = useLanguage();
  const { items, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error(t("cartEmpty"));
      return;
    }
    setIsCheckoutStep(true);
  };

  const handleSubmitOrder = async (
    shippingData: Omit<ShippingAddress, "id">
  ) => {
    if (items.length === 0) {
      toast.error(t("cartEmpty"));
      return;
    }

    setIsProcessingOrder(true);

    try {
      // Save shipping address
      const shippingAddress = await saveShippingAddress(shippingData);

      // Create order with product items
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.discountPrice || item.product.price,
      }));

      await createOrder(orderItems, shippingAddress.id);

      // Clear cart after successful order
      clearCart();

      toast.success(t("orderPlacedSuccess"));

      // Redirect to order confirmation or home page
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(t("orderPlacementError"));
      setIsProcessingOrder(false);
    }
  };

  return (
    <main className="flex-grow py-3 px-2 sm:py-4 sm:px-3 md:py-6 md:px-4 lg:py-8 lg:px-6">
      <div className="container mx-auto">
        {/* Header - Mobile first */}
        <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-heading font-bold">
            {isCheckoutStep ? t("checkout") : t("cart")}
          </h1>

          {/* Back button - Always visible on mobile, hidden on larger screens when in checkout */}
          {isCheckoutStep && (
            <div className="mt-2 lg:hidden">
              <button
                onClick={() => setIsCheckoutStep(false)}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                {t("backToCart")}
              </button>
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <div className="space-y-4 md:space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4 xl:gap-6 max-w-7xl mx-auto">
            {/* Cart Items and Order Summary - Mobile first, then desktop */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <CartItemsList onProceedToCheckout={handleProceedToCheckout} />
              <OrderSummary onProceedToCheckout={handleProceedToCheckout} />
            </div>

            {/* Checkout Form - Always visible on desktop when in checkout */}
            {isCheckoutStep && (
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm lg:sticky lg:top-20 xl:top-24">
                  <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b border-border bg-muted/50 flex items-center justify-between">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold">
                      {t("orderInformation")}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCheckoutStep(false)}
                      className="hidden lg:flex text-sm"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t("backToCart")}
                    </Button>
                  </div>

                  <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                    <CheckoutForm
                      onSubmit={handleSubmitOrder}
                      cartItems={items}
                      totalPrice={totalPrice}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty Cart - Mobile first */
          <div className="flex items-center justify-center min-h-[40vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[calc(100vh-16rem)]">
            <div className="text-center py-6 sm:py-8 md:py-10 lg:py-12 max-w-[280px] sm:max-w-sm mx-auto px-3 sm:px-4">
              <ShoppingBasket
                size={40}
                className="mx-auto mb-3 sm:mb-4 text-muted-foreground sm:w-14 sm:h-14 md:w-16 md:h-16"
              />
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium mb-2 sm:mb-3">
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
