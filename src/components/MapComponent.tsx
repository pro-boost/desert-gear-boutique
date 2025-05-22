import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { lazy, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import {
  addPassiveEventListener,
  removeEventListener,
} from "@/utils/eventListeners";

// Lazy load the actual map component
const MapIframe = lazy(() => import("@/components/MapIframe"));

const MapComponent: React.FC = () => {
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add passive event listeners for touch and wheel events
    const handleTouchStart = (e: TouchEvent) => {
      // Handle touch start if needed
    };

    const handleWheel = (e: WheelEvent) => {
      // Handle wheel events if needed
    };

    addPassiveEventListener(container, "touchstart", handleTouchStart);
    addPassiveEventListener(container, "wheel", handleWheel);

    return () => {
      removeEventListener(container, "touchstart", handleTouchStart);
      removeEventListener(container, "wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden"
    >
      <div ref={containerRef} className="w-full h-full">
        {inView ? (
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
                <div className="text-muted-foreground">{t("loading")}</div>
              </div>
            }
          >
            <MapIframe />
          </Suspense>
        ) : (
          <div className="w-full h-full bg-muted animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default MapComponent;
