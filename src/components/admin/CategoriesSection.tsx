import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import CategoryForm from "./CategoryForm";
import CategoryCard from "./CategoryCard";

interface Category {
  name: string;
  sizes: string[];
}

interface CategoriesSectionProps {
  categories: Category[];
  onAddCategory: (
    category: Omit<Category, "createdAt" | "updatedAt">
  ) => Promise<void>;
  onUpdateCategory: (
    category: Omit<Category, "createdAt" | "updatedAt">
  ) => Promise<void>;
  onDeleteCategory: (categoryName: string) => Promise<void>;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const { t } = useLanguage();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleSubmit = async (
    category: Omit<Category, "createdAt" | "updatedAt">
  ) => {
    if (editingCategory) {
      await onUpdateCategory(category);
    } else {
      await onAddCategory(category);
    }
    setEditingCategory(null);
  };

  return (
    <Card className="card-section">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>{t("manageCategories")}</CardTitle>
            <CardDescription>
              {t("manageCategoriesDescription")}
            </CardDescription>
          </div>
          <Button
            onClick={() => setEditingCategory(null)}
            className="w-full md:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("addCategory")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-6">
          <CategoryForm
            editingCategory={editingCategory}
            onSubmit={handleSubmit}
            onCancel={() => setEditingCategory(null)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                category={category}
                onEdit={setEditingCategory}
                onDelete={onDeleteCategory}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesSection;
