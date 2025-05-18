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
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-border">
      {/* Product Image */}
      <Link
        to={`/products/${item.product.id}`}
        className="w-20 h-20 rounded overflow-hidden mr-4 mb-3 sm:mb-0 flex-shrink-0"
      >
        <img
          src={item.product.images[0] || "/placeholder.svg"}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-grow mr-4">
        <Link
          to={`/products/${item.product.id}`}
          className="font-medium hover:text-primary"
        >
          {item.product.name}
        </Link>
        {item.selectedSize && (
          <div className="text-sm text-muted-foreground">
            Size: {item.selectedSize}
          </div>
        )}
      </div>

      {/* Price */}
      <div className="text-right mr-4 min-w-[80px]">{price.toFixed(2)} Dh</div>

      {/* Quantity */}
      <div className="flex items-center border border-border rounded-md mr-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus size={14} />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          <Plus size={14} />
        </Button>
      </div>

      {/* Total */}
      <div className="font-semibold mr-4 min-w-[80px] text-right">
        {totalPrice.toFixed(2)} Dh
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash size={18} />
      </Button>
    </div>
  );
};

// Update form data type to match ShippingAddress
interface CheckoutFormData {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

const CheckoutForm = ({
  onSubmit,
}: {
  onSubmit: (formData: Omit<ShippingAddress, "id">) => void;
}) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    full_name: "",
    address_line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Morocco", // Default country
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_line1">Address Line 1</Label>
        <Input
          id="address_line1"
          value={formData.address_line1}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address_line1: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
        <Input
          id="address_line2"
          value={formData.address_line2}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address_line2: e.target.value }))
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, city: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, state: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            id="postal_code"
            value={formData.postal_code}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, postal_code: e.target.value }))
            }
            required
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
          />
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
  const { isSignedIn } = useUser();

  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const handleProceedToCheckout = () => {
    if (!isSignedIn) {
      toast.error(t("loginRequired"));
      navigate("/sign-in", { state: { returnTo: "/cart" } });
      return;
    }

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div
              className={`${
                isCheckoutStep ? "hidden lg:block" : ""
              } lg:col-span-2`}
            >
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-muted">
                  <h2 className="font-semibold">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </h2>
                </div>

                <div className="p-4">
                  {/* Headers on larger screens */}
                  <div className="hidden sm:flex text-sm text-muted-foreground mb-2">
                    <div className="flex-grow ml-24">Product</div>
                    <div className="min-w-[80px] text-right mr-4">Price</div>
                    <div className="min-w-[96px] text-center mr-4">
                      Quantity
                    </div>
                    <div className="min-w-[80px] text-right mr-4">Total</div>
                    <div className="w-9"></div>
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-1">
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
              </div>
            </div>

            {/* Order Summary or Checkout Form */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-24">
                <div className="p-4 border-b border-border bg-muted">
                  <h2 className="font-semibold">
                    {isCheckoutStep ? "Customer Information" : t("total")}
                  </h2>
                </div>

                <div className="p-4 space-y-4">
                  {isCheckoutStep ? (
                    <>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Pay after delivery</AlertTitle>
                        <AlertDescription>
                          We'll contact you to confirm your order before
                          shipping.
                        </AlertDescription>
                      </Alert>
                      <CheckoutForm onSubmit={handleSubmitOrder} />
                    </>
                  ) : (
                    <>
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
                        className="w-full"
                        onClick={handleProceedToCheckout}
                      >
                        Proceed to Checkout
                      </Button>

                      <div className="text-center text-sm text-muted-foreground mt-4">
                        <p>Pay after receiving your order</p>
                      </div>
                    </>
                  )}
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
