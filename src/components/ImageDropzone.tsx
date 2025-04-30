import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";

interface ImageDropzoneProps {
  onImageUpload: (image: string) => void;
  currentImage?: string;
  onImageRemove?: () => void;
}

const ImageDropzone = ({
  onImageUpload,
  currentImage,
  onImageRemove,
}: ImageDropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageUpload(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
  });

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
        {currentImage ? (
          <div className="relative inline-block">
            <img
              src={currentImage}
              alt="Product preview"
              className="max-w-[200px] max-h-[200px] object-contain mx-auto rounded-md"
            />
            {onImageRemove && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageRemove();
                }}
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
                ? "Drop the image here"
                : "Drag & drop your product image here or click to select"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDropzone;
