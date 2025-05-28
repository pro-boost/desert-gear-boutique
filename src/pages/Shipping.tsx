import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Truck, PackageCheck, Clock } from "lucide-react";

const Shipping = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-8">
          {t("shipping")}
        </h1>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 mb-12">
          <div className="card-section p-6">
            <Truck className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {t("standardDelivery")}
            </h3>
            <p className="text-muted-foreground">2-3 {t("businessDays")}</p>
            <p className="text-muted-foreground">{t("freeForOrders")}</p>
          </div>

          <div className="card-section p-6">
            <PackageCheck className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("orderTracking")}</h3>
            <p className="text-muted-foreground">{t("realTimeTracking")}</p>
            <p className="text-muted-foreground">{t("emailNotifications")}</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-heading font-semibold mb-4">
            {t("deliveryZones")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("deliveryZonesDescription")}
          </p>

          <h2 className="text-2xl font-heading font-semibold mb-4">
            {t("importantToKnow")}
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>{t("ordersProcessed")}</li>
            <li>{t("confirmationEmail")}</li>
            <li>{t("differentAddress")}</li>
            <li>{t("customerSupport")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
