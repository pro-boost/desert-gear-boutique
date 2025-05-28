import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useUser } from "@clerk/clerk-react";
import { useSupabase } from "@/hooks/useSupabase";
import {
  getProductById,
  getProductsByCategory,
} from "@/services/productService";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ArrowLeft,
  ShoppingCart,
  ArrowRight,
  Loader2,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import ImageViewer from "@/components/ui/image-viewer";

interface CartItem {
  size: string;
  quantity: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { isSignedIn } = useUser();
  const { getClient } = useSupabase();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProductAndRelated = async () => {
      if (!id) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        if (mounted) setLoading(true);
        const client = await getClient();

        // Get the main product
        const foundProduct = await getProductById(client, id);
        if (!foundProduct) {
          if (mounted) {
            toast.error("Product not found");
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setProduct(foundProduct);
          setSelectedSizes([]);
        }

        // Get related products
        const related = await getProductsByCategory(
          client,
          foundProduct.category
        );
        if (mounted) {
          if (Array.isArray(related)) {
            setRelatedProducts(related.filter((p) => p.id !== id).slice(0, 4));
          } else {
            console.error("Related products is not an array:", related);
            setRelatedProducts([]);
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
        if (mounted) {
          toast.error("Failed to load product");
          setProduct(null);
          setRelatedProducts([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Execute the async function
    const loadData = () => {
      loadProductAndRelated().catch((error) => {
        console.error("Error in loadProductAndRelated:", error);
        if (mounted) {
          toast.error("Failed to load product");
          setLoading(false);
        }
      });
    };

    loadData();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [id, getClient]);

  const handleFavoriteToggle = () => {
    if (!product) return;
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input temporarily
    if (value === "") {
      setQuantity(0);
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      // Ensure value is between 1 and 5
      const newQuantity = Math.min(5, Math.max(1, numValue));
      const oldQuantity = quantity;

      setQuantity(newQuantity);

      // Preserve existing size selections when changing quantity
      setSelectedSizes((prev) => {
        if (newQuantity > oldQuantity) {
          // Add empty strings for new items
          return [...prev, ...Array(newQuantity - oldQuantity).fill("")];
        } else {
          // Remove items from the end
          return prev.slice(0, newQuantity);
        }
      });

      // Show toast if max limit is reached
      if (numValue > 5) {
        toast.info(t("maxQuantityReached"));
      }
    }
  };

  // Add a blur handler to ensure value is within limits
  const handleQuantityBlur = () => {
    if (quantity < 1) {
      setQuantity(1);
    } else if (quantity > 5) {
      setQuantity(5);
      toast.info(t("maxQuantityReached"));
    }
  };

  // Add increment/decrement handlers
  const handleIncrement = () => {
    if (quantity < 5) {
      setQuantity((prev) => {
        const newQuantity = prev + 1;
        setSelectedSizes((prevSizes) => [...prevSizes, ""]);
        return newQuantity;
      });
    } else {
      toast.info(t("maxQuantityReached"));
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => {
        const newQuantity = prev - 1;
        setSelectedSizes((prevSizes) => prevSizes.slice(0, newQuantity));
        return newQuantity;
      });
    }
  };

  const handleSizeChange = (index: number, size: string) => {
    setSelectedSizes((prev) => {
      const newSizes = [...prev];
      newSizes[index] = size;
      return newSizes;
    });
  };

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;

    // Check if any sizes are selected
    if (selectedSizes.length === 0) {
      toast.error(t("selectSizeFirst"));
      return;
    }

    // Add each selected size to cart
    selectedSizes.forEach((size) => {
      addToCart(product, 1, size);
    });

    // Reset the form
    setSelectedSizes([]);
    toast.success(t("addedToCart"));
  };

  const handleBuyNow = () => {
    if (!product || !product.inStock) return;

    // Check if any sizes are selected
    if (selectedSizes.length === 0) {
      toast.error(t("selectSizeFirst"));
      return;
    }

    // Add each selected size to cart
    selectedSizes.forEach((size) => {
      addToCart(product, 1, size);
    });

    // Navigate to cart
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
        </div>
      </div>
    );
  }

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;

  return (
    <main className="flex-grow py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Button asChild variant="outline" size="sm">
              <Link to="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("continueShop")}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="card-product rounded-xl overflow-hidden p-4">
              <div className="relative">
                {/* Main Image Slider */}
                <div
                  className="aspect-square w-full overflow-hidden relative cursor-zoom-in"
                  onClick={() => setIsImageViewerOpen(true)}
                >
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${activeImage * 100}%)` }}
                  >
                    {product.images.map((imgSrc, index) => (
                      <Image
                        key={index}
                        src={imgSrc}
                        alt={`${product.name} image ${index + 1}`}
                        className="w-full h-full object-cover flex-shrink-0"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImage((prev) =>
                            prev === 0 ? product.images.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/50 text-foreground p-2 rounded-full hover:bg-background/70 transition-colors z-10"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImage((prev) =>
                            prev === product.images.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/50 text-foreground p-2 rounded-full hover:bg-background/70 transition-colors z-10"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery (Horizontal) */}
                {product.images.length > 1 && (
                  <div className="mt-4 overflow-x-auto">
                    <div className="flex space-x-3 pb-2">
                      {product.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImage(index);
                          }}
                          className={`
                            w-16 h-16 border rounded-lg overflow-hidden transition-all flex-shrink-0 cursor-pointer
                            ${
                              activeImage === index
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-border hover:border-primary/50"
                            }
                          `}
                        >
                          <Image
                            src={img}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="card-section rounded-xl p-8 shadow-lg">
              <div className="space-y-8">
                {/* Product Title and Price */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">
                    {product.name}
                  </h1>
                  <div className="flex flex-wrap justify-between items-end gap-2 sm:gap-4 mb-4 sm:mb-6">
                    {hasDiscount ? (
                      <>
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                          {product.discountPrice?.toFixed(2)} Dh
                        </span>
                        <span className="text-base sm:text-lg text-muted-foreground line-through">
                          {product.price.toFixed(2)} Dh
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-tactical text-tactical-foreground text-xs sm:text-sm"
                        >
                          -
                          {Math.round(
                            (1 - product.discountPrice! / product.price) * 100
                          )}
                          %
                        </Badge>
                      </>
                    ) : (
                      <span className="text-xl sm:text-2xl font-bold">
                        {product.price.toFixed(2)} Dh
                      </span>
                    )}
                  </div>
                  <div className="mb-4 sm:mb-6">
                    <Badge
                      variant={product.inStock ? "outline" : "destructive"}
                      className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-tactical text-tactical-foreground"
                    >
                      {product.inStock ? t("inStock") : t("outOfStock")}
                    </Badge>
                  </div>
                </div>

                {/* Size Selection */}
                {product.inStock &&
                  product.sizes &&
                  product.sizes.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">
                        {t("selectSizes")}
                      </h4>
                      <div className="card-section p-3 bg-muted/50">
                        <div className="flex flex-wrap gap-3">
                          {product.sizes.map((size) => (
                            <div
                              key={size}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`size-${size}`}
                                checked={selectedSizes.includes(size)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSizes([...selectedSizes, size]);
                                  } else {
                                    setSelectedSizes(
                                      selectedSizes.filter((s) => s !== size)
                                    );
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`size-${size}`}
                                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                              >
                                {size}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      {selectedSizes.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {t("selectedSizes")}: {selectedSizes.join(", ")}
                        </p>
                      )}
                    </div>
                  )}

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t("description")}</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button
                    className="flex-1 min-w-[120px] sm:min-w-[200px] py-6 text-lg whitespace-normal break-words"
                    disabled={!product?.inStock || selectedSizes.length === 0}
                    onClick={handleBuyNow}
                  >
                    <ArrowRight className="mr-2 h-5 w-5 flex-shrink-0" />
                    {t("buyNow")}
                  </Button>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-1 sm:w-14 h-14"
                      disabled={!product?.inStock || selectedSizes.length === 0}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-1 sm:w-14 h-14"
                      onClick={handleFavoriteToggle}
                    >
                      <Heart
                        className={`h-6 w-6 ${
                          isFavorite(product?.id)
                            ? "fill-tactical text-tactical"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="bg-card rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-8 text-center sm:text-left">
                {t("relatedProducts")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((related) => (
                  <ProductCard key={related.id} product={related} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add ImageViewer component */}
      <ImageViewer
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        images={product.images}
        initialIndex={activeImage}
      />
    </main>
  );
};

export default ProductDetail;
