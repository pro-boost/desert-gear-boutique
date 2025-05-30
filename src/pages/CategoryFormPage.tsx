import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import { toast } from "@/components/ui/sonner";
import {
  addCategory,
  updateCategory,
  ensureCategoriesTable,
  getCategories,
} from "@/services/productService";

interface Category {
  nameFr: string;
  nameAr: string;
  sizes: string[];
}

const CategoryFormPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const { getClient } = useSupabase();
  const { isAdmin, isLoaded } = useAdmin();
  const isEditing = !!categoryName;

  console.log("CategoryFormPage render:", {
    categoryName,
    isEditing,
    isAdmin,
    isLoaded,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Category>({
    nameFr: "",
    nameAr: "",
    sizes: [],
  });

  console.log("Current formData state:", formData);

  useEffect(() => {
    console.log("Admin check effect:", { isLoaded, isAdmin });
    if (isLoaded && !isAdmin) {
      toast.error(t("unauthorizedAccess"));
      navigate("/admin");
    }
  }, [isLoaded, isAdmin, navigate, t]);

  useEffect(() => {
    const loadData = async () => {
      console.log("loadData called:", { isAdmin, isEditing, categoryName });
      if (!isAdmin) return;

      try {
        setLoading(true);
        const client = await getClient();

        // If editing, load category data
        if (isEditing && categoryName) {
          console.log(
            "Fetching category data for:",
            decodeURIComponent(categoryName)
          );
          const { data, error } = await client
            .from("categories")
            .select("*")
            .eq("name_fr", decodeURIComponent(categoryName))
            .single();

          console.log("Category fetch result:", { data, error });

          if (error) {
            throw error;
          }

          if (data) {
            const newFormData = {
              nameFr: data.name_fr,
              nameAr: data.name_ar,
              sizes: data.sizes || [],
            };
            console.log("Setting new form data:", newFormData);
            setFormData(newFormData);
          } else {
            console.log("Category not found, redirecting to admin");
            toast.error(t("categoryNotFound"));
            navigate("/admin");
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error(t("errorLoadingData"));
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getClient, isAdmin, isEditing, categoryName, navigate, t]);

  const handleSubmit = async (
    categoryData: Omit<Category, "createdAt" | "updatedAt">
  ) => {
    console.log("handleSubmit called with:", categoryData);
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

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
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
          editingCategory={isEditing ? formData : null}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={saving}
        />
      </div>
    </div>
  );
};

export default CategoryFormPage;
