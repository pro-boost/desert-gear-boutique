import React, { createContext, useContext, useState, ReactNode } from "react";

// Define types for languages
type Language = "fr" | "ar";
type TranslationKey = string;
type TranslationValue = string;
type Translations = Record<TranslationKey, TranslationValue>;
type AllTranslations = Record<Language, Translations>;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: string;
}

const translations: AllTranslations = {
  fr: {
    // Navigation
    home: "Accueil",
    shop: "Boutique",
    about: "À propos",
    contact: "Contact",
    cart: "Panier",
    account: "Compte",
    login: "Connexion",
    signup: "Inscription",
    logout: "Déconnexion",
    favorites: "Favoris",
    
    // Product related
    price: "Prix",
    discountPrice: "Prix réduit",
    inStock: "En stock",
    outOfStock: "Rupture de stock",
    category: "Catégorie",
    categories: "Catégories",
    all: "Tous",
    tactical: "Tactique",
    clothing: "Vêtements",
    accessories: "Accessoires",
    gear: "Équipement",
    featured: "En vedette",
    new: "Nouveau",
    sale: "Solde",
    addToCart: "Ajouter au panier",
    details: "Détails",
    description: "Description",
    size: "Taille",
    color: "Couleur",
    quantity: "Quantité",
    wishlist: "Liste de souhaits",
    products: "Produits",
    filter: "Filtrer",
    sort: "Trier",
    search: "Rechercher",
    searchPlaceholder: "Rechercher des produits...",
    noProducts: "Aucun produit trouvé",
    selectSize: "Sélectionner une taille",
    selectSizeFirst: "Sélectionnez d'abord une taille",
    noSizesAvailable: "Aucune taille disponible",
    
    // Cart related
    yourCart: "Votre panier",
    cartEmpty: "Votre panier est vide",
    continueShop: "Continuer vos achats",
    checkout: "Paiement",
    total: "Total",
    subtotal: "Sous-total",
    shipping: "Livraison",
    free: "Gratuit",
    proceedToCheckout: "Procéder au paiement",
    orderSummary: "Résumé de la commande",
    placeOrder: "Passer la commande",
    orderSuccess: "Commande réussie",
    orderConfirmation: "Votre commande a été confirmée",
    processingOrder: "Traitement de votre commande...",
    processing: "Traitement...",
    emptyCart: "Panier vide",
    emptyCartMessage: "Votre panier est vide. Parcourez nos produits et ajoutez-en à votre panier.",
    clearCart: "Vider le panier",
    item: "article",
    items: "articles",
    shopNow: "Acheter maintenant",
    payAfterDelivery: "Paiement à la livraison",
    payAfterReceiving: "Vous payez après avoir reçu votre commande.",
    contactConfirmation: "Nous vous contacterons pour confirmer votre commande.",
    
    // Checkout form
    fullNameId: "Nom complet",
    nationalId: "Carte d'identité nationale",
    completeAddress: "Adresse complète",
    phone: "Numéro de téléphone",
    
    // Login/Signup
    email: "E-mail",
    password: "Mot de passe",
    forgotPassword: "Mot de passe oublié?",
    dontHaveAccount: "Vous n'avez pas de compte?",
    alreadyHaveAccount: "Vous avez déjà un compte?",
    
    // Toast notifications
    productAdded: "Produit ajouté",
    addedToCart: "a été ajouté au panier",
    cartUpdated: "Panier mis à jour",
    quantityIncreased: "quantité augmentée",
    itemRemoved: "Article supprimé",
    removedFromCart: "a été retiré du panier",
    quantityUpdated: "Quantité mise à jour",
    cartCleared: "Panier vidé",
    cartClearedMessage: "Tous les articles ont été retirés de votre panier",
    favoriteAdded: "Favori ajouté",
    addedToFavorites: "a été ajouté aux favoris",
    favoriteRemoved: "Favori retiré",
    removedFromFavorites: "a été retiré des favoris",
    loginRequired: "Connexion requise",
    loginToCheckout: "Veuillez vous connecter pour continuer vers le paiement",
    addItemsBeforeCheckout: "Ajoutez des articles à votre panier avant de passer à la caisse",
    orderError: "Erreur de commande",
    errorProcessingOrder: "Une erreur est survenue lors du traitement de votre commande",
    
    // Other
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    warning: "Avertissement",
    info: "Information",
    close: "Fermer",
    save: "Sauvegarder",
    delete: "Supprimer",
    cancel: "Annuler",
    confirm: "Confirmer",
    back: "Retour",
    next: "Suivant",
    previous: "Précédent",
    backToProducts: "Retour aux produits",
    productNotFound: "Produit non trouvé",
    relatedProducts: "Produits associés",
    emptyFavorites: "Aucun favori",
    noFavoritesMessage: "Vous n'avez pas encore ajouté de produits à vos favoris.",
    customerInfo: "Informations client",
    
    // WhatsApp Integration
    continueOnWhatsApp: "Continuer sur WhatsApp",
    whatsAppConfirmation: "Après avoir soumis vos informations, vous serez redirigé vers WhatsApp pour finaliser votre commande.",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    shop: "المتجر",
    about: "حول",
    contact: "اتصل بنا",
    cart: "سلة التسوق",
    account: "الحساب",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    logout: "تسجيل الخروج",
    favorites: "المفضلة",
    
    // Product related
    price: "السعر",
    discountPrice: "سعر مخفض",
    inStock: "متوفر",
    outOfStock: "نفذ من المخزون",
    category: "الفئة",
    categories: "الفئات",
    all: "الكل",
    tactical: "تكتيكي",
    clothing: "ملابس",
    accessories: "إكسسوارات",
    gear: "معدات",
    featured: "مميز",
    new: "جديد",
    sale: "تخفيض",
    addToCart: "أضف إلى السلة",
    details: "التفاصيل",
    description: "الوصف",
    size: "الحجم",
    color: "اللون",
    quantity: "الكمية",
    wishlist: "قائمة الرغبات",
    products: "المنتجات",
    filter: "تصفية",
    sort: "ترتيب",
    search: "بحث",
    searchPlaceholder: "البحث عن منتجات...",
    noProducts: "لم يتم العثور على منتجات",
    selectSize: "اختر الحجم",
    selectSizeFirst: "اختر الحجم أولاً",
    noSizesAvailable: "لا توجد أحجام متاحة",
    
    // Cart related
    yourCart: "سلة التسوق الخاصة بك",
    cartEmpty: "سلة التسوق فارغة",
    continueShop: "مواصلة التسوق",
    checkout: "الدفع",
    total: "المجموع",
    subtotal: "المجموع الفرعي",
    shipping: "الشحن",
    free: "مجاني",
    proceedToCheckout: "متابعة الدفع",
    orderSummary: "ملخص الطلب",
    placeOrder: "تأكيد الطلب",
    orderSuccess: "تم الطلب بنجاح",
    orderConfirmation: "تم تأكيد طلبك",
    processingOrder: "جاري معالجة طلبك...",
    processing: "جاري المعالجة...",
    emptyCart: "السلة فارغة",
    emptyCartMessage: "سلة التسوق الخاصة بك فارغة. تصفح منتجاتنا وأضفها إلى سلة التسوق.",
    clearCart: "إفراغ السلة",
    item: "عنصر",
    items: "عناصر",
    shopNow: "تسوق الآن",
    payAfterDelivery: "الدفع عند الاستلام",
    payAfterReceiving: "تدفع بعد استلام طلبك.",
    contactConfirmation: "سنتصل بك لتأكيد طلبك.",
    
    // Checkout form
    fullNameId: "الاسم الكامل",
    nationalId: "بطاقة الهوية الوطنية",
    completeAddress: "العنوان الكامل",
    phone: "رقم الهاتف",
    
    // Login/Signup
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    dontHaveAccount: "ليس لديك حساب؟",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    
    // Toast notifications
    productAdded: "تمت إضافة المنتج",
    addedToCart: "تمت إضافته إلى سلة التسوق",
    cartUpdated: "تم تحديث السلة",
    quantityIncreased: "تمت زيادة الكمية",
    itemRemoved: "تمت إزالة العنصر",
    removedFromCart: "تمت إزالته من سلة التسوق",
    quantityUpdated: "تم تحديث الكمية",
    cartCleared: "تم إفراغ السلة",
    cartClearedMessage: "تمت إزالة جميع العناصر من سلة التسوق الخاصة بك",
    favoriteAdded: "تمت إضافة المفضلة",
    addedToFavorites: "تمت إضافته إلى المفضلة",
    favoriteRemoved: "تمت إزالة المفضلة",
    removedFromFavorites: "تمت إزالته من المفضلة",
    loginRequired: "تسجيل الدخول مطلوب",
    loginToCheckout: "يرجى تسجيل الدخول للمتابعة إلى الدفع",
    addItemsBeforeCheckout: "أضف عناصر إلى سلة التسوق قبل الدفع",
    orderError: "خطأ في الطلب",
    errorProcessingOrder: "حدث خطأ أثناء معالجة طلبك",
    
    // Other
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجاح",
    warning: "تحذير",
    info: "معلومات",
    close: "إغلاق",
    save: "حفظ",
    delete: "حذف",
    cancel: "إلغاء",
    confirm: "تأكيد",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    backToProducts: "العودة إلى المنتجات",
    productNotFound: "المنتج غير موجود",
    relatedProducts: "منتجات ذات صلة",
    emptyFavorites: "لا توجد مفضلات",
    noFavoritesMessage: "لم تقم بإضافة أي منتجات إلى المفضلة بعد.",
    customerInfo: "معلومات العميل",
    
    // WhatsApp Integration
    continueOnWhatsApp: "المتابعة على واتساب",
    whatsAppConfirmation: "بعد إرسال معلوماتك، سيتم توجيهك إلى واتساب لإنهاء طلبك.",
  },
};

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    const translation = translations[language][key];
    return translation || key;
  };

  // Set text direction based on language
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
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
