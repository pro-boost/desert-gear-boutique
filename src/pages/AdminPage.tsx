
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  getCategories,
  addCategory,
} from '@/services/productService';
import { Product, PRODUCT_CATEGORIES } from '@/types/product';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  X
} from 'lucide-react';
import ImageDropzone from '@/components/ImageDropzone';

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
}

// Initial form data
const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  category: 'boots',
  images: ['/placeholder.svg'],
  inStock: true,
  featured: false,
};

const AdminPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  
  useEffect(() => {
    // Redirect if not admin
    if (!user?.isAdmin) {
      navigate('/login');
      toast.error("You need admin privileges to access this page.");
      return;
    }
    
    // Load products and categories
    setProducts(getProducts());
    setCategories(getCategories());
  }, [user, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'discountPrice'
        ? parseFloat(value || '0')
        : value
    }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitCategory = () => {
    if (newCategory.trim() !== '') {
      const success = addCategory(newCategory.trim().toLowerCase());
      if (success) {
        toast.success(`Category "${newCategory}" added successfully`);
        setCategories(getCategories());
        setNewCategory('');
        setCategoryDialogOpen(false);
      } else {
        toast.error(`Category "${newCategory}" already exists`);
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && formData.id) {
        // Update existing product
        const updatedProduct = updateProduct({
          ...(formData as Product),
          createdAt: products.find(p => p.id === formData.id)?.createdAt || Date.now(),
        });
        
        setProducts(prev => 
          prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
        
        toast.success(`${formData.name} updated successfully`);
      } else {
        // Add new product
        const newProduct = addProduct(formData);
        
        setProducts(prev => [...prev, newProduct]);
        
        toast.success(`${formData.name} added successfully`);
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      toast.error("Error saving product");
      console.error(error);
    }
  };
  
  const handleEdit = (product: Product) => {
    setFormData({
      ...product,
    });
    setIsEditing(true);
    setActiveTab("add-product");
  };
  
  const handleDelete = (productId: string) => {
    setDeleteProductId(productId);
  };
  
  const confirmDelete = () => {
    if (deleteProductId) {
      deleteProduct(deleteProductId);
      setProducts(prev => prev.filter(p => p.id !== deleteProductId));
      setDeleteProductId(null);
      toast.success("Product deleted successfully");
    }
  };
  
  const resetForm = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setActiveTab("products");
  };

  const handleImageUpload = (imageData: string) => {
    setFormData(prev => ({
      ...prev,
      images: [imageData]
    }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      images: ['/placeholder.svg']
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-8">
            {t('admin')}
          </h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">{t('manageProducts')}</TabsTrigger>
              <TabsTrigger value="add-product">
                {isEditing ? t('editProduct') : t('addProduct')}
              </TabsTrigger>
            </TabsList>
            
            {/* Products List */}
            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{t('products')}</CardTitle>
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
                                src={product.images[0] || '/placeholder.svg'} 
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
                              <span className={`px-2 py-1 rounded text-xs ${
                                product.inStock 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {product.inStock ? t('inStock') : t('outOfStock')}
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
                  <Button onClick={() => {
                    setActiveTab("add-product");
                    setIsEditing(false);
                    setFormData(initialFormData);
                  }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('addProduct')}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Add/Edit Product Form */}
            <TabsContent value="add-product">
              <Card>
                <CardHeader>
                  <CardTitle>{isEditing ? t('editProduct') : t('addProduct')}</CardTitle>
                  <CardDescription>
                    {isEditing 
                      ? "Make changes to the existing product information."
                      : "Fill out the form below to add a new product."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} id="product-form" className="space-y-4">
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
                        {t('category')}
                      </label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {t(category)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Description */}
                    <div className="space-y-1">
                      <label htmlFor="description" className="text-sm font-medium">
                        {t('description')}
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
                          {t('price')}
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
                            <span className="text-sm text-muted-foreground">Dh</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Discount Price */}
                      <div className="space-y-1">
                        <label htmlFor="discountPrice" className="text-sm font-medium">
                          {t('discount')} {t('price')} (Optional)
                        </label>
                        <div className="relative">
                          <Input
                            id="discountPrice"
                            name="discountPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.discountPrice || ''}
                            onChange={handleInputChange}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-sm text-muted-foreground">Dh</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Image Upload */}
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        Product Image
                      </label>
                      <ImageDropzone
                        onImageUpload={handleImageUpload}
                        currentImage={formData.images[0]}
                        onImageRemove={handleImageRemove}
                      />
                    </div>
                    
                    {/* Status Checkboxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inStock"
                          checked={formData.inStock}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('inStock', !!checked)
                          }
                        />
                        <label htmlFor="inStock" className="text-sm font-medium cursor-pointer">
                          {t('inStock')}
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="featured"
                          checked={formData.featured || false}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange('featured', !!checked)
                          }
                        />
                        <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                          {t('featured')}
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
                        {t('cancel')}
                      </>
                    ) : (
                      t('cancel')
                    )}
                  </Button>
                  <Button type="submit" form="product-form">
                    {isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('saveChanges')}
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('addProduct')}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
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
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCategory} disabled={!newCategory.trim()}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
