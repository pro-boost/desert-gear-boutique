import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useUser, SignInButton } from "@clerk/clerk-react";
import {
  getProductById,
  getProductsByCategory,
} from "@/services/productService";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (id) {
      const foundProduct = getProductById(id);

      if (foundProduct) {
        setProduct(foundProduct);
        // Only set the selected size if the product has sizes
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        } else {
          setSelectedSize("");
        }

        // Get related products from the same category
        const related = getProductsByCategory(foundProduct.category)
          .filter((p) => p.id !== id)
          .slice(0, 4);

        setRelatedProducts(related);
      }

      setLoading(false);
    }
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!product) return;

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCart = () => {
    if (!isSignedIn) {
      toast.error(t("loginRequired"));
      return;
    }

    if (product && product.inStock && selectedSize) {
      addToCart(product, 1, selectedSize);
    }
  };

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="animate-pulse">{t("loading")}</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("productNotFound")}</h1>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToProducts")}
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  // Ensure product.sizes is always an array, even if undefined
  const productSizes = product.sizes || [];
  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const favorited = isFavorite(product.id);

  return (
    <main className="flex-grow py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("continueShop")}
            </Link>
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="border border-border rounded-lg overflow-hidden aspect-square">
              <img
                src={product.images[activeImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`
                      w-20 h-20 border rounded-md overflow-hidden
                      ${
                        activeImage === index
                          ? "border-primary"
                          : "border-border"
                      }
                    `}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-4">
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

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                {t("size")}
              </label>
              <Select
                value={selectedSize}
                onValueChange={setSelectedSize}
                disabled={!product.inStock || productSizes.length === 0}
              >
                <SelectTrigger className="w-full max-w-[200px]">
                  <SelectValue
                    placeholder={
                      productSizes.length
                        ? t("selectSize")
                        : t("noSizesAvailable")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {productSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <Badge variant={product.inStock ? "outline" : "destructive"}>
                {product.inStock ? t("inStock") : t("outOfStock")}
              </Badge>
            </div>

            {/* Description */}
            <div className="prose mb-8">
              <h3 className="text-lg font-medium mb-2">{t("description")}</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {isSignedIn ? (
                <Button
                  className="flex-1"
                  disabled={!product.inStock || !selectedSize}
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {product.inStock
                    ? !selectedSize
                      ? t("selectSizeFirst")
                      : t("addToCart")
                    : t("outOfStock")}
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button className="flex-1">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {t("loginToAddToCart")}
                  </Button>
                </SignInButton>
              )}

              <Button
                variant="outline"
                className="w-12"
                onClick={handleFavoriteToggle}
              >
                <Heart
                  className={favorited ? "fill-tactical text-tactical" : ""}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-heading font-bold mb-6">
              {t("relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
