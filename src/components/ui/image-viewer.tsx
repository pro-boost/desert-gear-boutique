import React, { useState, useEffect, useRef } from "react";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialIndex]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (scale < 3) {
      const newScale = scale + 0.5;
      setScale(newScale);

      // Calculate zoom center based on click position or image center
      if (e && imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        setPosition({
          x: position.x - ((x - centerX) * (newScale - scale)) / scale,
          y: position.y - ((y - centerY) * (newScale - scale)) / scale,
        });
      }
    }
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (scale > 1) {
      const newScale = scale - 0.5;
      setScale(newScale);

      // Reset position when zooming out to 1x
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      } else if (e && imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        setPosition({
          x: position.x - ((x - centerX) * (newScale - scale)) / scale,
          y: position.y - ((y - centerY) * (newScale - scale)) / scale,
        });
      }
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale === 1) {
      handleZoomIn(e);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn(e);
    } else {
      handleZoomOut(e);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      if (containerRef.current && imageRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();
        const maxX = (imageRect.width * scale - rect.width) / 2;
        const maxY = (imageRect.height * scale - rect.height) / 2;

        setPosition({
          x: Math.max(-maxX, Math.min(maxX, newX)),
          y: Math.max(-maxY, Math.min(maxY, newY)),
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-[101] text-white hover:bg-white/10"
        onClick={handleClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Zoom controls */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[101] flex gap-2 bg-black/50 p-2 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={handleZoomOut}
          disabled={scale <= 1}
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        <span className="text-white px-2 flex items-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
          onClick={handleZoomIn}
          disabled={scale >= 3}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 z-[101] text-white hover:bg-white/10"
            onClick={handlePrev}
            disabled={isTransitioning}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 z-[101] text-white hover:bg-white/10"
            onClick={handleNext}
            disabled={isTransitioning}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Image container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {images.map((src, index) => (
            <img
              key={src}
              ref={index === currentIndex ? imageRef : null}
              src={src}
              alt={`Product image ${index + 1}`}
              className={cn(
                "absolute max-w-full max-h-full object-contain transition-all duration-300",
                isDragging
                  ? "cursor-grabbing"
                  : scale > 1
                  ? "cursor-grab"
                  : "cursor-zoom-in",
                index === currentIndex ? "opacity-100" : "opacity-0",
                isTransitioning && "transition-transform duration-300"
              )}
              style={{
                transform:
                  index === currentIndex
                    ? `scale(${scale}) translate(${position.x}px, ${position.y}px)`
                    : "scale(1) translate(0, 0)",
                touchAction: "none",
              }}
              onClick={handleImageClick}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 right-4 z-[101] text-white bg-black/50 px-3 py-1 rounded-full text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
