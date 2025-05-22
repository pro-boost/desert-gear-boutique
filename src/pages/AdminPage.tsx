import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { checkAndSetAdminStatus } from "@/integrations/supabase/auth";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  addCategory,
  resetProducts,
} from "@/services/productService";
import {
  Product,
  ProductFilters,
  PRODUCT_CATEGORIES,
  SAMPLE_PRODUCTS,
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
} from "lucide-react";
import ImageDropzone from "@/components/ImageDropzone";
import { useSupabase } from "@/hooks/useSupabase";
import { useAdmin } from "@/hooks/useAdmin";

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
  images: ["/placeholder.svg"],
  inStock: true,
  featured: false,
  sizes: [],
};

// Add type for available sizes
type AvailableSizes = {
  [key: string]: string[];
};

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
    images: ["/placeholder.svg"],
    inStock: true,
    featured: false,
    sizes: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

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
        setProducts(productsData);
        setCategories(getCategories());
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getClient, isAdmin]);

  useEffect(() => {
    const category = formData.category || "boots";
    const sizes = (PRODUCT_SIZES as Record<string, string[]>)[category] || [];
    setAvailableSizes(sizes);
    setSelectedSizes([]);
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
    setSelectedSizes((prev) => {
      if (checked) {
        return [...prev, size];
      }
      return prev.filter((s) => s !== size);
    });

    // Update formData.sizes based on selectedSizes
    setFormData((prev) => ({
      ...prev,
      sizes: selectedSizes,
    }));
  };

  const handleSubmitCategory = () => {
    if (newCategory.trim() !== "") {
      const success = addCategory(newCategory.trim().toLowerCase());
      if (success) {
        toast.success(`Category "${newCategory}" added successfully`);
        setCategories(getCategories());
        setNewCategory("");
        setCategoryDialogOpen(false);
      } else {
        toast.error(`Category "${newCategory}" already exists`);
      }
    }
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
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      category: product.category,
      images: product.images,
      inStock: product.inStock,
      featured: product.featured,
    });
    setSelectedSizes(product.sizes);
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
      images: ["/placeholder.svg"],
      inStock: true,
      featured: false,
      sizes: [],
    });
    setIsEditing(false);
    setSelectedSizes([]);
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

  const handleResetProducts = async () => {
    try {
      const client = await getClient();
      // Delete all existing products
      for (const product of products) {
        await deleteProduct(client, product.id);
      }

      // Add sample products
      const newProducts: Product[] = [];
      for (const product of SAMPLE_PRODUCTS) {
        const addedProduct = await addProduct(client, product);
        if (addedProduct) {
          newProducts.push(addedProduct);
        }
      }

      setProducts(newProducts);
      toast.success("Products reset successfully");
    } catch (error) {
      console.error("Error resetting products:", error);
      toast.error("Failed to reset products");
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
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-heading font-bold">{t("admin")}</h1>
            <Button
              variant="destructive"
              onClick={handleResetProducts}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t("resetProducts")}
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">{t("manageProducts")}</TabsTrigger>
              <TabsTrigger value="add-product">
                {isEditing ? t("editProduct") : t("addProduct")}
              </TabsTrigger>
            </TabsList>

            {/* Products List */}
            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{t("products")}</CardTitle>
                      <CardDescription>
                        Manage your product inventory, prices, and availability.
                      </CardDescription>
                    </div>
                    <Button onClick={() => setCategoryDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <img
                                src={product.images[0] || "/placeholder.svg"}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>
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
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  product.inStock
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                {product.inStock
                                  ? t("inStock")
                                  : t("outOfStock")}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEdit(product)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDelete(product.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => {
                      setActiveTab("add-product");
                      setIsEditing(false);
                      setFormData(initialFormData);
                      setSelectedSizes([]); // Reset selected sizes
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("addProduct")}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Add/Edit Product Form */}
            <TabsContent value="add-product">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isEditing ? t("editProduct") : t("addProduct")}
                  </CardTitle>
                  <CardDescription>
                    {isEditing
                      ? "Make changes to the existing product information."
                      : "Fill out the form below to add a new product."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSubmit}
                    id="product-form"
                    className="space-y-4"
                  >
                    {/* Product Name */}
                    <div className="space-y-1">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                      <label htmlFor="category" className="text-sm font-medium">
                        {t("category")}
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleSelectChange("category", value)
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {t(category)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        {t("description")}
                      </label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        required
                      />
                    </div>

                    {/* Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="price" className="text-sm font-medium">
                          {t("price")}
                        </label>
                        <div className="relative">
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-sm text-muted-foreground">
                              Dh
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Discount Price */}
                      <div className="space-y-1">
                        <label
                          htmlFor="discountPrice"
                          className="text-sm font-medium"
                        >
                          {t("discount")} {t("price")} (Optional)
                        </label>
                        <div className="relative">
                          <Input
                            id="discountPrice"
                            name="discountPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.discountPrice || ""}
                            onChange={handleInputChange}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-sm text-muted-foreground">
                              Dh
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sizes */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Available Sizes
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                        {availableSizes.map((size) => (
                          <div
                            key={size}
                            className="flex items-center space-x-2 border rounded-md p-2"
                          >
                            <Checkbox
                              id={`size-${size}`}
                              checked={selectedSizes.includes(size)}
                              onCheckedChange={(checked) =>
                                handleSizeChange(size, !!checked)
                              }
                            />
                            <label
                              htmlFor={`size-${size}`}
                              className="text-sm cursor-pointer flex-1"
                            >
                              {size}
                            </label>
                          </div>
                        ))}
                      </div>
                      {availableSizes.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No sizes available for this category
                        </p>
                      )}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        Product Image
                      </label>
                      <ImageDropzone
                        onImageUpload={handleImageUpload}
                        currentImages={formData.images}
                        onImageRemove={handleImageRemove}
                        multiple={true}
                      />
                    </div>

                    {/* Status Checkboxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inStock"
                          checked={formData.inStock}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("inStock", !!checked)
                          }
                        />
                        <label
                          htmlFor="inStock"
                          className="text-sm font-medium cursor-pointer"
                        >
                          {t("inStock")}
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={formData.featured || false}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("featured", !!checked)
                          }
                        />
                        <label
                          htmlFor="featured"
                          className="text-sm font-medium cursor-pointer"
                        >
                          {t("featured")}
                        </label>
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={resetForm}>
                    {isEditing ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        {t("cancel")}
                      </>
                    ) : (
                      t("cancel")
                    )}
                  </Button>
                  <Button type="submit" form="product-form">
                    {isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t("saveChanges")}
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t("addProduct")}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteProductId}
        onOpenChange={() => setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Enter a name for the new product category.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="newCategory" className="text-sm font-medium">
                Category Name
              </label>
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCategory}
              disabled={!newCategory.trim()}
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
