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
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error(t("emptyCart"));
      return;
    }
    setIsCheckoutStep(true);
  };

  const handleSubmitOrder = async (
    shippingData: Omit<ShippingAddress, "id">
  ) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
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

      toast.success(
        "Order placed successfully! We'll contact you shortly to confirm your order."
      );

      // Redirect to order confirmation or home page
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("There was a problem placing your order. Please try again.");
      setIsProcessingOrder(false);
    }
  };

  return (
    <main className="flex-grow py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold mb-8">
          {isCheckoutStep ? "Checkout" : t("cart")}
        </h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Cart Items and Order Summary */}
            <div
              className={`${
                isCheckoutStep
                  ? "hidden lg:block lg:col-span-2"
                  : "lg:col-span-2"
              }`}
            >
              <CartItemsList onProceedToCheckout={handleProceedToCheckout} />
              <OrderSummary onProceedToCheckout={handleProceedToCheckout} />
            </div>

            {/* Checkout Form - Always visible on desktop */}
            <div
              className={`${
                isCheckoutStep ? "block" : "hidden lg:block"
              } lg:col-span-1`}
            >
              <div className="bg-card rounded-lg border border-border overflow-hidden lg:sticky lg:top-24 shadow-sm">
                <div className="p-4 border-b border-border bg-muted/50 flex items-center justify-between">
                  <h2 className="font-semibold">Order Information</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCheckoutStep(false)}
                    className="lg:hidden"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Cart
                  </Button>
                </div>

                <div className="p-4">
                  <CheckoutForm onSubmit={handleSubmitOrder} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
            <div className="text-center py-16 max-w-md mx-auto">
              <ShoppingBasket
                size={64}
                className="mx-auto mb-4 text-muted-foreground"
              />
              <h2 className="text-2xl font-medium mb-2">{t("emptyCart")}</h2>
              <p className="text-muted-foreground mb-6">
                You haven't added any products to your cart yet.
              </p>
              <Button asChild>
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
