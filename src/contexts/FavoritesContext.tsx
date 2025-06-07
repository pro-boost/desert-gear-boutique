import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Product } from "@/types/product";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabase } from "@/hooks/useSupabase";
import {
  getUserFavorites,
  addToFavorites as addToFavoritesDB,
  removeFromFavorites as removeFromFavoritesDB,
} from "@/services/userDataService";

interface FavoritesContextType {
  items: Product[];
  addToFavorites: (product: Product) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const { t } = useLanguage();
  const { getClient, isInitialized } = useSupabase();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from database when user changes
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user || !isInitialized) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const client = await getClient();
        const favorites = await getUserFavorites(client, user.id);
        setItems(favorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
        toast.error(t("errorLoadingFavorites"));
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user, isInitialized, getClient, t]);

  const addToFavorites = async (product: Product) => {
    if (!user) {
      toast.error(t("pleaseSignIn"));
      return;
    }

    try {
      const client = await getClient();
      await addToFavoritesDB(client, product.id);
      setItems((prev) => {
        if (!prev.find((item) => item.id === product.id)) {
          toast.success(t("addedToFavorites"));
          return [...prev, product];
        }
        return prev;
      });
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error(t("errorAddingToFavorites"));
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) {
      toast.error(t("pleaseSignIn"));
      return;
    }

    try {
      const client = await getClient();
      await removeFromFavoritesDB(client, productId);
      setItems((prev) => {
        const product = prev.find((item) => item.id === productId);
        if (product) {
          toast.success(t("removedFromFavorites"));
        }
        return prev.filter((item) => item.id !== productId);
      });
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error(t("errorRemovingFromFavorites"));
    }
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
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Export the context for use in the hook
export { FavoritesContext };
