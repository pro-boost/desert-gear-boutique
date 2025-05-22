import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShippingAddress } from "@/services/shippingService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CartItem } from "@/contexts/CartContext";
import { Textarea } from "@/components/ui/textarea";

interface CheckoutFormData {
  full_name: string;
  email: string;
  phone: string;
  address_line1: string;
}

interface CheckoutFormProps {
  onSubmit: (formData: Omit<ShippingAddress, "id">) => void;
  cartItems: CartItem[];
  totalPrice: number;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSubmit,
  cartItems,
  totalPrice,
}) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    full_name: "",
    email: "",
    phone: "",
    address_line1: "",
  });

  const generateWhatsAppMessage = (formData: CheckoutFormData) => {
    // Group items by product
    const groupedItems = cartItems.reduce((acc, item) => {
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

*Customer Details:*
Name: ${formData.full_name}
Phone: ${formData.phone}
Email: ${formData.email}

*Delivery Address:*
${formData.address_line1}
Morocco

*Order Items:*
${itemsList}

*Order Summary:*
Total Items: ${cartItems.reduce((sum, item) => sum + item.quantity, 0)}
Total Amount: ${totalPrice.toFixed(2)} Dh

Thank you for your order! We'll contact you shortly to confirm your order.`;

    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "212661880323"; // Your WhatsApp number
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert form data to match ShippingAddress type
    const shippingData = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      address_line1: formData.address_line1,
      city: "Morocco", // Default value
      state: "Morocco", // Default value
      postal_code: "", // Empty value
      country: "Morocco",
    };

    // Generate WhatsApp message and open in new tab
    const whatsappUrl = generateWhatsAppMessage(formData);
    window.open(whatsappUrl, "_blank");

    // Submit the form data
    onSubmit(shippingData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Pay after delivery</AlertTitle>
        <AlertDescription>
          We'll contact you to confirm your order and deliver to your address.
        </AlertDescription>
      </Alert>

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

      <div className="space-y-2">
        <Label htmlFor="address_line1">Delivery Address</Label>
        <Textarea
          id="address_line1"
          value={formData.address_line1}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address_line1: e.target.value }))
          }
          required
          placeholder="Enter your complete delivery address"
          className="min-h-[100px]"
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
