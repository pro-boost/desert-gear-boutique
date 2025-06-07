import React, { useState, useCallback, useRef, useMemo } from "react";
import { Upload, X, GripVertical } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/sonner";

interface ImageFile {
  id: string;
  src: string;
  name: string;
  size: number;
}

interface ImageDropzoneProps {
  onImagesChange?: (images: ImageFile[]) => void;
  initialImages?: ImageFile[];
  maxImages?: number;
  maxSizeMB?: number;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onImagesChange = () => {},
  initialImages = [],
  maxImages = 5,
  maxSizeMB = 5,
}) => {
  const { t } = useLanguage();
  const [images, setImages] = useState<ImageFile[]>(initialImages);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize validateFile to prevent unnecessary recreations
  const validateFile = useCallback(
    (file: File): boolean => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024;

      if (!isValidType) {
        toast.error(`${file.name}: ${t("invalidImageFormat")}`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name}: ${t("imageTooLarge")}`);
        return false;
      }
      return true;
    },
    [maxSizeMB, t]
  );

  // Process files with validateFile in dependencies
  const processFiles = useCallback(
    async (files: FileList) => {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(validateFile);

      if (validFiles.length === 0) return;

      // Check if adding these files would exceed the maximum limit
      if (images.length + validFiles.length > maxImages) {
        toast.error(t("maxImagesReached"));
        return;
      }

      try {
        const processedImages = await Promise.all(
          validFiles.map((file) => {
            return new Promise<ImageFile>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target?.result && typeof e.target.result === "string") {
                  resolve({
                    id: `${Date.now()}-${Math.random()}`,
                    src: e.target.result,
                    name: file.name,
                    size: file.size,
                  });
                } else {
                  reject(new Error("Failed to read file"));
                }
              };
              reader.onerror = () => reject(new Error("Error reading file"));
              reader.readAsDataURL(file);
            });
          })
        );

        const newImages = [...images, ...processedImages].slice(0, maxImages);
        setImages(newImages);
        onImagesChange(newImages);
      } catch (error) {
        console.error("Error processing files:", error);
        toast.error(t("errorUploadingImage"));
      }
    },
    [images, onImagesChange, maxImages, t, validateFile]
  );

  // Handle drag and drop for file upload
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  // Handle click to select files
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  // Remove image
  const removeImage = (id: string) => {
    const newImages = images.filter((img) => img.id !== id);
    setImages(newImages);
    onImagesChange(newImages);
  };

  // Handle drag start for reordering
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  // Handle drag over for reordering
  const handleImageDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(index);
  };

  // Handle drop for reordering
  const handleImageDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];

    // Remove dragged item
    newImages.splice(draggedIndex, 1);
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);

    setImages(newImages);
    onImagesChange(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary hover:bg-muted/5"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />

        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            {isDragOver ? t("dropImagesHereMultiple") : t("dragDropImages")}
          </p>
          <p className="text-sm text-muted-foreground">{t("dragDropImage")}</p>
          <p className="text-xs text-muted-foreground">
            {t("maxImagesReached").replace("5", maxImages.toString())}
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-w-3xl ">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDrop={(e) => handleImageDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                relative group bg-background rounded-lg border-2 transition-all duration-200 cursor-move
                max-w-[200px] mx-auto w-full
                ${draggedIndex === index ? "opacity-50 scale-95" : ""}
                ${
                  dragOverIndex === index && draggedIndex !== index
                    ? "border-primary scale-105"
                    : "border-muted-foreground/25"
                }
                hover:border-primary hover:shadow-md
              `}
            >
              {/* Drag Handle */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <div className="bg-background/80 rounded p-0.5">
                  <GripVertical className="h-3 w-3 text-foreground" />
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(image.id);
                }}
                className="absolute top-1 right-1 opacity-100 transition-opacity duration-200 z-10"
              >
                <div className="bg-destructive hover:bg-destructive/90 rounded-full p-0.5 transition-colors duration-200">
                  <X className="h-3 w-3 text-destructive-foreground" />
                </div>
              </button>

              {/* Image */}
              <div className="aspect-square p-1">
                <img
                  src={image.src}
                  alt={image.name}
                  className="w-full h-full object-contain rounded-md"
                  draggable={false}
                />
              </div>

              {/* Image Info */}
              <div className="p-1 border-t border-muted flex flex-col items-center justify-center">
                <p
                  className="text-[10px] text-muted-foreground truncate"
                  title={image.name}
                >
                  {image.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {(image.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {images.length} {t("images")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
