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

interface ProductFiltersProps {
  filters: Filters;
  categories: { name: string; sizes: string[] }[];
  onCategoryChange: (value: string) => void;
  onSizeChange: (value: string) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  categories,
  onCategoryChange,
  onSizeChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Select value={filters.category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t("selectCategory")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allCategories")}</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.name} value={category.name}>
              {t(category.name)}
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
            .find((cat) => cat.name === filters.category)
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
