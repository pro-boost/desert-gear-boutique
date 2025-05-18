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
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user.id}`);
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      } else {
        setItems([]);
      }
    } else {
      setItems([]);
    }
  }, [user]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
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
        return updatedItems;
      }

      return [...prev, { product, quantity, selectedSize: size }];
    });

    toast.success("Product added to cart");
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
    setItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === size)
      )
    );
    toast.success("Product removed from cart");
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
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
