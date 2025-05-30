import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
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
  nameFr: string;
  nameAr: string;
  sizes: string[];
}

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryNameFr: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
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
    <Card className="card-section h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle
              className="text-lg capitalize"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {getCategoryName()}
            </CardTitle>
            <CardDescription>
              {t("sizes")}: {category.sizes.length}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(category.nameFr)}
                >
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
                  <AlertDialogAction onClick={() => onDelete(category.nameFr)}>
                    {t("delete")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {category.sizes.map((size) => (
            <Badge key={size} variant="secondary">
              {size}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
