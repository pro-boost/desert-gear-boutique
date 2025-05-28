import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import MapComponent from "@/components/map/MapComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (phone: string) => {
    // Remove any non-digit characters
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setPhoneError(t("phoneNumberTooShort"));
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    if (id === "phone") {
      // Only allow digits, spaces, and common phone number separators
      const sanitizedValue = value.replace(/[^\d\s\-+()]/g, "");
      setFormData((prev) => ({
        ...prev,
        [id]: sanitizedValue,
      }));
      validatePhone(sanitizedValue);
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      toast.error(t("phoneNumberTooShort"));
      return;
    }

    // Create WhatsApp message
    const whatsappMessage = `New Contact Form Submission:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\nMessage: ${formData.message}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/212661880323?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank");

    toast.success(t("messageSentSuccess"));
  };

  const isRTL = t("direction") === "rtl";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-heading font-bold mb-12 text-center">
          {t("contactUs")}
        </h1>
        <p className="text-lg text-muted-foreground text-center mb-12">
          {t("contactDescription")}
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card-section p-8 hover:shadow-card-hover transition-all duration-300">
            <h2
              className={`text-2xl font-semibold mb-6 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("sendMessage")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    {t("yourName")}
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("enterFullName")}
                    className="w-full"
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    {t("yourEmail")}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full"
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">
                  {t("yourPhone")}
                </label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("enterPhone")}
                  className={`w-full ${phoneError ? "border-destructive" : ""}`}
                  dir={isRTL ? "rtl" : "ltr"}
                  minLength={10}
                  pattern="[0-9\s\-+()]{10,}"
                  title={t("phoneNumberFormat")}
                />
                {phoneError && (
                  <p className="text-sm text-destructive mt-1">{phoneError}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">
                  {t("messageSubject")}
                </label>
                <Input
                  id="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t("enterSubject")}
                  className="w-full"
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  {t("message")}
                </label>
                <Textarea
                  id="message"
                  placeholder={t("enterMessage")}
                  required
                  className="min-h-[150px] resize-none"
                  value={formData.message}
                  onChange={handleChange}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>

              <Button type="submit" className="w-full py-6 text-lg">
                {t("sendMessage")}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card-section p-8">
              <h2
                className={`text-2xl font-semibold mb-6 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("findUs")}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <a
                    href="https://www.google.com/maps?ll=33.864917,-5.548397&z=16&t=m&hl=fr&gl=MA&mapclient=embed&cid=13595266919245187657"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("adress")}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0" />
                  <a
                    href="tel:+212617828917"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    +212 617-828-917
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0" />
                  <a
                    href="mailto:nidal.benalla3@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    nidal.benalla3@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="card-section">
              <MapComponent />
            </div>

            <div className="card-section p-8">
              <h2
                className={`text-2xl font-semibold mb-6 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {t("followUs")}
              </h2>
              <div className="flex gap-6 justify-center">
                <a
                  href="https://www.instagram.com/mag.ben.arm?utm_source=qr&igsh=bGI3dnJhZzhxeTNz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors p-3 rounded-full hover:bg-primary/10"
                >
                  <Instagram size={28} />
                </a>
                <a
                  href="https://www.facebook.com/share/1BVx2hDXaC/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors p-3 rounded-full hover:bg-primary/10"
                >
                  <Facebook size={28} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
