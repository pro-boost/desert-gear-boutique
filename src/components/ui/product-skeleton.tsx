import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductSkeleton = () => {
  return (
    <Card className="group relative overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Image skeleton */}
        <div className="relative aspect-square">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Content skeleton */}
        <CardContent className="p-4 space-y-3">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4" />

          {/* Price skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>

          {/* Size selector skeleton */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-12" />
            ))}
          </div>
        </CardContent>

        {/* Footer skeleton */}
        <CardFooter className="p-4 pt-0">
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </div>
    </Card>
  );
};

export const ProductSkeletonGrid = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};
