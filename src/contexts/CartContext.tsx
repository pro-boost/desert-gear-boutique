import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/types/product";
import { toast } from "react-hot-toast";

type CartItem = Product & { quantity: number, selectedSize?: string };

interface CartContextType {
  cartItems: CartItem[];
  addItem: (product: Product, selectedSize?: string) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    const storedItems = localStorage.getItem("cartItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (product: Product, selectedSize?: string) => {
    setCartItems((prevItems) => {
      // Create a new cart item with the product and selected size
      const newItem = {
        ...product,
        quantity: 1,
        selectedSize: selectedSize || (product.sizes.length > 0 ? product.sizes[0] : undefined)
      };
      
      // Check if the product with the same size already exists in the cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItemIndex >= 0) {
        // Product with same size exists, increment its quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        return updatedItems;
      } else {
        // Add new product to cart
        const updatedItems = [...prevItems, newItem];
        
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        return updatedItems;
      }
    });

    // Show success toast
    toast.success("Item added to cart");
  };

  const removeItem = (productId: string, selectedSize?: string) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter(
        (item) => !(item.id === productId && item.selectedSize === selectedSize)
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeItem(productId, selectedSize);
      return;
    }

    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === productId && item.selectedSize === selectedSize) {
          return { ...item, quantity: quantity };
        }
        return item;
      });
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
    toast.success("Cart cleared");
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
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
