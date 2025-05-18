import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShippingAddress } from "@/services/shippingService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CheckoutFormData {
  full_name: string;
  email: string;
  phone: string;
}

interface CheckoutFormProps {
  onSubmit: (formData: Omit<ShippingAddress, "id">) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit }) => {
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
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Pay after delivery</AlertTitle>
        <AlertDescription>
          We'll contact you to confirm your order and collect your delivery
          address.
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
