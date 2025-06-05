import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface Category {
  id: string;
  nameFr: string;
  nameAr: string;
  sizes: string[];
}

interface CategoryCardProps {
  category: Category;
  onDelete: (categoryId: string) => void;
  onEdit: (categoryId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onDelete,
  onEdit,
}) => {
  const { t, language } = useLanguage();

  const getCategoryName = () => {
    switch (language) {
      case "fr":
        return category.nameFr;
      case "ar":
        return category.nameAr;
      default:
        return category.nameFr;
    }
  };

  return (
    <Card className="w-full flex flex-col justify-between">
      <CardHeader className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle
              className="text-lg break-words"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {getCategoryName()}
            </CardTitle>
            <CardDescription className="mt-1">
              {t("sizes")}: {category.sizes.length}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          {category.sizes.map((size) => (
            <Badge key={size} variant="secondary" className="whitespace-nowrap">
              {size}
            </Badge>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(category.id)}
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
                <AlertDialogTitle>{t("deleteCategory")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteCategoryConfirmation")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(category.id)}>
                  {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
