import React from "react";
import { ArrowUpCircle } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { cn } from "@/lib/utils";

const BackToTopButton = () => {
  const { showBackToTop, scrollToTop } = useScrollToTop();

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50 p-2 rounded-full bg-primary text-primary-foreground shadow-lg",
        "transition-all duration-300 ease-in-out transform",
        showBackToTop
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-75 pointer-events-none"
      )}
      aria-label="Back to top"
    >
      <ArrowUpCircle className="h-6 w-6" />
    </button>
  );
};

export default BackToTopButton;
