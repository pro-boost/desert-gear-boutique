import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types/product";
import { useAuth } from "./AuthContext";
import { useLanguage } from "./LanguageContext";

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const storageKey = user ? `favorites-${user.id}` : "favorites-guest";
  const { t } = useLanguage();

  const saveFavorites = (favorites: Product[]) => {
    try {
      // Limit the data being stored by only keeping essential fields
      const limitedFavorites = favorites.map(
        ({ id, name, price, images, discountPrice }) => ({
          id,
          name,
          price,
          images,
          discountPrice,
        })
      );

      const favoritesData = JSON.stringify(limitedFavorites);
      localStorage.setItem(storageKey, favoritesData);
    } catch (error) {
      console.error("Error saving favorites:", error);
      // If storage is full, try to clear old data
      try {
        localStorage.clear();
        const limitedFavorites = favorites.map(
          ({ id, name, price, images, discountPrice }) => ({
            id,
            name,
            price,
            images,
            discountPrice,
          })
        );
        localStorage.setItem(storageKey, JSON.stringify(limitedFavorites));
      } catch (retryError) {
        console.error(
          "Failed to save favorites after clearing storage:",
          retryError
        );
      }
    }
  };

  const loadFavorites = (): Product[] => {
    try {
      const favoritesData = localStorage.getItem(storageKey);
      if (!favoritesData) return [];
      return JSON.parse(favoritesData);
    } catch (error) {
      console.error("Error loading favorites:", error);
      return [];
    }
  };

  useEffect(() => {
    setFavorites(loadFavorites());
  }, [user]);

  const addToFavorites = (product: Product) => {
    setFavorites((prev) => {
      const newFavorites = [...prev, product];
      saveFavorites(newFavorites);
      toast.success(`${product.name} ajouté aux favoris`);
      return newFavorites;
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((item) => item.id !== productId);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.some((item) => item.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
