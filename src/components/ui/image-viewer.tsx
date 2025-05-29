import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

// Button component
const Button = ({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    icon: "h-10 w-10",
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

// cn utility function
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

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

  // Reset states when image changes or modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentIndex(initialIndex);
      resetZoom();
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialIndex]);

  // Reset zoom when image changes
  useEffect(() => {
    resetZoom();
  }, [currentIndex]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Calculate zoom boundaries
  const getZoomBounds = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return { maxX: 0, maxY: 0 };

    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();

    const scaledWidth = imageRect.width * scale;
    const scaledHeight = imageRect.height * scale;

    const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2);
    const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2);

    return { maxX, maxY };
  }, [scale]);

  // Constrain position within bounds
  const constrainPosition = useCallback(
    (x: number, y: number) => {
      const { maxX, maxY } = getZoomBounds();
      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      };
    },
    [getZoomBounds]
  );

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

  const handleZoomIn = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (scale >= 3) return;

      const newScale = Math.min(3, scale + 0.5);
      setScale(newScale);

      // Calculate zoom center
      if (e && imageRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();

        // Get click position relative to the image
        const clickX = e.clientX - imageRect.left;
        const clickY = e.clientY - imageRect.top;

        // Calculate the center of the image
        const imageCenterX = imageRect.width / 2;
        const imageCenterY = imageRect.height / 2;

        // Calculate offset from center
        const offsetX = clickX - imageCenterX;
        const offsetY = clickY - imageCenterY;

        // Calculate new position to zoom into the clicked point
        const scaleRatio = newScale / scale;
        const newX = position.x - offsetX * (scaleRatio - 1);
        const newY = position.y - offsetY * (scaleRatio - 1);

        setPosition(constrainPosition(newX, newY));
      }
    },
    [scale, position, constrainPosition]
  );

  const handleZoomOut = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (scale <= 1) return;

      const newScale = Math.max(1, scale - 0.5);
      setScale(newScale);

      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      } else {
        // Adjust position proportionally when zooming out
        const scaleRatio = newScale / scale;
        const newX = position.x * scaleRatio;
        const newY = position.y * scaleRatio;
        setPosition(constrainPosition(newX, newY));
      }
    },
    [scale, position, constrainPosition]
  );

  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (scale === 1) {
        handleZoomIn(e);
      } else {
        resetZoom();
      }
    },
    [scale, handleZoomIn, resetZoom]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.deltaY < 0) {
        handleZoomIn(e);
      } else {
        handleZoomOut(e);
      }
    },
    [handleZoomIn, handleZoomOut]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale <= 1) return;

      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [scale, position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || scale <= 1) return;

      e.preventDefault();
      e.stopPropagation();

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      setPosition(constrainPosition(newX, newY));
    },
    [isDragging, scale, dragStart, constrainPosition]
  );

  const handleMouseUp = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (isTransitioning) return;

      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [isTransitioning, images.length]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (isTransitioning) return;

      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [isTransitioning, images.length]
  );

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  // Handle touch events for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (scale <= 1 || e.touches.length > 1) return;

      e.preventDefault();
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    },
    [scale, position]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || scale <= 1 || e.touches.length > 1) return;

      e.preventDefault();
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;

      setPosition(constrainPosition(newX, newY));
    },
    [isDragging, scale, dragStart, constrainPosition]
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

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
        <span className="text-white px-2 flex items-center min-w-[60px] justify-center">
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[101] text-white hover:bg-white/10"
            onClick={handlePrev}
            disabled={isTransitioning}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[101] text-white hover:bg-white/10"
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: "none" }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`Product image ${currentIndex + 1}`}
            className={cn(
              "max-w-full max-h-full object-contain select-none transition-opacity duration-300",
              isDragging
                ? "cursor-grabbing"
                : scale > 1
                ? "cursor-grab"
                : "cursor-zoom-in",
              !isTransitioning && "opacity-100"
            )}
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${
                position.y / scale
              }px)`,
              transformOrigin: "center center",
              transition: isTransitioning
                ? "opacity 300ms ease-in-out"
                : "none",
            }}
            onClick={handleImageClick}
            onLoad={() => {
              // Reset zoom when new image loads
              if (scale !== 1 || position.x !== 0 || position.y !== 0) {
                resetZoom();
              }
            }}
            draggable={false}
          />
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
