import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import ProductTable from "./ProductTable";

interface ProductsSectionProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onRefresh,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="card-section">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-4 text-center md:text-start w-full">
            <CardTitle>{t("products")}</CardTitle>
            <CardDescription>{t("manageProductsDescription")}</CardDescription>
          </div>
          <Button onClick={onAddProduct} className="w-full md:w-auto gap-2">
            <Plus size={16} />
            {t("addProduct")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ProductTable
          products={products}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
          onRefresh={onRefresh}
        />
      </CardContent>
    </Card>
  );
};

export default ProductsSection;
