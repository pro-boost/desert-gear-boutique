import React from "react";
import { cn } from "@/lib/utils";
import { GRID_GAP_CLASSES, GRID_COLS_CLASSES } from "@/lib/constants";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  cols?: keyof typeof GRID_COLS_CLASSES;
  gap?: keyof typeof GRID_GAP_CLASSES;
}

export function Grid({
  children,
  className,
  cols = 1,
  gap = "md",
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        GRID_COLS_CLASSES[cols],
        GRID_GAP_CLASSES[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
