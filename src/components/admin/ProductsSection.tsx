import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import ProductTable from "./ProductTable";

interface ProductsSectionProps {
  products: Product[];
  onDeleteProduct: (productId: string) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  onDeleteProduct,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="card-section">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-4 text-center">
            <CardTitle>{t("manageProducts")}</CardTitle>
            <CardDescription>{t("manageProductsDescription")}</CardDescription>
          </div>
          <Link to="/admin/products/new" className="w-full md:w-auto">
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("addProduct")}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="rounded-md">
          <ProductTable products={products} onDelete={onDeleteProduct} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsSection;
