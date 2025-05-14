import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart, CartItem } from "@/contexts/CartContext"; // Now properly importing exported CartItem
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

// Update CartItemRow to work with the updated CartItem type
const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { t } = useLanguage();

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
            {t("size")}: {item.selectedSize}
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

const CheckoutForm = ({ onSubmit }: { onSubmit: (formData: any) => void }) => {
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      full_name: fullName,
      national_id: nationalId,
      address,
      phone_number: phoneNumber,
    };

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">{t("fullNameId")}</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationalId">{t("nationalId")}</Label>
        <Input
          id="nationalId"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t("completeAddress")}</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">{t("phone")}</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t("processing") : t("placeOrder")}
      </Button>
    </form>
  );
};

const CartPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart(); // Now accessing the properties properly
  const navigate = useNavigate();

  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const handleProceedToCheckout = () => {
    if (!user) {
      // If not logged in, redirect to login page
      toast.error(t("loginRequired"));
      navigate("/auth/login", { state: { returnTo: "/cart" } });
      return;
    }

    setIsCheckoutStep(true);
  };

  const handleSubmitOrder = async (shippingData: any) => {
    if (items.length === 0) {
      toast.error(t("emptyCart"));
      return;
    }

    setIsProcessingOrder(true);

    try {
      // Save shipping address
      const shippingAddress = await saveShippingAddress(shippingData);

      // Check that shippingAddress is not null before accessing its id
      if (!shippingAddress) {
        throw new Error("Failed to create shipping address");
      }

      // Create order with product items
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.discountPrice || item.product.price,
      }));

      await createOrder(orderItems, shippingAddress.id);

      // Clear cart after successful order
      clearCart();

      toast.success(t("orderSuccess"));

      // Redirect to order confirmation or home page
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(t("orderError"));
      setIsProcessingOrder(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-8 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-8">
            {isCheckoutStep ? t("checkout") : t("cart")}
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
                      {items.length} {items.length === 1 ? t("item") : t("items")}
                    </h2>
                  </div>

                  <div className="p-4">
                    {/* Headers on larger screens */}
                    <div className="hidden sm:flex text-sm text-muted-foreground mb-2">
                      <div className="flex-grow ml-24">{t("product")}</div>
                      <div className="min-w-[80px] text-right mr-4">{t("price")}</div>
                      <div className="min-w-[96px] text-center mr-4">
                        {t("quantity")}
                      </div>
                      <div className="min-w-[80px] text-right mr-4">{t("total")}</div>
                      <div className="w-9"></div>
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-1">
                      {items.map((item) => (
                        <CartItemRow key={`${item.product.id}-${item.selectedSize}`} item={item} />
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
              </div>

              {/* Order Summary or Checkout Form */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-24">
                  <div className="p-4 border-b border-border bg-muted">
                    <h2 className="font-semibold">
                      {isCheckoutStep ? t("customerInfo") : t("total")}
                    </h2>
                  </div>

                  <div className="p-4 space-y-4">
                    {isCheckoutStep ? (
                      <>
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>{t("payAfterDelivery")}</AlertTitle>
                          <AlertDescription>
                            {t("contactConfirmation")}
                          </AlertDescription>
                        </Alert>
                        <CheckoutForm onSubmit={handleSubmitOrder} />
                      </>
                    ) : (
                      <>
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

                        <div className="flex justify-between py-2 text-lg font-semibold">
                          <span>{t("total")}:</span>
                          <span>{totalPrice.toFixed(2)} Dh</span>
                        </div>

                        <Button
                          className="w-full"
                          onClick={handleProceedToCheckout}
                        >
                          {t("proceedToCheckout")}
                        </Button>

                        <div className="text-center text-sm text-muted-foreground mt-4">
                          <p>{t("payAfterReceiving")}</p>
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
                  {t("emptyCartMessage")}
                </p>
                <Button asChild>
                  <Link to="/products">{t("shopNow")}</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
