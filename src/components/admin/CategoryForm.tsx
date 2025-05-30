import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save, X } from "lucide-react";

interface Category {
  nameFr: string;
  nameAr: string;
  sizes: string[];
}

interface CategoryFormProps {
  editingCategory: Category | null;
  onSubmit: (
    category: Omit<Category, "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  editingCategory,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const { t } = useLanguage();
  const [newCategoryNameFr, setNewCategoryNameFr] = useState("");
  const [newCategoryNameAr, setNewCategoryNameAr] = useState("");
  const [newCategorySizes, setNewCategorySizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setNewCategoryNameFr(editingCategory.nameFr);
      setNewCategoryNameAr(editingCategory.nameAr);
      setNewCategorySizes(editingCategory.sizes);
    } else {
      setNewCategoryNameFr("");
      setNewCategoryNameAr("");
      setNewCategorySizes([]);
    }
  }, [editingCategory]);

  const handleAddSize = () => {
    if (newSize.trim() && !newCategorySizes.includes(newSize.trim())) {
      setNewCategorySizes([...newCategorySizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const handleRemoveSize = (size: string) => {
    setNewCategorySizes(newCategorySizes.filter((s) => s !== size));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryNameFr.trim()) return;

    await onSubmit({
      nameFr: newCategoryNameFr.trim(),
      nameAr: newCategoryNameAr.trim(),
      sizes: newCategorySizes,
    });
  };

  return (
    <Card className="card-section">
      <CardHeader>
        <CardTitle>
          {editingCategory ? t("editCategory") : t("addCategory")}
        </CardTitle>
        <CardDescription>
          {editingCategory
            ? t("editCategoryDescription")
            : t("addCategoryDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryNameFr">
                {t("categoryName")} (Français)
              </Label>
              <Input
                id="categoryNameFr"
                value={newCategoryNameFr}
                onChange={(e) => setNewCategoryNameFr(e.target.value)}
                placeholder={t("enterCategoryName")}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryNameAr">
                {t("categoryName")} (العربية)
              </Label>
              <Input
                id="categoryNameAr"
                value={newCategoryNameAr}
                onChange={(e) => setNewCategoryNameAr(e.target.value)}
                placeholder={t("enterCategoryName")}
                className="w-full"
                dir="rtl"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("sizes")}</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder={t("enterSize")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSize();
                    }
                  }}
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <Button
                  onClick={handleAddSize}
                  type="button"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {t("addSize")}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {newCategorySizes.map((size) => (
                <Badge
                  key={size}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {size}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveSize(size)}
                    disabled={isSubmitting}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" className="gap-2" disabled={isSubmitting}>
                <Save className="h-4 w-4" />
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                ) : editingCategory ? (
                  t("saveChanges")
                ) : (
                  t("addCategory")
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
