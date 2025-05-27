import React from "react";
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "none" | "sm" | "md" | "lg";
}

export function Grid({
  children,
  className,
  cols = 1,
  gap = "md",
  ...props
}: GridProps) {
  const gapClasses = {
    none: "gap-0",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  const colsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6",
  };

  return (
    <div
      className={cn("grid", colsClasses[cols], gapClasses[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
}
