import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import ImageViewer from "@/components/ui/image-viewer";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  return (
    <div className="card-product rounded-xl overflow-hidden p-4">
      <div className="relative">
        {/* Main Image Slider */}
        <div
          className="aspect-square w-full overflow-hidden relative cursor-zoom-in"
          onClick={() => setIsImageViewerOpen(true)}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeImage * 100}%)` }}
          >
            {images.map((imgSrc, index) => (
              <Image
                key={index}
                src={imgSrc}
                alt={`${productName} image ${index + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
                loading={index === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  );
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/50 text-foreground p-2 rounded-full hover:bg-background/70 transition-colors z-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/50 text-foreground p-2 rounded-full hover:bg-background/70 transition-colors z-10"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="mt-4 overflow-x-auto">
            <div className="flex space-x-3 pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(index);
                  }}
                  className={`
                    w-16 h-16 border rounded-lg overflow-hidden transition-all flex-shrink-0 cursor-pointer
                    ${
                      activeImage === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }
                  `}
                >
                  <Image
                    src={img}
                    alt={`${productName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ImageViewer
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        images={images}
        initialIndex={activeImage}
      />
    </div>
  );
};

export default ProductGallery;
