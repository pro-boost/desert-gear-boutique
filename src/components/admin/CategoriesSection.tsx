import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import CategoryCard from "./CategoryCard";

interface Category {
  id: string;
  nameFr: string;
  nameAr: string;
  sizes: string[];
}

interface CategoriesSectionProps {
  categories: Category[];
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string) => void;
  onRefresh: () => Promise<void>;
  onAddCategory: () => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onDeleteCategory,
  onEditCategory,
  onRefresh,
  onAddCategory,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="card-section">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-4 text-center md:text-start w-full">
            <CardTitle>{t("manageCategories")}</CardTitle>
            <CardDescription>
              {t("manageCategoriesDescription")}
            </CardDescription>
          </div>
          <Button onClick={onAddCategory} className="w-full md:w-auto gap-2">
            <Plus className="h-4 w-4" />
            {t("addCategory")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onDelete={onDeleteCategory}
              onEdit={onEditCategory}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesSection;
