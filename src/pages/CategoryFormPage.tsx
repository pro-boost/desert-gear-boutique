import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import { toast } from "@/components/ui/sonner";
import {
  addCategory,
  updateCategory,
  ensureCategoriesTable,
} from "@/services/productService";

interface Category {
  nameFr: string;
  nameAr: string;
  sizes: string[];
}

const CategoryFormPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { categoryNameFr } = useParams();
  const { getClient } = useSupabase();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryNameFr) {
        setLoading(false);
        return;
      }

      try {
        const client = await getClient();
        const { data: categories } = await client
          .from("categories")
          .select("*")
          .eq("name_fr", categoryNameFr)
          .single();

        if (categories) {
          setCategory({
            nameFr: categories.name_fr,
            nameAr: categories.name_ar,
            sizes: categories.sizes,
          });
        }
      } catch (error) {
        console.error("Error loading category:", error);
        toast.error(t("errorLoadingCategory"));
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryNameFr, getClient, t]);

  const handleSubmit = async (
    categoryData: Omit<Category, "createdAt" | "updatedAt">
  ) => {
    try {
      setSaving(true);
      const client = await getClient();

      // Ensure the categories table exists before proceeding
      const tableExists = await ensureCategoriesTable(client);
      if (!tableExists) {
        toast.error(t("errorCreatingCategoriesTable"));
        return;
      }

      let savedCategory;

      if (categoryNameFr) {
        // Update existing category
        savedCategory = await updateCategory(client, categoryData);
        if (savedCategory) {
          toast.success(t("categoryUpdated"));
        }
      } else {
        // Add new category
        savedCategory = await addCategory(client, categoryData);
        if (savedCategory) {
          toast.success(t("categoryAdded"));
        }
      }

      if (savedCategory) {
        navigate("/admin");
      } else {
        toast.error(t("errorSavingCategory"));
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(t("errorSavingCategory"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={handleCancel} disabled={saving}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToAdmin")}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            {t("cancel")}
          </Button>
        </div>

        <CategoryForm
          editingCategory={category}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={saving}
        />
      </div>
    </div>
  );
};

export default CategoryFormPage;
