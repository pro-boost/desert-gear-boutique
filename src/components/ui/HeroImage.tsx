import React from "react";

const HeroImage = () => {
  return (
    <>
      <img
        src="/images/main/soldier-8499582_1280.webp"
        alt="Desert Gear Boutique"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        loading="eager"
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
