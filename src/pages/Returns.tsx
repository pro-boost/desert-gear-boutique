import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RotateCcw, ShieldCheck, MessageCircle } from "lucide-react";

const Returns = () => {
  const { t } = useLanguage();

  return (
    <div className="container min-h-screen mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-8">{t("returns")}</h1>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <div className="card-section p-6">
            <RotateCcw className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("daysGuarantee")}</h3>
            <p className="text-muted-foreground">{t("forReturning")}</p>
          </div>

          <div className="card-section p-6">
            <ShieldCheck className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("warranty")}</h3>
            <p className="text-muted-foreground">{t("yearWarranty")}</p>
          </div>

          <div className="card-section p-6">
            <MessageCircle className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t("support")}</h3>
            <p className="text-muted-foreground">{t("dedicatedSupport")}</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-heading font-semibold mb-4">
            {t("returnPolicy")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("returnPolicyDescription")}
          </p>

          <h2 className="text-2xl font-heading font-semibold mb-4">
            {t("howToReturn")}
          </h2>
          <ol className="list-decimal pl-6 space-y-4 text-muted-foreground mb-6">
            <li>{t("contactCustomerService")}</li>
            <li>{t("packageCarefully")}</li>
            <li>{t("useReturnLabel")}</li>
            <li>{t("dropOffPackage")}</li>
          </ol>

          <h2 className="text-2xl font-heading font-semibold mb-4">
            {t("refunds")}
          </h2>
          <p className="text-muted-foreground mb-6">{t("refundDescription")}</p>
        </div>
      </div>
    </div>
  );
};

export default Returns;
