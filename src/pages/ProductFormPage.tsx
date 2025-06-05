import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useAdmin } from "@/hooks/useAdmin";
import {
  getProductById,
  addProduct,
  updateProduct,
  getCategories,
} from "@/services/productService";
import { Product } from "@/types/product";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Save, ArrowLeft, GripVertical, X } from "lucide-react";
import ImageDropzone from "@/components/upload/ImageDropzone";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Category {
  nameFr: string;
  nameAr: string;
  sizes: string[];
}

interface ProductFormData {
  name: string;
  descriptionFr: string;
  descriptionAr: string;
  price: number;
  discountPrice: number | null;
  categoryId: string;
  images: string[];
  sizes: string[];
}

interface ProductFormPageProps {
  productId?: string;
  onClose: () => void;
}

// Helper function to convert Product to ProductFormData
const productToFormData = (product: Product): ProductFormData => ({
  name: product.name,
  descriptionFr: product.descriptionFr,
  descriptionAr: product.descriptionAr,
  price: product.price,
  discountPrice: product.discountPrice ?? null,
  categoryId: product.categoryId,
  images: product.images,
  sizes: product.sizes,
});

// Helper function to convert ProductFormData to database format
const formDataToProductRecord = (
  formData: ProductFormData,
  id?: string
): Database["public"]["Tables"]["products"]["Insert"] => ({
  id: id,
  name: formData.name,
  description_fr: formData.descriptionFr,
  description_ar: formData.descriptionAr,
  price: formData.price,
  discount_price: formData.discountPrice,
  category_id: formData.categoryId,
  images: formData.images,
  sizes: formData.sizes,
  featured: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const ProductFormPage: React.FC<ProductFormPageProps> = ({
  productId,
  onClose,
}) => {
  const { t, language } = useLanguage();
  const {
    getClient,
    isLoading: isSupabaseLoading,
    isInitialized,
  } = useSupabase();
  const { isAdmin, isLoaded } = useAdmin();
  const isEditing = !!productId;

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    descriptionFr: "",
    descriptionAr: "",
    price: 0,
    discountPrice: null,
    categoryId: "boots",
    images: [],
    sizes: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!isAdmin || !isInitialized) return;

      try {
        setLoading(true);
        const client = await getClient();

        // Load categories
        const categoriesData = await getCategories(client);
        if (!categoriesData) {
          throw new Error("Failed to load categories");
        }
        setCategories(categoriesData);

        // If editing, load product data
        if (productId) {
          const product = await getProductById(client, productId);
          if (product) {
            setFormData(productToFormData(product));
            setSelectedSizes(product.sizes);
          } else {
            toast.error(t("productNotFound"));
            onClose();
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error(t("errorLoadingData"));
        onClose();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getClient, isAdmin, isInitialized, productId, onClose, t]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discountPrice"
          ? parseFloat(value || "0")
          : value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "categoryId") {
      const category = categories.find((c) => c.nameFr === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        sizes: [], // Reset sizes when category changes
      }));
      setSelectedSizes([]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    setSelectedSizes((prev) => {
      const newSizes = checked
        ? [...prev, size]
        : prev.filter((s) => s !== size);

      // Update formData.sizes to match selectedSizes
      setFormData((prevForm) => ({
        ...prevForm,
        sizes: newSizes,
      }));

      return newSizes;
    });
  };

  const handleImageChange = (newImages: Array<{ src: string }>) => {
    setFormData((prev) => ({
      ...prev,
      images: newImages.map((img) => img.src),
    }));
  };

  const handleImageReorder = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(formData.images || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormData((prev) => ({
      ...prev,
      images: items,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.descriptionFr ||
      !formData.descriptionAr ||
      !formData.price ||
      !formData.categoryId ||
      !formData.images ||
      formData.images.length === 0
    ) {
      toast.error(t("pleaseFillAllRequiredFields"));
      return;
    }

    try {
      const client = await getClient();

      // Convert form data to product format
      const productData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
        name: formData.name,
        descriptionFr: formData.descriptionFr,
        descriptionAr: formData.descriptionAr,
        price: formData.price,
        discountPrice: formData.discountPrice,
        categoryId: formData.categoryId,
        images: formData.images,
        sizes: formData.sizes,
      };

      let updatedProduct: Product | null;
      if (isEditing && productId) {
        updatedProduct = await updateProduct(client, {
          ...productData,
          id: productId,
        } as Product);
      } else {
        updatedProduct = await addProduct(client, productData);
      }

      if (updatedProduct) {
        toast.success(isEditing ? t("productUpdated") : t("productAdded"));
        onClose();
      } else {
        throw new Error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(t("errorSavingProduct"));
    }
  };

  // Helper function to get category display name
  const getCategoryDisplayName = (category: Category) => {
    return language === "ar" ? category.nameAr : category.nameFr;
  };

  if (!isLoaded || loading || isSupabaseLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const currentCategory = categories.find(
    (c) => c.nameFr === formData.categoryId
  );
  const availableSizes = currentCategory?.sizes || [];

  return (
    <Card className="card-section">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-4 text-center md:text-start w-full">
            <CardTitle>
              {isEditing ? t("editProductDetails") : t("addProductDetails")}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? t("editProductDescription")
                : t("addProductDescription")}
            </CardDescription>
          </div>
          <div className="p-6 pb-0">
            <Button variant="ghost" onClick={onClose} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToProducts")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("productName")}</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">{t("category")}</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  handleSelectChange("categoryId", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.nameFr} value={category.nameFr}>
                      {getCategoryDisplayName(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descriptionFr">{t("descriptionFr")}</Label>
              <Textarea
                id="descriptionFr"
                name="descriptionFr"
                value={formData.descriptionFr}
                onChange={handleInputChange}
                required
                className="min-h-[100px]"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descriptionAr">{t("descriptionAr")}</Label>
              <Textarea
                id="descriptionAr"
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleInputChange}
                required
                className="min-h-[100px]"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t("price")}</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPrice">{t("discountPrice")}</Label>
              <Input
                id="discountPrice"
                name="discountPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.discountPrice || ""}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("images")}</Label>
            <div className="card-section p-4">
              <ImageDropzone
                onImagesChange={handleImageChange}
                initialImages={formData.images.map((src, index) => ({
                  id: `existing-${index}`,
                  src,
                  name: `Image ${index + 1}`,
                  size: 0,
                }))}
                maxImages={5}
                maxSizeMB={5}
              />
              {formData.images && formData.images.length > 0 && (
                <DragDropContext onDragEnd={handleImageReorder}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex flex-wrap gap-4 mt-4"
                      >
                        {formData.images.map((image, index) => (
                          <Draggable
                            key={index}
                            draggableId={`image-${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="relative"
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full p-1 cursor-move"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                <img
                                  src={image}
                                  alt={`Product image ${index + 1}`}
                                  className="w-24 h-24 object-cover rounded-md"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-5 w-5"
                                  onClick={() => {
                                    const newImages = formData.images.filter(
                                      (_, i) => i !== index
                                    );
                                    setFormData((prev) => ({
                                      ...prev,
                                      images: newImages,
                                    }));
                                  }}
                                  type="button"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("sizes")}</Label>
            <div className="card-section p-4">
              <div className="flex flex-wrap gap-4">
                {availableSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={(checked) =>
                        handleSizeChange(size, checked as boolean)
                      }
                    />
                    <Label htmlFor={`size-${size}`}>{size}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button type="submit" className="gap-2">
              <Save size={16} />
              {isEditing ? t("saveChanges") : t("addProduct")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductFormPage;
