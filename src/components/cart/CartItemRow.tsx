import React from "react";
import { Link } from "react-router-dom";
import { useCart, CartItem } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus } from "lucide-react";

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.product.id, newQuantity, item.selectedSize);
  };

  const handleRemove = () => {
    removeItem(item.product.id, item.selectedSize);
  };

  const price = item.product.discountPrice || item.product.price;
  const totalPrice = price * item.quantity;

  return (
    <div className="grid grid-cols-12 gap-4 items-start sm:items-center py-4 border-b border-border">
      {/* Product Image and Info - 5 columns on desktop */}
      <div className="col-span-8 sm:col-span-5 flex items-start gap-3">
        <Link
          to={`/products/${item.product.id}`}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm"
        >
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-grow min-w-0">
              <Link
                to={`/products/${item.product.id}`}
                className="font-medium hover:text-primary text-sm block mb-1 truncate"
              >
                {item.product.name}
              </Link>
              {item.selectedSize && (
                <div className="text-sm text-muted-foreground">
                  Size: {item.selectedSize}
                </div>
              )}
            </div>
            {/* Mobile Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="text-muted-foreground hover:text-destructive sm:hidden -mt-1 -mr-2"
            >
              <Trash size={16} />
            </Button>
          </div>
          {/* Mobile Price */}
          <div className="sm:hidden mt-2">
            <div className="text-sm font-medium">{price.toFixed(2)} Dh</div>
          </div>
        </div>
      </div>

      {/* Desktop Price - 2 columns */}
      <div className="hidden sm:block sm:col-span-2 text-right">
        <div className="font-medium">{price.toFixed(2)} Dh</div>
      </div>

      {/* Quantity Controls - 3 columns */}
      <div className="col-span-4 sm:col-span-3 flex items-center justify-end sm:justify-center">
        <div className="flex items-center border border-border rounded-md bg-background">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus size={14} />
          </Button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted"
            onClick={() => handleQuantityChange(item.quantity + 1)}
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>

      {/* Desktop Total - 2 columns */}
      <div className="hidden sm:block sm:col-span-2 text-right">
        <div className="font-semibold">{totalPrice.toFixed(2)} Dh</div>
      </div>

      {/* Desktop Delete Button */}
      <div className="hidden sm:block sm:col-span-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="text-muted-foreground hover:text-destructive mx-auto"
        >
          <Trash size={18} />
        </Button>
      </div>

      {/* Mobile Total */}
      <div className="col-span-12 sm:hidden flex justify-between items-center mt-2 pt-2 border-t border-border/50">
        <div className="text-sm font-semibold">
          Total: {totalPrice.toFixed(2)} Dh
        </div>
      </div>
    </div>
  );
};
