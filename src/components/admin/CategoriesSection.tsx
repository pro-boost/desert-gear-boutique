import React from "react";
import { useNavigate } from "react-router-dom";
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
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onDeleteCategory,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

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
            onClick={() => navigate("/admin/categories/new")}
            className="w-full md:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("addCategory")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.nameFr}
              category={category}
              onEdit={() =>
                navigate(`/admin/categories/${category.nameFr}/edit`)
              }
              onDelete={onDeleteCategory}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesSection;
