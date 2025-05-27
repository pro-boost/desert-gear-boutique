import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Section({
  children,
  className,
  as: Component = "section",
  ...props
}: SectionProps) {
  return (
    <Component className={cn("py-12 md:py-16 lg:py-20", className)} {...props}>
      {children}
    </Component>
  );
}
