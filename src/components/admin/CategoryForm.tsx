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
import { Save, X, ArrowLeft } from "lucide-react";

interface Category {
  id: string;
  nameFr: string;
  nameAr: string;
  sizes: string[];
}

interface CategoryFormProps {
  editingCategory: Category | null;
  onSubmit: (
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  editingCategory,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const { t } = useLanguage();
  const [nameFr, setNameFr] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setNameFr(editingCategory.nameFr);
      setNameAr(editingCategory.nameAr);
      setSizes(editingCategory.sizes);
    }
  }, [editingCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      nameFr,
      nameAr,
      sizes,
    });
  };

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize("");
    }
  };

  const handleRemoveSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  return (
    <Card className="card-section">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>
              {editingCategory ? t("editCategory") : t("addCategory")}
            </CardTitle>
            <CardDescription>
              {editingCategory
                ? t("editCategoryDescription")
                : t("addCategoryDescription")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nameFr">{t("nameFr")}</Label>
              <Input
                id="nameFr"
                value={nameFr}
                onChange={(e) => setNameFr(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nameAr">{t("nameAr")}</Label>
              <Input
                id="nameAr"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                required
                dir="rtl"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="newSize">{t("addSize")}</Label>
                <Input
                  id="newSize"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder={t("enterSize")}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSize}
                disabled={!newSize || sizes.includes(newSize)}
              >
                <X className="h-4 w-4 rotate-45" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Badge
                  key={size}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {size}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveSize(size)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t("saving")}
                </div>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {editingCategory ? t("saveChanges") : t("addCategory")}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
