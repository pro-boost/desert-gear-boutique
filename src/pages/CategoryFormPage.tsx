import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useAdmin } from "@/hooks/useAdmin";
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

interface CategoryFormPageProps {
  categoryName?: string;
  onClose: () => void;
}

const CategoryFormPage: React.FC<CategoryFormPageProps> = ({
  categoryName,
  onClose,
}) => {
  const { t } = useLanguage();
  const { getClient } = useSupabase();
  const { isAdmin, isLoaded } = useAdmin();
  const isEditing = !!categoryName;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Category>({
    nameFr: "",
    nameAr: "",
    sizes: [],
  });

  useEffect(() => {
    const loadData = async () => {
      if (!isAdmin) return;

      try {
        setLoading(true);
        const client = await getClient();

        // If editing, load category data
        if (isEditing && categoryName) {
          const { data, error } = await client
            .from("categories")
            .select("*")
            .eq("name_fr", decodeURIComponent(categoryName))
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            setFormData({
              nameFr: data.name_fr,
              nameAr: data.name_ar,
              sizes: data.sizes || [],
            });
          } else {
            toast.error(t("categoryNotFound"));
            onClose();
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error(t("errorLoadingData"));
        onClose();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getClient, isAdmin, isEditing, categoryName, onClose, t]);

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

      if (isEditing) {
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
        onClose();
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

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <CategoryForm
      editingCategory={isEditing ? formData : null}
      onSubmit={handleSubmit}
      onCancel={onClose}
      isSubmitting={saving}
    />
  );
};

export default CategoryFormPage;
