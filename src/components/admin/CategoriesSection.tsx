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
import { PlusCircle } from "lucide-react";
import CategoryCard from "./CategoryCard";

interface Category {
  nameFr: string;
  nameAr: string;
  sizes: string[];
}

interface CategoriesSectionProps {
  categories: Category[];
  onDeleteCategory: (categoryNameFr: string) => Promise<void>;
  onEditCategory: (categoryName: string) => void;
  onRefresh: () => Promise<void>;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onDeleteCategory,
  onEditCategory,
  onRefresh,
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
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.nameFr}
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
