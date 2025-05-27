import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { ArrowLeft, Save } from "lucide-react";
import ImageDropzone from "@/components/upload/ImageDropzone";

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { getClient } = useSupabase();
  const { isAdmin, isLoaded } = useAdmin();
  const isEditing = !!id;

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    category: "boots",
    images: [],
    inStock: true,
    featured: false,
    sizes: [],
  });
  const [categories, setCategories] = useState<
    { name: string; sizes: string[] }[]
  >([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      toast.error(t("unauthorizedAccess"));
      navigate("/admin");
    }
  }, [isLoaded, isAdmin, navigate, t]);

  useEffect(() => {
    const loadData = async () => {
      if (!isAdmin) return;

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
        if (id) {
          const product = await getProductById(client, id);
          if (product) {
            setFormData(product);
            setSelectedSizes(product.sizes);
          } else {
            toast.error(t("productNotFound"));
            navigate("/admin");
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error(t("errorLoadingData"));
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getClient, isAdmin, id, navigate, t]);

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
    if (name === "category") {
      const category = categories.find((c) => c.name === value);
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
      if (checked) {
        return [...prev, size];
      }
      return prev.filter((s) => s !== size);
    });
  };

  const handleImageUpload = (imageData: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.isArray(imageData)
        ? [...prev.images, ...imageData]
        : [imageData],
    }));
  };

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const client = await getClient();
      const productData = {
        ...formData,
        sizes: selectedSizes,
      } as Product;

      let updatedProduct: Product | null;
      if (isEditing && id) {
        updatedProduct = await updateProduct(client, {
          ...productData,
          id,
        });
      } else {
        updatedProduct = await addProduct(client, productData);
      }

      if (updatedProduct) {
        toast.success(isEditing ? t("productUpdated") : t("productAdded"));
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(t("errorSavingProduct"));
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const currentCategory = categories.find((c) => c.name === formData.category);
  const availableSizes = currentCategory?.sizes || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            {t("backToAdmin")}
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? t("editProduct") : t("addProduct")}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? t("editProductDetails") : t("addProductDetails")}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? t("editProductDescription")
                : t("addProductDescription")}
            </CardDescription>
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
                  <Label htmlFor="category">{t("category")}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {t(category.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>{t("images")}</Label>
                <div className="border rounded-lg p-4 bg-card">
                  <ImageDropzone
                    onImageUpload={handleImageUpload}
                    currentImages={formData.images || []}
                    onImageRemove={handleImageRemove}
                    multiple={true}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("sizes")}</Label>
                <div className="border rounded-lg p-4 bg-card">
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

              <div className="flex items-center space-x-6 p-4 border rounded-lg bg-card">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("inStock", checked as boolean)
                    }
                  />
                  <Label htmlFor="inStock">{t("inStock")}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("featured", checked as boolean)
                    }
                  />
                  <Label htmlFor="featured">{t("featured")}</Label>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin")}
                >
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
      </div>
    </div>
  );
};

export default ProductFormPage;
