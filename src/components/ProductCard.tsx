
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Target } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, delay = 0 }) => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);
  
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
    <Card 
      className={`group card-animated card-shimmer overflow-hidden h-full flex flex-col border-2 animate-cardPop`}
      style={{ animationDelay: `${delay * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="h-full flex flex-col">
        <div className="relative h-[280px] overflow-hidden bg-muted">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2'}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {!product.inStock && (
              <Badge variant="destructive" className="animate-pulse">
                {t('outOfStock')}
              </Badge>
            )}
            {product.discountPrice && product.discountPrice < product.price && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                -{Math.round((1 - product.discountPrice / product.price) * 100)}%
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-secondary text-secondary-foreground">
                <Target className="w-3 h-3 mr-1" />
                {t('featured')}
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0 scale-110' : 'opacity-70 -translate-y-1'
            }`}
            onClick={handleFavoriteToggle}
          >
            <Heart 
              size={18} 
              className={`transition-colors ${favorited ? 'fill-destructive text-destructive' : ''}`}
            />
          </Button>
          
          {/* Highlight effect on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-50' : 'opacity-0'
          }`}></div>
        </div>
        
        <CardContent className="flex-grow p-4">
          <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-1 transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-baseline gap-2">
            {product.discountPrice && product.discountPrice < product.price ? (
              <>
                <span className="font-bold text-lg transition-colors group-hover:text-primary">
                  {product.discountPrice.toFixed(2)} Dh
                </span>
                <span className="text-muted-foreground line-through text-sm">
                  {product.price.toFixed(2)} Dh
                </span>
              </>
            ) : (
              <span className="font-bold text-lg transition-colors group-hover:text-primary">
                {product.price.toFixed(2)} Dh
              </span>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            variant={product.inStock ? "default" : "outline"}
            className={`w-full transition-all duration-500 ${
              isHovered && product.inStock ? "bg-primary shadow-lg shadow-primary/20" : "bg-primary"
            } ${
              product.inStock ? "" : ""
            }`}
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingBag className={`mr-2 h-4 w-4 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
            {product.inStock ? t('addToCart') : t('outOfStock')}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
