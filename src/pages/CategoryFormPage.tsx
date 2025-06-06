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
  id: string;
  nameFr: string;
  nameAr: string;
  sizes: string[];
}

interface CategoryFormPageProps {
  categoryId?: string;
  onClose: () => void;
}

const CategoryFormPage: React.FC<CategoryFormPageProps> = ({
  categoryId,
  onClose,
}) => {
  const { t } = useLanguage();
  const {
    getClient,
    isInitialized,
    isLoading: isSupabaseLoading,
  } = useSupabase();
  const { isAdmin, isLoaded: isAdminLoaded } = useAdmin();
  const isEditing = !!categoryId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Category>({
    id: "",
    nameFr: "",
    nameAr: "",
    sizes: [],
  });

  useEffect(() => {
    const loadData = async () => {
      if (!isAdmin || !isInitialized) return;

      try {
        setLoading(true);
        const client = await getClient();

        // If editing, load category data
        if (isEditing && categoryId) {
          const { data, error } = await client
            .from("categories")
            .select("*")
            .eq("id", categoryId)
            .single();

          if (error) {
            throw error;
          }

          if (data) {
            setFormData({
              id: data.id,
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
  }, [getClient, isAdmin, isInitialized, isEditing, categoryId, onClose, t]);

  const handleSubmit = async (
    categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
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
        savedCategory = await updateCategory(client, {
          id: categoryId!,
          ...categoryData,
        });
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

  if (!isAdminLoaded || !isInitialized || isSupabaseLoading || loading) {
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
