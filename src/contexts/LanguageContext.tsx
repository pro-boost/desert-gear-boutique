import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "fr" | "ar";

type Translations = {
  [key: string]: {
    fr: string;
    ar: string;
  };
};

// All translatable text goes here
const translations: Translations = {
  siteTitle: {
    fr: "Strike Gear",
    ar: "strike gear",
  },
  home: {
    fr: "Accueil",
    ar: "الرئيسية",
  },
  products: {
    fr: "Produits",
    ar: "المنتجات",
  },
  boots: {
    fr: "Brodequin",
    ar: "أحذية",
  },
  jackets: {
    fr: "Vestes",
    ar: "سترات",
  },
  accessories: {
    fr: "Accessoires",
    ar: "إكسسوارات",
  },
  cart: {
    fr: "Panier",
    ar: "السلة",
  },
  login: {
    fr: "Connexion",
    ar: "تسجيل الدخول",
  },
  signup: {
    fr: "S'inscrire",
    ar: "إنشاء حساب",
  },
  contactUs: {
    fr: "Contactez-nous",
    ar: "اتصل بنا",
  },
  aboutUs: {
    fr: "À propos de nous",
    ar: "من نحن",
  },
  admin: {
    fr: "Admin",
    ar: "المشرف",
  },
  addToCart: {
    fr: "Ajouter au panier",
    ar: "أضف إلى السلة",
  },
  outOfStock: {
    fr: "En rupture de stock",
    ar: "نفذ من المخزون",
  },
  inStock: {
    fr: "En stock",
    ar: "متوفر",
  },
  search: {
    fr: "Rechercher",
    ar: "بحث",
  },
  email: {
    fr: "Email",
    ar: "البريد الإلكتروني",
  },
  phone: {
    fr: "Téléphone",
    ar: "الهاتف",
  },
  address: {
    fr: "Adresse",
    ar: "العنوان",
  },
  price: {
    fr: "Prix",
    ar: "السعر",
  },
  description: {
    fr: "Description",
    ar: "الوصف",
  },
  ourProducts: {
    fr: "Nos Produits",
    ar: "منتجاتنا",
  },
  featured: {
    fr: "En vedette",
    ar: "مميز",
  },
  newArrivals: {
    fr: "Nouveautés",
    ar: "وصل حديثاً",
  },
  bestSellers: {
    fr: "Meilleures ventes",
    ar: "الأكثر مبيعاً",
  },
  welcomeMessage: {
    fr: "Bienvenue chez Nidal Boots",
    ar: "مرحباً بكم في أحذية نضال",
  },
  shopNow: {
    fr: "Acheter maintenant",
    ar: "تسوق الآن",
  },
  exploreProducts: {
    fr: "Explorer nos produits",
    ar: "استكشف منتجاتنا",
  },
  findUs: {
    fr: "Nous trouver",
    ar: "أين نحن",
  },
  followUs: {
    fr: "Suivez-nous",
    ar: "تابعنا",
  },
  logout: {
    fr: "Déconnexion",
    ar: "تسجيل الخروج",
  },
  dashboard: {
    fr: "Tableau de bord",
    ar: "لوحة التحكم",
  },
  manageProducts: {
    fr: "Gérer les produits",
    ar: "إدارة المنتجات",
  },
  addProduct: {
    fr: "Ajouter un produit",
    ar: "إضافة منتج",
  },
  editProduct: {
    fr: "Modifier le produit",
    ar: "تعديل المنتج",
  },
  deleteProduct: {
    fr: "Supprimer le produit",
    ar: "حذف المنتج",
  },
  category: {
    fr: "Catégorie",
    ar: "الفئة",
  },
  saveChanges: {
    fr: "Enregistrer les modifications",
    ar: "حفظ التغييرات",
  },
  cancel: {
    fr: "Annuler",
    ar: "إلغاء",
  },
  discount: {
    fr: "Remise",
    ar: "خصم",
  },
  status: {
    fr: "Statut",
    ar: "الحالة",
  },
  username: {
    fr: "Nom d'utilisateur",
    ar: "اسم المستخدم",
  },
  password: {
    fr: "Mot de passe",
    ar: "كلمة المرور",
  },
  emptyCart: {
    fr: "Votre panier est vide",
    ar: "سلة التسوق فارغة",
  },
  checkout: {
    fr: "Passer à la caisse",
    ar: "إتمام الشراء",
  },
  total: {
    fr: "Total",
    ar: "المجموع",
  },
  quantity: {
    fr: "Quantité",
    ar: "الكمية",
  },
  remove: {
    fr: "Supprimer",
    ar: "إزالة",
  },
  findUsOn: {
    fr: "Retrouvez-nous sur",
    ar: "تجدنا على",
  },
  dark: {
    fr: "Sombre",
    ar: "داكن",
  },
  light: {
    fr: "Clair",
    ar: "فاتح",
  },
  yourAccount: {
    fr: "Votre compte",
    ar: "حسابك",
  },
  favorites: {
    fr: "Favoris",
    ar: "المفضلة",
  },
  continueShop: {
    fr: "Continuer les achats",
    ar: "مواصلة التسوق",
  },
  rememberMe: {
    fr: "Se souvenir de moi",
    ar: "تذكرني",
  },
  forgotPassword: {
    fr: "Mot de passe oublié?",
    ar: "نسيت كلمة المرور؟",
  },
  noAccount: {
    fr: "Pas de compte?",
    ar: "ليس لديك حساب؟",
  },
  hasAccount: {
    fr: "Vous avez déjà un compte?",
    ar: "لديك حساب بالفعل؟",
  },
  createAccount: {
    fr: "Créer un compte",
    ar: "إنشاء حساب",
  },
  noFavorites: {
    fr: "Aucun favori",
    ar: "لا توجد مفضلات",
  },
  noFavoritesMessage: {
    fr: "Vous n'avez pas encore ajouté de produits à vos favoris",
    ar: "لم تقم بإضافة أي منتجات إلى المفضلة بعد",
  },
  pants: {
    fr: "Pantalons",
    ar: "سراويل",
  },
  allProducts: {
    fr: "Tous les produits",
    ar: "جميع المنتجات",
  },
  allRights: {
    fr: "Tous droits réservés",
    ar: "جميع الحقوق محفوظة",
  },
  shipping: {
    fr: "Livraison",
    ar: "الشحن",
  },
  returns: {
    fr: "Retours",
    ar: "الإرجاع",
  },
  sendMessage: {
    fr: "Envoyer le message",
    ar: "إرسال الرسالة",
  },
  messageSent: {
    fr: "Message envoyé avec succès !",
    ar: "تم إرسال الرسالة بنجاح!",
  },
  name: {
    fr: "Nom",
    ar: "الاسم",
  },
  subject: {
    fr: "Sujet",
    ar: "الموضوع",
  },
  message: {
    fr: "Message",
    ar: "الرسالة",
  },
  equipmentDescription: {
    fr: "Équipement militaire et tactique de haute qualité",
    ar: "معدات عسكرية وتكتيكية عالية الجودة",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translations[key][language];
  };

  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? "rtl" : "ltr"}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
