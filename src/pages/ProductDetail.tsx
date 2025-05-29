import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/hooks/useFavorites";
import { useSupabase } from "@/hooks/useSupabase";
import {
  getProductById,
  getProductsByCategory,
} from "@/services/productService";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Import new components
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import SizeSelection from "@/components/product/SizeSelection";
import ProductActions from "@/components/product/ProductActions";
import RelatedProducts from "@/components/product/RelatedProducts";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { getClient } = useSupabase();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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

    loadProductAndRelated();

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

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;

    if (selectedSizes.length === 0) {
      toast.error(t("selectSizeFirst"));
      return;
    }

    selectedSizes.forEach((size) => {
      addToCart(product, 1, size);
    });

    setSelectedSizes([]);
    toast.success(t("addedToCart"));
  };

  const handleBuyNow = () => {
    if (!product || !product.inStock) return;

    if (selectedSizes.length === 0) {
      toast.error(t("selectSizeFirst"));
      return;
    }

    selectedSizes.forEach((size) => {
      addToCart(product, 1, size);
    });

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
            {/* Product Gallery */}
            <ProductGallery
              images={product.images}
              productName={product.name}
            />

            {/* Product Info Section */}
            <div className="card-section rounded-xl p-8 shadow-lg">
              <ProductInfo product={product} />

              {/* Size Selection */}
              {product.inStock && product.sizes && (
                <SizeSelection
                  sizes={product.sizes}
                  selectedSizes={selectedSizes}
                  onSizeChange={setSelectedSizes}
                />
              )}

              {/* Action Buttons */}
              <ProductActions
                product={product}
                selectedSizes={selectedSizes}
                isFavorite={isFavorite(product.id)}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAddToCart}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </div>
          </div>

          {/* Related Products */}
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
