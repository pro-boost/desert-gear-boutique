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
          setSelectedSizes(Array(foundProduct.sizes?.length || 0).fill(""));
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
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      const oldQuantity = quantity;
      const newQuantity = value;

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

    // Check if all items have a size selected
    const hasAllSizesSelected = selectedSizes
      .slice(0, quantity)
      .every((size) => size !== "");
    if (!hasAllSizesSelected) {
      toast.error(t("selectSizeForAllItems"));
      return;
    }

    // Add each item to cart with its selected size
    selectedSizes.slice(0, quantity).forEach((size) => {
      addToCart(product, 1, size);
    });

    // Reset the form
    setQuantity(1);
    setSelectedSizes([]);
    toast.success(t("addedToCart"));
  };

  const handleBuyNow = () => {
    if (!product || !product.inStock) return;

    // Check if all items have a size selected
    const hasAllSizesSelected = selectedSizes
      .slice(0, quantity)
      .every((size) => size !== "");
    if (!hasAllSizesSelected) {
      toast.error(t("selectSizeForAllItems"));
      return;
    }

    // Add each item to cart with its selected size
    selectedSizes.slice(0, quantity).forEach((size) => {
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
            <div className="bg-card rounded-xl overflow-hidden shadow-lg p-4">
              <div className="relative">
                {/* Main Image Slider */}
                <div className="aspect-square w-full overflow-hidden relative">
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
                        onClick={() =>
                          setActiveImage((prev) =>
                            prev === 0 ? product.images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/50 text-foreground p-2 rounded-full hover:bg-background/70 transition-colors z-10"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImage((prev) =>
                            prev === product.images.length - 1 ? 0 : prev + 1
                          )
                        }
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
                      {/* No need for dummy images here, just map actual images */}
                      {product.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`
                            w-16 h-16 border rounded-lg overflow-hidden transition-all flex-shrink-0
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
            <div className="bg-card rounded-xl p-8 shadow-lg">
              <div className="space-y-8">
                {/* Product Title and Price */}
                <div>
                  <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
                  <div className="flex items-center space-x-4 mb-6">
                    {hasDiscount ? (
                      <>
                        <span className="text-2xl font-bold">
                          {product.discountPrice?.toFixed(2)} Dh
                        </span>
                        <span className="text-muted-foreground line-through">
                          {product.price.toFixed(2)} Dh
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-tactical-light text-white"
                        >
                          -
                          {Math.round(
                            (1 - product.discountPrice! / product.price) * 100
                          )}
                          %
                        </Badge>
                      </>
                    ) : (
                      <span className="text-2xl font-bold">
                        {product.price.toFixed(2)} Dh
                      </span>
                    )}
                  </div>
                  <div className="mb-6">
                    <Badge
                      variant={product.inStock ? "outline" : "destructive"}
                      className="text-sm px-3 py-1"
                    >
                      {product.inStock ? t("inStock") : t("outOfStock")}
                    </Badge>
                  </div>
                </div>

                {/* Size Selection */}
                {product.inStock && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">{t("selectSizes")}</h4>
                    <div className="grid gap-3">
                      {Array.from({ length: quantity }).map((_, index) => (
                        <div
                          key={index}
                          className={`
                            relative flex items-center gap-4 p-4 rounded-lg border
                            ${
                              selectedSizes[index]
                                ? "border-primary/50 bg-primary/5"
                                : "border-border"
                            }
                            transition-colors duration-200
                          `}
                        >
                          {/* Item Number Badge */}
                          <div className="absolute -left-2 -top-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                              {index + 1}
                            </div>
                          </div>

                          {/* Size Selection */}
                          <div className="flex-1">
                            <Select
                              value={selectedSizes[index] || ""}
                              onValueChange={(value) =>
                                handleSizeChange(index, value)
                              }
                              disabled={
                                !product.inStock || !product.sizes?.length
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={
                                    product.sizes?.length
                                      ? t("selectSize")
                                      : t("noSizesAvailable")
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {product.sizes?.map((size) => (
                                  <SelectItem key={size} value={size}>
                                    {size}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Selected Size Badge */}
                          {selectedSizes[index] && (
                            <Badge variant="secondary" className="ml-2">
                              {selectedSizes[index]}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                {product.inStock && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t("quantity")}
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-32"
                      disabled={!product.inStock}
                    />
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t("description")}</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    className="flex-1 py-6 text-lg"
                    disabled={
                      !product?.inStock ||
                      quantity === 0 ||
                      selectedSizes
                        .slice(0, quantity)
                        .some((size) => size === "")
                    }
                    onClick={handleBuyNow}
                  >
                    <ArrowRight className="mr-2 h-5 w-5" />
                    {t("buyNow")}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-14 h-14"
                    disabled={
                      !product?.inStock ||
                      quantity === 0 ||
                      selectedSizes
                        .slice(0, quantity)
                        .some((size) => size === "")
                    }
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-14 h-14"
                    onClick={handleFavoriteToggle}
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isFavorite(product.id)
                          ? "fill-tactical text-tactical"
                          : ""
                      }`}
                    />
                  </Button>
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
    </main>
  );
};

export default ProductDetail;
