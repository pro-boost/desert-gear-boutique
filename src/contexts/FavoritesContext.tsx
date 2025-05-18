import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Product } from "@/types/product";

interface FavoritesContextType {
  items: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [items, setItems] = useState<Product[]>([]);

  // Load favorites from localStorage when user changes
  useEffect(() => {
    if (user) {
      // For signed-in users, load their synced favorites
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setItems(JSON.parse(storedFavorites));
      } else {
        // If no synced favorites exist, try to load the local favorites
        const localFavorites = localStorage.getItem("local_favorites");
        if (localFavorites) {
          setItems(JSON.parse(localFavorites));
          // Save the local favorites to the user's synced favorites
          localStorage.setItem(`favorites_${user.id}`, localFavorites);
          // Clear the local favorites
          localStorage.removeItem("local_favorites");
        } else {
          setItems([]);
        }
      }
    } else {
      // For non-signed-in users, load the local favorites
      const localFavorites = localStorage.getItem("local_favorites");
      if (localFavorites) {
        setItems(JSON.parse(localFavorites));
      } else {
        setItems([]);
      }
    }
  }, [user]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (user) {
      // For signed-in users, save to their synced favorites
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(items));
    } else {
      // For non-signed-in users, save to local favorites
      localStorage.setItem("local_favorites", JSON.stringify(items));
    }
  }, [items, user]);

  const addToFavorites = (product: Product) => {
    setItems((prev) => {
      if (!prev.find((item) => item.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromFavorites = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const isFavorite = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        items,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Export the context for use in the hook
export { FavoritesContext };
