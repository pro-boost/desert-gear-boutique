import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const { t } = useLanguage();

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-card rounded-xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-8 text-center sm:text-left">
        {t("relatedProducts")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
