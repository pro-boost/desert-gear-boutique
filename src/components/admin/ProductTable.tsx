import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
  onRefresh: () => Promise<void>;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const { t } = useLanguage();

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="w-full">
      <CardHeader className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-3/4 h-auto md:w-20 md:h-20 md:self-start object-cover rounded self-center"
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg break-words">
              {product.name}
            </CardTitle>
            <CardDescription className="mt-1 break-words">
              {t("category")}: {product.category}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center md:justify-between gap-2">
          <div className="flex flex-wrap justify-between items-baseline gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-semibold whitespace-nowrap">
                  {product.discountPrice.toFixed(2)} Dh
                </span>
                <span className="text-sm text-muted-foreground line-through whitespace-nowrap">
                  {product.price.toFixed(2)} Dh
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold whitespace-nowrap">
                {product.price.toFixed(2)} Dh
              </span>
            )}
          </div>
          <Badge
            variant={product.inStock ? "default" : "destructive"}
            className="whitespace-nowrap self-start sm:self-center"
          >
            {product.inStock ? t("inStock") : t("outOfStock")}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product.id)}
            className="flex-1 p-1 min-w-[120px]"
          >
            <Edit className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">{t("edit")}</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 p-1 min-w-[120px]"
              >
                <Trash className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">{t("delete")}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deleteProduct")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteProductConfirmation")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(product.id)}>
                  {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{t("image")}</TableHead>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead>{t("price")}</TableHead>
              <TableHead className="text-center">{t("status")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {product.name}
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  {product.category}
                </TableCell>
                <TableCell>
                  {product.discountPrice ? (
                    <div className="flex flex-col">
                      <span>{product.discountPrice.toFixed(2)} Dh</span>
                      <span className="text-sm text-muted-foreground line-through">
                        {product.price.toFixed(2)} Dh
                      </span>
                    </div>
                  ) : (
                    <span>{product.price.toFixed(2)} Dh</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={product.inStock ? "default" : "destructive"}
                    className="whitespace-nowrap"
                  >
                    {product.inStock ? t("inStock") : t("outOfStock")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(product.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("deleteProduct")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deleteProductConfirmation")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(product.id)}
                          >
                            {t("delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductTable;
