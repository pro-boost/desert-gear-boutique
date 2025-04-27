
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart, CartItem } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  ShoppingBag, 
  Trash, 
  Plus, 
  Minus, 
  ArrowLeft,
  ShoppingBasket
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  
  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.product.id, newQuantity);
  };
  
  const handleRemove = () => {
    removeItem(item.product.id);
  };
  
  const price = item.product.discountPrice || item.product.price;
  const totalPrice = price * item.quantity;
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-border">
      {/* Product Image */}
      <Link to={`/products/${item.product.id}`} className="w-20 h-20 rounded overflow-hidden mr-4 mb-3 sm:mb-0 flex-shrink-0">
        <img 
          src={item.product.images[0] || '/placeholder.svg'} 
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </Link>
      
      {/* Product Info */}
      <div className="flex-grow mr-4">
        <Link to={`/products/${item.product.id}`} className="font-medium hover:text-primary">
          {item.product.name}
        </Link>
      </div>
      
      {/* Price */}
      <div className="text-right mr-4 min-w-[80px]">
        {price.toFixed(2)} Dh
      </div>
      
      {/* Quantity */}
      <div className="flex items-center border border-border rounded-md mr-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus size={14} />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          <Plus size={14} />
        </Button>
      </div>
      
      {/* Total */}
      <div className="font-semibold mr-4 min-w-[80px] text-right">
        {totalPrice.toFixed(2)} Dh
      </div>
      
      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash size={18} />
      </Button>
    </div>
  );
};

const CartPage = () => {
  const { t } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();
  
  const handleCheckout = () => {
    toast.success("Checkout functionality would be implemented here");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-8">
            {t('cart')}
          </h1>
          
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  <div className="p-4 border-b border-border bg-muted">
                    <h2 className="font-semibold">{items.length} {items.length === 1 ? 'item' : 'items'}</h2>
                  </div>
                  
                  <div className="p-4">
                    {/* Headers on larger screens */}
                    <div className="hidden sm:flex text-sm text-muted-foreground mb-2">
                      <div className="flex-grow ml-24">Product</div>
                      <div className="min-w-[80px] text-right mr-4">Price</div>
                      <div className="min-w-[96px] text-center mr-4">Quantity</div>
                      <div className="min-w-[80px] text-right mr-4">Total</div>
                      <div className="w-9"></div>
                    </div>
                    
                    {/* Cart Items */}
                    <div className="space-y-1">
                      {items.map(item => (
                        <CartItemRow key={item.product.id} item={item} />
                      ))}
                    </div>
                    
                    {/* Actions */}
                    <div className="mt-6 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearCart}
                      >
                        Clear Cart
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/products">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          {t('continueShop')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border overflow-hidden sticky top-24">
                  <div className="p-4 border-b border-border bg-muted">
                    <h2 className="font-semibold">{t('total')}</h2>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">{totalPrice.toFixed(2)} Dh</span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span>Free</span>
                    </div>
                    
                    <div className="flex justify-between py-2 text-lg font-semibold">
                      <span>Total:</span>
                      <span>{totalPrice.toFixed(2)} Dh</span>
                    </div>
                    
                    <Button className="w-full" onClick={handleCheckout}>
                      {t('checkout')}
                    </Button>
                    
                    {/* Secure checkout message */}
                    <div className="text-center text-sm text-muted-foreground mt-4">
                      <p>Secure checkout powered by Stripe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 max-w-md mx-auto">
              <ShoppingBasket size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-medium mb-2">{t('emptyCart')}</h2>
              <p className="text-muted-foreground mb-6">
                You haven't added any products to your cart yet.
              </p>
              <Button asChild>
                <Link to="/products">{t('shopNow')}</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;
