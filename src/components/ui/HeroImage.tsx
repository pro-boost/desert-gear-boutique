import React, { useState } from "react";

const HeroImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <div
        className="absolute inset-0 bg-muted animate-pulse"
        style={{ opacity: isLoaded ? 0 : 1 }}
      />
      <img
        src="/images/main/soldier-8499582_1280.webp"
        alt="Desert Gear Boutique"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        fetchPriority="high"
        loading="eager"
        onLoad={() => setIsLoaded(true)}
        style={{
          animation: "scaleIn 1.5s ease-out forwards",
        }}
      />
      <style>
        {`
          @keyframes scaleIn {
            from { transform: scale(1.1); }
            to { transform: scale(1); }
          }
        `}
      </style>
    </>
  );
};

export default HeroImage;
