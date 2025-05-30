import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFilters as Filters } from "@/types/product";

interface Category {
  nameFr: string;
  nameAr: string;
  sizes: string[];
}

interface ProductFiltersProps {
  filters: Filters;
  categories: Category[];
  onCategoryChange: (value: string) => void;
  onSizeChange: (value: string) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  categories,
  onCategoryChange,
  onSizeChange,
}) => {
  const { t, language } = useLanguage();

  const getCategoryName = (category: Category) => {
    switch (language) {
      case "fr":
        return category.nameFr;
      case "ar":
        return category.nameAr;
      default:
        return category.nameFr; // Default to French name
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Select value={filters.category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t("selectCategory")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allCategories")}</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.nameFr} value={category.nameFr}>
              {getCategoryName(category)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.size} onValueChange={onSizeChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t("selectSize")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allSizes")}</SelectItem>
          {categories
            .find((cat) => cat.nameFr === filters.category)
            ?.sizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};
