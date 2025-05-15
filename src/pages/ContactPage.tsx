import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-8 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-8">
            {t("contactUs")}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border bg-muted">
                <h2 className="font-semibold">{t("sendMessageCta")}</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {t("name")}
                    </label>
                    <Input id="name" placeholder={t("yourName")} required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {t("email")}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("yourEmail")}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    {t("subject")}
                  </label>
                  <Input
                    id="subject"
                    placeholder={t("messageSubject")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t("message")}
                  </label>
                  <Textarea
                    id="message"
                    placeholder={t("typeYourMessage")}
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {t("sendMessage")}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Map */}
              <MapComponent />

              {/* Contact Details */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-muted">
                  <h2 className="font-semibold">{t("contactUs")}</h2>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <Mail className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">{t("email")}</h3>
                      <a
                        href="mailto:nidal.benalla3@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        nidal.benalla3@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <Phone className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">{t("phone")}</h3>
                      <a
                        href="https://wa.me/+212617828917"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        +212.6.17.82.89.17
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <MapPin className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">{t("address")}</h3>
                      <a
                        href="https://www.google.com/maps?ll=33.864917,-5.548397&z=15&t=m&hl=fr&gl=MA&mapclient=embed&cid=13595266919245187657"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p className="text-muted-foreground">{t("adress")}</p>
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="font-medium mb-3">{t("findUsOn")}</h3>
                    <div className="flex space-x-4 rtl:space-x-reverse">
                      <a
                        href="https://www.instagram.com/mag.ben.arm?utm_source=qr&igsh=bGI3dnJhZzhxeTNz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-muted hover:bg-muted/80 text-foreground p-2 rounded-full"
                      >
                        <Instagram size={20} />
                      </a>
                      <a
                        href="https://www.facebook.com/share/1BVx2hDXaC/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-muted hover:bg-muted/80 text-foreground p-2 rounded-full"
                      >
                        <Facebook size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
