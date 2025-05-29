import React, { useState } from "react";
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
  name: string;
  sizes: string[];
}

interface CategoryFormProps {
  editingCategory: Category | null;
  onSubmit: (
    category: Omit<Category, "createdAt" | "updatedAt">
  ) => Promise<void>;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  editingCategory,
  onSubmit,
  onCancel,
}) => {
  const { t } = useLanguage();
  const [newCategoryName, setNewCategoryName] = useState(
    editingCategory?.name || ""
  );
  const [newCategorySizes, setNewCategorySizes] = useState<string[]>(
    editingCategory?.sizes || []
  );
  const [newSize, setNewSize] = useState("");

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
    if (!newCategoryName.trim()) return;

    await onSubmit({
      name: newCategoryName.trim().toLowerCase(),
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
              <Label htmlFor="categoryName">{t("categoryName")}</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder={t("enterCategoryName")}
                className="w-full"
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
                />
                <Button
                  onClick={handleAddSize}
                  type="button"
                  className="w-full sm:w-auto"
                >
                  {t("addSize")}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 card-section p-4">
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
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              {editingCategory && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  {t("cancel")}
                </Button>
              )}
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                {editingCategory ? t("saveChanges") : t("addCategory")}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
