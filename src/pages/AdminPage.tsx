import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getProducts,
  deleteProduct,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/services/productService";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { useAdmin } from "@/hooks/useAdmin";
import ProductsSection from "@/components/admin/ProductsSection";
import CategoriesSection from "@/components/admin/CategoriesSection";

interface Category {
  name: string;
  sizes: string[];
}

const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { getClient } = useSupabase();
  const { isAdmin, isLoaded } = useAdmin();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      toast.error(t("unauthorizedAccess"));
      navigate("/");
    }
  }, [isLoaded, isAdmin, navigate, t]);

  useEffect(() => {
    const loadData = async () => {
      if (!isAdmin) return;

      try {
        setLoading(true);
        const client = await getClient();
        const [productsData, categoriesData] = await Promise.all([
          getProducts(client),
          getCategories(client),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getClient, isAdmin]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      const client = await getClient();
      const success = await deleteProduct(client, productId);
      if (success) {
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== productId)
        );
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleAddCategory = async (
    category: Omit<Category, "createdAt" | "updatedAt">
  ) => {
    try {
      const client = await getClient();
      const savedCategory = await addCategory(client, category);
      if (savedCategory) {
        setCategories((prev) => [...prev, savedCategory]);
        toast.success(`Category "${savedCategory.name}" added successfully`);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    }
  };

  const handleUpdateCategory = async (
    category: Omit<Category, "createdAt" | "updatedAt">
  ) => {
    try {
      const client = await getClient();
      const savedCategory = await updateCategory(client, category);
      if (savedCategory) {
        setCategories((prev) =>
          prev.map((cat) => (cat.name === category.name ? savedCategory : cat))
        );
        toast.success(`Category "${savedCategory.name}" updated successfully`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      const client = await getClient();
      const success = await deleteCategory(client, categoryName);
      if (success) {
        setCategories((prev) =>
          prev.filter((cat) => cat.name !== categoryName)
        );
        toast.success(`Category "${categoryName}" deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              {t("backToHome")}
            </Button>
            <h1 className="text-3xl font-bold">{t("adminDashboard")}</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs
              defaultValue="products"
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList className="w-full justify-start">
                <TabsTrigger value="products" className="flex-1 md:flex-none">
                  {t("products")}
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex-1 md:flex-none">
                  {t("categories")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="space-y-8">
                <ProductsSection
                  products={products}
                  onDeleteProduct={handleDeleteProduct}
                />
              </TabsContent>

              <TabsContent value="categories" className="space-y-8">
                <CategoriesSection
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
