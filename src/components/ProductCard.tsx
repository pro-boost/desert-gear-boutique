
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.inStock) {
      addItem(product);
    }
  };

  const favorited = isFavorite(product.id);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <Card className="overflow-hidden card-hover h-full flex flex-col">
      <Link to={`/products/${product.id}`} className="h-full flex flex-col">
        <div className="relative h-60 overflow-hidden">
          {/* Image */}
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {!product.inStock && (
              <Badge variant="destructive">
                {t('outOfStock')}
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="secondary" className="bg-tactical-light text-white">
                -{Math.round((1 - product.discountPrice! / product.price) * 100)}%
              </Badge>
            )}
            {product.featured && (
              <Badge>{t('featured')}</Badge>
            )}
          </div>
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm hover:bg-background/70"
            onClick={handleFavoriteToggle}
          >
            <Heart 
              size={18} 
              className={favorited ? 'fill-tactical text-tactical' : ''} 
            />
          </Button>
        </div>
        
        <CardContent className="pt-4 flex-grow">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center mt-auto">
            {hasDiscount ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="font-bold">{product.discountPrice?.toFixed(2)} Dh</span>
                <span className="text-muted-foreground line-through text-sm">{product.price.toFixed(2)} Dh</span>
              </div>
            ) : (
              <span className="font-bold">{product.price.toFixed(2)} Dh</span>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pb-4 pt-0">
          <Button 
            variant={product.inStock ? "default" : "outline"}
            className={product.inStock ? "w-full bg-primary" : "w-full"} 
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {product.inStock ? t('addToCart') : t('outOfStock')}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
