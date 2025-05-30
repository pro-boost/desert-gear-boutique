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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("products")}</CardTitle>
            <CardDescription>{t("manageProductsDescription")}</CardDescription>
          </div>
          <Button onClick={onAddProduct} className="gap-2">
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
