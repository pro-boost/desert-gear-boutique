import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";

interface ImageDropzoneProps {
  onImageUpload: (image: string) => void;
  currentImage?: string;
  onImageRemove?: () => void;
  multiple?: boolean;
}

interface MultiImageDropzoneProps
  extends Omit<
    ImageDropzoneProps,
    "onImageUpload" | "currentImage" | "onImageRemove"
  > {
  onImageUpload: (images: string[]) => void;
  currentImages?: string[];
  onImageRemove?: (index: number) => void;
  multiple: true;
}

type CombinedImageDropzoneProps = ImageDropzoneProps | MultiImageDropzoneProps;

const ImageDropzone = (props: CombinedImageDropzoneProps) => {
  const { onImageUpload, onImageRemove, multiple = false } = props;
  const currentImage = "currentImage" in props ? props.currentImage : undefined;
  const currentImages =
    "currentImages" in props ? props.currentImages : undefined;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        const imageUrls: string[] = [];
        acceptedFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            imageUrls.push(reader.result as string);
            if (imageUrls.length === acceptedFiles.length) {
              (onImageUpload as (images: string[]) => void)(imageUrls);
            }
          };
          reader.readAsDataURL(file);
        });
      } else {
        const file = acceptedFiles[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            (onImageUpload as (image: string) => void)(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [onImageUpload, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: multiple ? 5 : 1,
    multiple,
  });

  const handleRemoveButtonClick = (e: React.MouseEvent, index?: number) => {
    e.stopPropagation(); // Prevent triggering parent click events
    if (onImageRemove) {
      if (multiple && index !== undefined) {
        (onImageRemove as (index: number) => void)(index);
      } else if (!multiple && index === undefined) {
        (onImageRemove as () => void)();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        {multiple && currentImages && currentImages.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {currentImages.map((imgSrc, index) => (
              <div key={index} className="relative inline-block">
                <img
                  src={imgSrc}
                  alt={`Product preview ${index + 1}`}
                  className="max-w-[100px] max-h-[100px] object-contain mx-auto rounded-md"
                />
                {onImageRemove && multiple && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-5 w-5"
                    onClick={(e) => handleRemoveButtonClick(e, index)}
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : currentImage && !multiple ? (
          <div className="relative inline-block">
            <img
              src={currentImage}
              alt="Product preview"
              className="max-w-[200px] max-h-[200px] object-contain mx-auto rounded-md"
            />
            {onImageRemove && !multiple && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2"
                onClick={handleRemoveButtonClick}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? "Drop the image(s) here"
                : multiple
                ? "Drag & drop your product images here or click to select (max 5)"
                : "Drag & drop your product image here or click to select"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDropzone;
