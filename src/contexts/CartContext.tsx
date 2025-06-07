import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/clerk-react";
import { Product } from "@/types/product";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabase } from "@/hooks/useSupabase";
import {
  getUserCartItems,
  addToCart as addToCartDB,
  updateCartItemQuantity as updateCartItemQuantityDB,
  removeFromCart as removeFromCartDB,
  clearCart as clearCartDB,
} from "@/services/userDataService";

// Export the CartItem type so it can be imported in other files
export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    size: string
  ) => Promise<void>;
  updateQuantity: (
    productId: string,
    quantity: number,
    size: string
  ) => Promise<void>;
  removeItem: (productId: string, size: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const { t } = useLanguage();
  const { getClient, isInitialized } = useSupabase();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from database when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (!user || !isInitialized) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const client = await getClient();
        const cartItems = await getUserCartItems(client, user.id);
        setItems(cartItems);
      } catch (error) {
        console.error("Error loading cart:", error);
        toast.error(t("errorLoadingCart"));
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user, isInitialized, getClient, t]);

  const addToCart = async (
    product: Product,
    quantity: number,
    size: string
  ) => {
    if (!user) {
      toast.error(t("pleaseSignIn"));
      return;
    }

    try {
      const client = await getClient();
      await addToCartDB(client, user.id, product.id, quantity, size);
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
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(t("errorAddingToCart"));
    }
  };

  const updateQuantity = async (
    productId: string,
    quantity: number,
    size: string
  ) => {
    if (!user) {
      toast.error(t("pleaseSignIn"));
      return;
    }

    try {
      const client = await getClient();
      await updateCartItemQuantityDB(
        client,
        user.id,
        productId,
        quantity,
        size
      );
      if (quantity < 1) {
        await removeItem(productId, size);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId && item.selectedSize === size
            ? { ...item, quantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      toast.error(t("errorUpdatingCart"));
    }
  };

  const removeItem = async (productId: string, size: string) => {
    if (!user) {
      toast.error(t("pleaseSignIn"));
      return;
    }

    try {
      const client = await getClient();
      await removeFromCartDB(client, user.id, productId, size);
      setItems((prev) => {
        const item = prev.find(
          (item) => item.product.id === productId && item.selectedSize === size
        );
        if (item) {
          toast.success(t("removedFromCart"));
        }
        return prev.filter(
          (item) =>
            !(item.product.id === productId && item.selectedSize === size)
        );
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error(t("errorRemovingFromCart"));
    }
  };

  const clearCart = async () => {
    if (!user) {
      toast.error(t("pleaseSignIn"));
      return;
    }

    try {
      const client = await getClient();
      await clearCartDB(client, user.id);
      setItems([]);
      toast.success(t("cartCleared"));
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error(t("errorClearingCart"));
    }
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
        isLoading,
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
