import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const MapComponent: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div
      className="w-full h-[400px] rounded-lg overflow-hidden card-base 
           dark:shadow-[0_4px_20px_rgba(255,138,76,0.12)]
           dark:hover:shadow-[0_4px_20px_rgba(255,138,76,0.2)]
           dark:bg-gradient-to-br dark:from-background/95 dark:via-primary/10 dark:to-background/95;"
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.864917!2d-5.548397!3d33.864917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b8f5c2c2c2c%3A0x0!2zMzPCsDUxJzUzLjciTiA1wrAzMic1NC4yIlc!5e0!3m2!1sen!2sma!4v1620000000000!5m2!1sen!2sma"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={t("storeLocation")}
        aria-label={t("storeLocation")}
      />
    </div>
  );
};

export default MapComponent;
