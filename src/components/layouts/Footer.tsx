import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-accent/10 dark:bg-accent/5 py-10 px-4 border-t border-border">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">
              {t("siteTitle")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("equipmentDescription")}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/share/1BVx2hDXaC/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">
              {t("exploreProducts")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products?category=boots"
                  className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block"
                >
                  {t("boots")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=jackets"
                  className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block"
                >
                  {t("jackets")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=accessories"
                  className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block"
                >
                  {t("accessories")}
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block"
                >
                  {t("allProducts")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">
              {t("aboutUs")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block"
                >
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block"
                >
                  {t("shipping")}
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block"
                >
                  {t("returns")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">
              {t("contactUs")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse hover:translate-x-1 transition-transform">
                <Mail size={18} className="text-primary" />
                <a
                  href="mailto:nidal.benalla3@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  nidal.benalla3@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse hover:translate-x-1 transition-transform">
                <Phone size={18} className="text-primary" />
                <a
                  href="https://wa.me/+212617828917"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  +212.6.17.82.89.17
                </a>
              </div>
              <div>
                <a
                  href="https://www.google.com/maps?ll=33.864917,-5.548397&z=15&t=m&hl=fr&gl=MA&mapclient=embed&cid=13595266919245187657"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <p className="text-primary hover:underline inline-flex items-center transition-all hover:translate-x-1">
                    {t("findUs")}
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-border/30 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Nidal Boots. {t("allRights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
