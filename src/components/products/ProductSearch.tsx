import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { debounce } from "lodash";

interface ProductSearchProps {
  onSearch: (value: string) => void;
  initialValue?: string;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  initialValue = "",
}) => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(initialValue);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );

  // Update search value when URL changes
  useEffect(() => {
    const searchParam = searchParams.get("search") || "";
    setSearchValue(searchParam);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={t("searchProducts")}
        value={searchValue}
        onChange={handleChange}
        className="pl-10 w-full"
      />
    </div>
  );
};
