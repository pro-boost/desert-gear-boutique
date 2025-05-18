import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutUs = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-8">{t("aboutUs")}</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="mb-12">
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
              alt={t("aboutUs")}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
            />

            <p className="text-lg text-muted-foreground mb-6">
              {t("equipmentDescription")}
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-semibold">
                  {t("mission")}
                </h3>
                <p className="text-muted-foreground">
                  {t("missionDescription")}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-semibold">
                  {t("vision")}
                </h3>
                <p className="text-muted-foreground">
                  {t("visionDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
