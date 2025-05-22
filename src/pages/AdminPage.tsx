import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/services/productService";
import {
  Product,
  ProductFilters,
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
} from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Trash,
  Edit,
  Save,
  X,
  Check,
  RotateCcw,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import ImageDropzone from "@/components/ImageDropzone";
import { useSupabase } from "@/hooks/useSupabase";
import { useAdmin } from "@/hooks/useAdmin";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Product form interface
interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  sizes: string[];
}

// Initial form data
const initialFormData: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  category: "boots",
  images: [],
  inStock: true,
  featured: false,
  sizes: [],
};

// Add type for available sizes
type AvailableSizes = {
  [key: string]: string[];
};

// Add new interface for category management
interface Category {
  name: string;
  sizes: string[];
}

const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { getClient } = useSupabase();
  const { isAdmin, isLoaded } = useAdmin();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
  const [isEditing, setIsEditing] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySizes, setNewCategorySizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      toast.error(t("unauthorizedAccess"));
      navigate("/");
    }
  }, [isLoaded, isAdmin, navigate, t]);

  useEffect(() => {
    const loadData = async () => {
      if (!isAdmin) return;

      try {
        setLoading(true);
        const client = await getClient();
        const productsData = await getProducts(client);
        const categoriesData = await getCategories(client);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getClient, isAdmin]);

  useEffect(() => {
    const category = formData.category || "boots";
    const sizes = (PRODUCT_SIZES as Record<string, string[]>)[category] || [];
    setNewCategorySizes(sizes);
  }, [formData.category]);

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
      // When category changes, reset sizes
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        sizes: [], // Reset sizes when category changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sizes: checked
        ? [...prev.sizes, size]
        : prev.sizes.filter((s) => s !== size),
    }));
  };

  const handleAddSize = () => {
    if (newSize.trim() && !newCategorySizes.includes(newSize.trim())) {
      setNewCategorySizes([...newCategorySizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const handleRemoveSize = (size: string) => {
    setNewCategorySizes(newCategorySizes.filter((s) => s !== size));
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const client = await getClient();
      const category: Omit<Category, "createdAt" | "updatedAt"> = {
        name: newCategoryName.trim().toLowerCase(),
        sizes: newCategorySizes,
      };

      const savedCategory = await addCategory(client, category);
      if (savedCategory) {
        setCategories((prev) => [...prev, savedCategory]);
        setNewCategoryName("");
        setNewCategorySizes([]);
        toast.success(`Category "${savedCategory.name}" added successfully`);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategorySizes(category.sizes);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;

    try {
      const client = await getClient();
      const updatedCategory: Omit<Category, "createdAt" | "updatedAt"> = {
        name: newCategoryName.trim().toLowerCase(),
        sizes: newCategorySizes,
      };

      const savedCategory = await updateCategory(client, updatedCategory);
      if (savedCategory) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.name === editingCategory.name ? savedCategory : cat
          )
        );
        setEditingCategory(null);
        setNewCategoryName("");
        setNewCategorySizes([]);
        toast.success(`Category "${savedCategory.name}" updated successfully`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      const client = await getClient();
      const success = await deleteCategory(client, categoryName);
      if (success) {
        setCategories((prev) =>
          prev.filter((cat) => cat.name !== categoryName)
        );
        toast.success(`Category "${categoryName}" deleted successfully`);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const client = await getClient();
      const productData = {
        ...formData,
        sizes: formData.sizes || [],
      } as Product;

      let updatedProduct: Product | null;
      if (selectedProduct) {
        updatedProduct = await updateProduct(client, {
          ...productData,
          id: selectedProduct.id,
        });
      } else {
        updatedProduct = await addProduct(client, productData);
      }

      if (updatedProduct) {
        setProducts((prevProducts) => {
          if (selectedProduct) {
            return prevProducts.map((p) =>
              p.id === updatedProduct.id ? updatedProduct : p
            );
          }
          return [...prevProducts, updatedProduct];
        });
        toast.success(
          selectedProduct
            ? "Product updated successfully"
            : "Product added successfully"
        );
        resetForm();
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product: Product) => {
    navigate(`/admin/products/${product.id}/edit`);
  };

  const handleDelete = (productId: string) => {
    setDeleteProductId(productId);
  };

  const confirmDelete = async () => {
    if (deleteProductId) {
      try {
        const client = await getClient();
        const success = await deleteProduct(client, deleteProductId);
        if (success) {
          setProducts((prevProducts) =>
            prevProducts.filter((p) => p.id !== deleteProductId)
          );
          setDeleteProductId(null);
          toast.success("Product deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
    setIsEditing(false);
    setActiveTab("products");
  };

  const handleImageUpload = (imageData: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      // If multiple is enabled, concatenate new images, otherwise replace
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

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await handleUpdateCategory();
    } else {
      await handleSaveCategory();
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            {t("backToHome")}
          </Button>
          <h1 className="text-3xl font-bold">{t("adminDashboard")}</h1>
        </div>

        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="products" className="flex-1 md:flex-none">
              {t("products")}
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex-1 md:flex-none">
              {t("categories")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>{t("manageProducts")}</CardTitle>
                    <CardDescription>
                      {t("manageProductsDescription")}
                    </CardDescription>
                  </div>
                  <Link to="/admin/products/new">
                    <Button className="w-full md:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t("addProduct")}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">{t("image")}</TableHead>
                        <TableHead>{t("name")}</TableHead>
                        <TableHead className="hidden md:table-cell">
                          {t("category")}
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          {t("price")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("status")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("actions")}
                        </TableHead>
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
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{product.name}</span>
                              <span className="text-sm text-muted-foreground md:hidden">
                                {product.category} • {product.price.toFixed(2)}{" "}
                                Dh
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {product.category}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {product.discountPrice ? (
                              <div className="flex flex-col">
                                <span>
                                  {product.discountPrice.toFixed(2)} Dh
                                </span>
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
                              variant={
                                product.inStock ? "default" : "destructive"
                              }
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
                                onClick={() =>
                                  navigate(`/admin/products/${product.id}/edit`)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDelete(product.id)}
                                  >
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
                                    <AlertDialogCancel>
                                      {t("cancel")}
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={confirmDelete}>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>{t("manageCategories")}</CardTitle>
                    <CardDescription>
                      {t("manageCategoriesDescription")}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCategoryName("");
                      setNewCategorySizes([]);
                    }}
                    className="w-full md:w-auto"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("addCategory")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Category Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {editingCategory ? t("editCategory") : t("addCategory")}
                      </CardTitle>
                      <CardDescription>
                        {editingCategory
                          ? t("editCategoryDescription")
                          : t("addCategoryDescription")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={handleCategorySubmit}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryName">
                              {t("categoryName")}
                            </Label>
                            <Input
                              id="categoryName"
                              value={newCategoryName}
                              onChange={(e) =>
                                setNewCategoryName(e.target.value)
                              }
                              placeholder={t("enterCategoryName")}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>{t("sizes")}</Label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Input
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                                placeholder={t("enterSize")}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddSize();
                                  }
                                }}
                                className="flex-1"
                              />
                              <Button
                                onClick={handleAddSize}
                                type="button"
                                className="w-full sm:w-auto"
                              >
                                {t("addSize")}
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-card">
                            {newCategorySizes.map((size) => (
                              <Badge
                                key={size}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {size}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                  onClick={() => handleRemoveSize(size)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>

                          <div className="flex justify-end gap-2">
                            {editingCategory && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setEditingCategory(null);
                                  setNewCategoryName("");
                                  setNewCategorySizes([]);
                                }}
                              >
                                {t("cancel")}
                              </Button>
                            )}
                            <Button type="submit" className="gap-2">
                              <Save className="h-4 w-4" />
                              {editingCategory
                                ? t("saveChanges")
                                : t("addCategory")}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Categories List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <Card key={category.name}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {category.name}
                              </CardTitle>
                              <CardDescription>
                                {t("sizes")}: {category.sizes.length}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setEditingCategory(category);
                                  setNewCategoryName(category.name);
                                  setNewCategorySizes(category.sizes);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteCategory(category.name)
                                    }
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {t("deleteCategory")}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t("deleteCategoryConfirmation")}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      {t("cancel")}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteCategory(category.name)
                                      }
                                    >
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
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
