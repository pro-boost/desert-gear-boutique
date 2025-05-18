import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import MapComponent from "@/components/MapComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const ContactPage = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success(t("messageSentSuccess"));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-8">
          {t("contactUs")}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  {t("yourName")}
                </label>
                <Input id="name" type="text" required />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  {t("yourEmail")}
                </label>
                <Input id="email" type="email" required />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-1"
                >
                  {t("messageSubject")}
                </label>
                <Input id="subject" type="text" required />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  {t("message")}
                </label>
                <Textarea
                  id="message"
                  placeholder={t("typeYourMessage")}
                  required
                  className="min-h-[150px]"
                />
              </div>

              <Button type="submit" className="w-full">
                {t("sendMessage")}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-4">{t("findUs")}</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <p className="text-muted-foreground">{t("adress")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a
                    href="tel:+212612345678"
                    className="text-muted-foreground hover:text-primary"
                  >
                    +212 612-345-678
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a
                    href="mailto:contact@strikegear.com"
                    className="text-muted-foreground hover:text-primary"
                  >
                    contact@strikegear.com
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-card">
              <h2 className="text-xl font-semibold mb-4">{t("followUs")}</h2>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook size={24} />
                </a>
              </div>
            </div>

            <div className="h-[300px] rounded-lg overflow-hidden">
              <MapComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
