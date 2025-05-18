import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/clerk-react";
import { Product, PRODUCT_SIZES } from "@/types/product";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/contexts/LanguageContext";

// Export the CartItem type so it can be imported in other files
export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, size: string) => void;
  updateQuantity: (productId: string, quantity: number, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const { t } = useLanguage();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      // For signed-in users, load their synced cart
      const storedCart = localStorage.getItem(`cart_${user.id}`);
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      } else {
        // If no synced cart exists, try to load the local cart
        const localCart = localStorage.getItem("local_cart");
        if (localCart) {
          setItems(JSON.parse(localCart));
          // Save the local cart to the user's synced cart
          localStorage.setItem(`cart_${user.id}`, localCart);
          // Clear the local cart
          localStorage.removeItem("local_cart");
        } else {
          setItems([]);
        }
      }
    } else {
      // For non-signed-in users, load the local cart
      const localCart = localStorage.getItem("local_cart");
      if (localCart) {
        setItems(JSON.parse(localCart));
      } else {
        setItems([]);
      }
    }
  }, [user]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (user) {
      // For signed-in users, save to their synced cart
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
    } else {
      // For non-signed-in users, save to local cart
      localStorage.setItem("local_cart", JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = (product: Product, quantity: number, size: string) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const updatedItems = prev.map((item) =>
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: newQuantity }
            : item
        );
        toast.success(t("updatedCart"));
        return updatedItems;
      }

      toast.success(t("addedToCart"));
      return [...prev, { product, quantity, selectedSize: size }];
    });
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    size: string
  ) => {
    if (quantity < 1) {
      removeItem(productId, size);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (productId: string, size: string) => {
    setItems((prev) => {
      const item = prev.find(
        (item) => item.product.id === productId && item.selectedSize === size
      );
      if (item) {
        toast.success(t("removedFromCart"));
      }
      return prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === size)
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    toast.success(t("cartCleared"));
  };

  const totalPrice = items.reduce(
    (sum, item) =>
      sum + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
