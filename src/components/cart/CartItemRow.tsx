import React from "react";
import { Link } from "react-router-dom";
import { useCart, CartItem } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus } from "lucide-react";

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const { t } = useLanguage();

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
      <div className="col-span-12 sm:col-span-5 flex items-start gap-3">
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
                className="font-medium hover:text-primary text-sm block mb-1 break-words"
              >
                {item.product.name}
              </Link>
              {item.selectedSize && (
                <div className="text-sm text-muted-foreground">
                  {t("size")} {item.selectedSize}
                </div>
              )}
            </div>
          </div>
          {/* Mobile Price and Controls */}
          <div className="sm:hidden mt-2 space-y-2">
            <div className="text-sm font-medium">{Math.round(price)} Dh</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center border border-border rounded-md bg-background">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-muted"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus size={12} />
                </Button>
                <span className="w-6 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-muted"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                >
                  <Plus size={12} />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="text-muted-foreground hover:text-destructive h-7 w-7"
              >
                <Trash size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Price - 2 columns */}
      <div className="hidden sm:block sm:col-span-2 text-right">
        <div className="font-medium whitespace-nowrap">
          {Math.round(price)} Dh
        </div>
      </div>

      {/* Quantity Controls - 3 columns */}
      <div className="hidden sm:flex sm:col-span-3 items-center justify-center">
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

      {/* Desktop Total and Delete Button - 2 columns */}
      <div className="hidden sm:flex sm:col-span-2 items-center justify-end gap-2">
        <div className="font-semibold whitespace-nowrap min-w-[80px] text-right">
          {Math.round(totalPrice)} Dh
        </div>
        <div className="w-8 flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive h-8 w-8"
            title={t("remove")}
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>

      {/* Mobile Total */}
      <div className="col-span-12 sm:hidden flex justify-between items-center mt-2 pt-2 border-t border-border/50">
        <div className="text-sm font-semibold">
          {t("total")}: {Math.round(totalPrice)} Dh
        </div>
      </div>
    </div>
  );
};
