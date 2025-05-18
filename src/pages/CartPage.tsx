import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart, CartItem } from "@/contexts/CartContext";
import { ShippingAddress } from "@/services/shippingService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingBag,
  Trash,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBasket,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { saveShippingAddress, createOrder } from "@/services/shippingService";
import { useUser } from "@clerk/clerk-react";

// Update CartItemRow to work with the updated CartItem type
const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.product.id, newQuantity, item.selectedSize);
  };

  const handleRemove = () => {
    removeItem(item.product.id, item.selectedSize);
  };

  const price = item.product.discountPrice || item.product.price;
  const totalPrice = price * item.quantity;

  return (
    <div className="grid grid-cols-12 gap-4 items-start sm:items-center py-4 border-b border-border">
      {/* Product Image and Info - 5 columns on desktop */}
      <div className="col-span-8 sm:col-span-5 flex items-start gap-3">
        <Link
          to={`/products/${item.product.id}`}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm"
        >
          <img
            src={item.product.images[0] || "/placeholder.svg"}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-grow min-w-0">
              <Link
                to={`/products/${item.product.id}`}
                className="font-medium hover:text-primary text-sm block mb-1 truncate"
              >
                {item.product.name}
              </Link>
              {item.selectedSize && (
                <div className="text-sm text-muted-foreground">
                  Size: {item.selectedSize}
                </div>
              )}
            </div>
            {/* Mobile Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="text-muted-foreground hover:text-destructive sm:hidden -mt-1 -mr-2"
            >
              <Trash size={16} />
            </Button>
          </div>
          {/* Mobile Price */}
          <div className="sm:hidden mt-2">
            <div className="text-sm font-medium">{price.toFixed(2)} Dh</div>
          </div>
        </div>
      </div>

      {/* Desktop Price - 2 columns */}
      <div className="hidden sm:block sm:col-span-2 text-right">
        <div className="font-medium">{price.toFixed(2)} Dh</div>
      </div>

      {/* Quantity Controls - 3 columns */}
      <div className="col-span-4 sm:col-span-3 flex items-center justify-end sm:justify-center">
        <div className="flex items-center border border-border rounded-md bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus size={14} />
          </Button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>

      {/* Desktop Total - 2 columns */}
      <div className="hidden sm:block sm:col-span-2 text-right">
        <div className="font-semibold">{totalPrice.toFixed(2)} Dh</div>
      </div>

      {/* Desktop Delete Button */}
      <div className="hidden sm:block sm:col-span-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="text-muted-foreground hover:text-destructive mx-auto"
        >
          <Trash size={18} />
        </Button>
      </div>

      {/* Mobile Total */}
      <div className="col-span-12 sm:hidden flex justify-between items-center mt-2 pt-2 border-t border-border/50">
        <div className="text-sm font-semibold">
          Total: {totalPrice.toFixed(2)} Dh
        </div>
      </div>
    </div>
  );
};

// Update form data type to match simplified requirements
interface CheckoutFormData {
  full_name: string;
  email: string;
  phone: string;
}

const CheckoutForm = ({
  onSubmit,
}: {
  onSubmit: (formData: Omit<ShippingAddress, "id">) => void;
}) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    full_name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert form data to match ShippingAddress type
    const shippingData = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      // Add required fields with default values
      address_line1: "Will be collected during delivery",
      city: "Will be collected during delivery",
      state: "Will be collected during delivery",
      postal_code: "Will be collected during delivery",
      country: "Morocco",
    };
    onSubmit(shippingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, full_name: e.target.value }))
          }
          required
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
          placeholder="Enter your email address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phone: e.target.value }))
          }
          required
          placeholder="Enter your phone number"
        />
      </div>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>By placing your order, you agree to our:</p>
        <div className="flex flex-col space-y-1">
          <Link
            to="/shipping"
            className="text-primary hover:underline inline-flex items-center"
          >
            Shipping Policy
          </Link>
          <Link
            to="/returns"
            className="text-primary hover:underline inline-flex items-center"
          >
            Return Policy
          </Link>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Place Order
      </Button>
    </form>
  );
};

const CartPage = () => {
  const { t } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
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
      // TODO: Get user ID from Clerk's useUser() hook
      // const { user } = useUser();
      // const userId = user?.id;

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
              <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border bg-muted/50">
                  <h2 className="font-semibold">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </h2>
                </div>

                <div className="p-4">
                  {/* Headers on larger screens */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 text-sm text-muted-foreground mb-2 px-4">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-3 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
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
                      Clear Cart
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("continueShop")}
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-border">
                  <div className="p-4 border-b border-border bg-muted/50">
                    <h2 className="font-semibold">{t("total")}</h2>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">
                        {totalPrice.toFixed(2)} Dh
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span>Free</span>
                    </div>

                    <div className="flex justify-between py-2 text-lg font-semibold">
                      <span>Total:</span>
                      <span>{totalPrice.toFixed(2)} Dh</span>
                    </div>

                    <Button
                      className="w-full lg:hidden"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                    </Button>

                    <div className="text-center text-sm text-muted-foreground mt-4 lg:hidden">
                      <p>Pay after receiving your order</p>
                    </div>
                  </div>
                </div>
              </div>
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

                <div className="p-4 space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Pay after delivery</AlertTitle>
                    <AlertDescription>
                      We'll contact you to confirm your order and collect your
                      delivery address.
                    </AlertDescription>
                  </Alert>
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
