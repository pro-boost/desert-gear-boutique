
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/types/product";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "./LanguageContext";

// Export the CartItem type so it can be imported in other files
export type CartItem = {
  product: Product;
  quantity: number;
  selectedSize?: string;
};

interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: Product, selectedSize?: string) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  // Add missing properties
  itemCount: number;
  items: CartItem[];
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.product.discountPrice || item.product.price) * item.quantity, 
    0
  );

  // Calculate item count
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (product: Product, selectedSize?: string) => {
    setCartItems((prevItems) => {
      // Check if the product with the same size already exists in the cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItemIndex >= 0) {
        // Product with same size exists, increment its quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        
        toast({
          title: t("cartUpdated"),
          description: `${product.name} ${t("quantityIncreased")}`,
          variant: "default",
        });
        
        return updatedItems;
      } else {
        // Add new product to cart
        toast({
          title: t("productAdded"),
          description: `${product.name} ${t("addedToCart")}`,
          variant: "default",
        });
        
        return [...prevItems, {
          product,
          quantity: 1,
          selectedSize: selectedSize || (product.sizes.length > 0 ? product.sizes[0] : undefined)
        }];
      }
    });
  };

  const removeItem = (productId: string, selectedSize?: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find(
        (item) => item.product.id === productId && item.selectedSize === selectedSize
      );
      
      const updatedItems = prevItems.filter(
        (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
      );
      
      if (itemToRemove) {
        toast({
          title: t("itemRemoved"),
          description: `${itemToRemove.product.name} ${t("removedFromCart")}`,
          variant: "default",
        });
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeItem(productId, selectedSize);
      return;
    }

    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.product.id === productId && item.selectedSize === selectedSize) {
          toast({
            title: t("quantityUpdated"),
            description: `${item.product.name}: ${quantity} ${t("items")}`,
            variant: "default",
          });
          return { ...item, quantity: quantity };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
    toast({
      title: t("cartCleared"),
      description: t("cartClearedMessage"),
      variant: "default",
    });
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.product.discountPrice || item.product.price) * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        // Add these properties to make them available through the context
        itemCount,
        items: cartItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
