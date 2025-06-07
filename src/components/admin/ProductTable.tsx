import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Edit, Trash, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSupabase } from "@/hooks/useSupabase";
import { updateProductPositions } from "@/services/productService";
import { toast } from "@/components/ui/sonner";

interface ProductTableProps {
  products: Product[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (productIds: string[]) => void;
  isLoading?: boolean;
}

// Sortable table row component
const SortableTableRow = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { t } = useLanguage();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-[50px] p-2">
        <button
          {...attributes}
          {...listeners}
          className="p-2 hover:bg-muted rounded-md cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-12 h-12 object-contain rounded"
        />
      </TableCell>
      <TableCell className="font-medium max-w-[200px] truncate">
        {product.name}
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        {product.categoryId}
      </TableCell>
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
        <Badge
          variant={product.inStock ? "default" : "destructive"}
          className="whitespace-nowrap"
        >
          {product.inStock ? t("inStock") : t("outOfStock")}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(product.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deleteProduct")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteProductConfirmation")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(product.id)}>
                  {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};

// Sortable card component for mobile view
const SortableProductCard = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { t } = useLanguage();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Card ref={setNodeRef} style={style} className="w-full">
      <CardHeader className="">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="p-2 hover:bg-muted rounded-md cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-3/4 h-auto md:w-20 rounded-lg md:h-20 md:self-start object-contain self-center"
            />
          </div>
          <div className="flex-1 min-w-0 p-4">
            <CardTitle className="text-lg break-words">
              {product.name}
            </CardTitle>
            <CardDescription className="mt-1 break-words">
              {t("category")}: {product.categoryId}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center md:justify-between gap-2">
          <div className="flex flex-wrap justify-between items-baseline gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-semibold whitespace-nowrap">
                  {product.discountPrice.toFixed(2)} Dh
                </span>
                <span className="text-sm text-muted-foreground line-through whitespace-nowrap">
                  {product.price.toFixed(2)} Dh
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold whitespace-nowrap">
                {product.price.toFixed(2)} Dh
              </span>
            )}
          </div>
          <Badge
            variant={product.inStock ? "default" : "destructive"}
            className="whitespace-nowrap self-start sm:self-center"
          >
            {product.inStock ? t("inStock") : t("outOfStock")}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product.id)}
            className="flex-1 p-1 min-w-[120px]"
          >
            <Edit className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">{t("edit")}</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 p-1 min-w-[120px]"
              >
                <Trash className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">{t("delete")}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deleteProduct")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deleteProductConfirmation")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(product.id)}>
                  {t("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onReorder = () => {},
  isLoading,
}) => {
  const { t } = useLanguage();
  const { getClient } = useSupabase();
  const [items, setItems] = useState(products);
  const [isUpdating, setIsUpdating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update positions in database
        const updates = newItems.map((item, index) => ({
          id: item.id,
          position: index + 1,
        }));

        // Optimistically update UI
        setIsUpdating(true);
        getClient().then(async (client) => {
          const success = await updateProductPositions(client, updates);
          if (!success) {
            // Revert on failure
            setItems(items);
            toast.error(t("failedToUpdateOrder"));
          } else {
            toast.success(t("orderUpdated"));
            onReorder(newItems.map((item) => item.id));
          }
          setIsUpdating(false);
        });

        return newItems;
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((product) => (
              <SortableProductCard
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[80px]">{t("image")}</TableHead>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("price")}</TableHead>
                <TableHead className="text-center">{t("status")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((product) => (
                  <SortableTableRow
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
