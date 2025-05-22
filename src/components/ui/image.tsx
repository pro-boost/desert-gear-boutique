import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  className?: string;
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      fallbackSrc = "/images/placeholder.svg",
      className,
      onError,
      ...props
    },
    ref
  ) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
      }
      setIsLoading(false);
      onError?.(e);
    };

    const handleLoad = () => {
      setIsLoading(false);
    };

    return (
      <div className={cn("relative", className)}>
        <img
          ref={ref}
          src={imgSrc}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onError={handleError}
          onLoad={handleLoad}
          {...props}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
      </div>
    );
  }
);

Image.displayName = "Image";

export { Image };
