import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getProducts,
  deleteProduct,
  getCategories,
  deleteCategory,
} from "@/services/productService";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { useAdmin } from "@/hooks/useAdmin";
import ProductsSection from "@/components/admin/ProductsSection";
import CategoriesSection from "@/components/admin/CategoriesSection";
import CategoryFormPage from "./CategoryFormPage";
import ProductFormPage from "./ProductFormPage";

interface Category {
  nameFr: string;
  nameAr: string;
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
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const loadData = useCallback(async () => {
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
  }, [getClient, isAdmin]);

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      toast.error(t("unauthorizedAccess"));
      navigate("/");
    }
  }, [isLoaded, isAdmin, navigate, t]);

  useEffect(() => {
    loadData();
  }, [getClient, isAdmin, loadData]);

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

  const handleDeleteCategory = async (categoryNameFr: string) => {
    try {
      const client = await getClient();
      const success = await deleteCategory(client, categoryNameFr);
      if (success) {
        setCategories((prev) =>
          prev.filter((cat) => cat.nameFr !== categoryNameFr)
        );
        toast.success(`Category "${categoryNameFr}" deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (categoryName: string) => {
    setEditingCategory(categoryName);
    setShowCategoryForm(true);
  };

  const handleCategoryFormClose = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    loadData();
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (productId: string) => {
    setEditingProduct(productId);
    setShowProductForm(true);
  };

  const handleProductFormClose = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    loadData();
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-center">
              {t("adminDashboard")}
            </h1>
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
              <TabsList className="w-full justify-between">
                <TabsTrigger
                  value="products"
                  className="flex-1 w-1/2 md:flex-none"
                >
                  {t("products")}
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="flex-1 w-1/2 md:flex-none"
                >
                  {t("categories")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="space-y-6">
                {showProductForm ? (
                  <ProductFormPage
                    productId={editingProduct || undefined}
                    onClose={handleProductFormClose}
                  />
                ) : (
                  <ProductsSection
                    products={products}
                    onAddProduct={handleAddProduct}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                    onRefresh={loadData}
                  />
                )}
              </TabsContent>

              <TabsContent value="categories" className="space-y-8">
                {showCategoryForm ? (
                  <CategoryFormPage
                    categoryName={editingCategory}
                    onClose={handleCategoryFormClose}
                  />
                ) : (
                  <CategoriesSection
                    categories={categories}
                    onDeleteCategory={handleDeleteCategory}
                    onEditCategory={handleEditCategory}
                    onRefresh={loadData}
                    onAddCategory={handleAddCategory}
                  />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
