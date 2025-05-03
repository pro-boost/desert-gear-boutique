
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

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
    ar: "سترايك جير",
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
    fr: "Brodequins",
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
  stock: {
    fr: "Stock",
    ar: "المخزون",
  },
  allStock: {
    fr: "Tout le stock",
    ar: "كل المخزون",
  },
  inStock: {
    fr: "En stock",
    ar: "متوفر",
  },
  search: {
    fr: "Rechercher un produit",
    ar: "البحث عن منتج",
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
    fr: "Bienvenue chez Strike Gear",
    ar: "مرحباً بكم في سترايك جير",
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
  passwordRequirements: {
    fr: "Le mot de passe doit contenir au moins 6 caractères",
    ar: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
  },
  signupSubtitle: {
    fr: "Créez votre compte pour accéder à toutes les fonctionnalités",
    ar: "أنشئ حسابك للوصول إلى جميع الميزات",
  },
  loginSubtitle: {
    fr: "Connectez-vous pour accéder à votre compte",
    ar: "سجل دخولك للوصول إلى حسابك",
  },
  confirmPassword: {
    fr: "Confirmer le mot de passe",
    ar: "تأكيد كلمة المرور",
  },
  passwordsDontMatch: {
    fr: "Les mots de passe ne correspondent pas",
    ar: "كلمات المرور غير متطابقة",
  },
  passwordTooShort: {
    fr: "Le mot de passe doit contenir au moins 6 caractères",
    ar: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل",
  },
  usernameTaken: {
    fr: "Ce nom d'utilisateur est déjà pris",
    ar: "اسم المستخدم مستخدم بالفعل",
  },
  signupSuccess: {
    fr: "Compte créé avec succès",
    ar: "تم إنشاء الحساب بنجاح",
  },
  signupError: {
    fr: "Une erreur s'est produite lors de la création du compte",
    ar: "حدث خطأ أثناء إنشاء الحساب",
  },
  loginSuccess: {
    fr: "Connexion réussie",
    ar: "تم تسجيل الدخول بنجاح",
  },
  loginError: {
    fr: "Une erreur s'est produite lors de la connexion",
    ar: "حدث خطأ أثناء تسجيل الدخول",
  },
  invalidCredentials: {
    fr: "Nom d'utilisateur ou mot de passe incorrect",
    ar: "اسم المستخدم أو كلمة المرور غير صحيحة",
  },
  loggingIn: {
    fr: "Connexion en cours...",
    ar: "جاري تسجيل الدخول...",
  },
  creatingAccount: {
    fr: "Création du compte...",
    ar: "جاري إنشاء الحساب...",
  },
  size: {
    fr: "Taille",
    ar: "المقاس",
  },
  selectSize: {
    fr: "Sélectionner une taille",
    ar: "اختر المقاس",
  },
  noSizesAvailable: {
    fr: "Aucune taille disponible",
    ar: "لا توجد مقاسات متاحة",
  },
  selectSizeFirst: {
    fr: "Choisir une taille d'abord",
    ar: "اختر المقاس أولاً",
  },
  // Adding missing translations that are visible in English in various pages
  loading: {
    fr: "Chargement...",
    ar: "جاري التحميل...",
  },
  productNotFound: {
    fr: "Produit non trouvé",
    ar: "المنتج غير موجود",
  },
  backToProducts: {
    fr: "Retour aux produits",
    ar: "العودة إلى المنتجات",
  },
  relatedProducts: {
    fr: "Produits connexes",
    ar: "منتجات ذات صلة",
  },
  noProductsFound: {
    fr: "Aucun produit trouvé correspondant à vos critères",
    ar: "لم يتم العثور على منتجات تطابق معاييرك",
  },
  mission: {
    fr: "Mission",
    ar: "المهمة",
  },
  vision: {
    fr: "Vision",
    ar: "الرؤية",
  },
  missionDescription: {
    fr: "Nous nous engageons à fournir des équipements militaires et tactiques de la plus haute qualité, en mettant l'accent sur la durabilité et la performance.",
    ar: "نلتزم بتقديم معدات عسكرية وتكتيكية من أعلى جودة، مع التركيز على المتانة والأداء.",
  },
  visionDescription: {
    fr: "Devenir le leader de référence dans le domaine des équipements militaires et tactiques au Maroc et en Afrique.",
    ar: "أن نصبح الرائد المرجعي في مجال المعدات العسكرية والتكتيكية في المغرب وأفريقيا.",
  },
  standardDelivery: {
    fr: "Livraison Standard",
    ar: "التوصيل العادي",
  },
  expressDelivery: {
    fr: "Express",
    ar: "السريع",
  },
  orderTracking: {
    fr: "Suivi de Commande",
    ar: "تتبع الطلب",
  },
  realTimeTracking: {
    fr: "Suivi en temps réel",
    ar: "تتبع في الوقت الحقيقي",
  },
  emailNotifications: {
    fr: "Notifications par email",
    ar: "إشعارات عبر البريد الإلكتروني",
  },
  businessDays: {
    fr: "jours ouvrables",
    ar: "أيام العمل",
  },
  freeForOrders: {
    fr: "Gratuit pour les commandes",
    ar: "مجاني للطلبات",
  },
  surcharge: {
    fr: "Supplément de",
    ar: "رسوم إضافية قدرها",
  },
  deliveryZones: {
    fr: "Zones de Livraison",
    ar: "مناطق التوصيل",
  },
  deliveryZonesDescription: {
    fr: "Nous livrons dans toutes les villes du Maroc. Les délais peuvent varier selon votre localisation.",
    ar: "نقوم بالتوصيل إلى جميع مدن المغرب. قد تختلف مدة التوصيل حسب موقعك.",
  },
  importantToKnow: {
    fr: "Important à Savoir",
    ar: "مهم أن تعرف",
  },
  returnPolicy: {
    fr: "Politique de Retour",
    ar: "سياسة الإرجاع",
  },
  returnPolicyDescription: {
    fr: "Nous acceptons les retours dans les 30 jours suivant la réception de votre commande. Les articles doivent être dans leur état d'origine, non utilisés et dans leur emballage d'origine.",
    ar: "نقبل المرتجعات في غضون 30 يومًا من استلام طلبك. يجب أن تكون المنتجات في حالتها الأصلية، غير مستخدمة وفي عبوتها الأصلية.",
  },
  howToReturn: {
    fr: "Comment Retourner un Article",
    ar: "كيفية إرجاع منتج",
  },
  refunds: {
    fr: "Remboursements",
    ar: "المبالغ المستردة",
  },
  refundDescription: {
    fr: "Le remboursement sera effectué sous 5-10 jours ouvrables après réception et vérification du retour. Le montant sera crédité sur le mode de paiement utilisé lors de l'achat.",
    ar: "سيتم رد المبلغ خلال 5-10 أيام عمل بعد استلام المرتجع والتحقق منه. سيتم إضافة المبلغ إلى وسيلة الدفع المستخدمة عند الشراء.",
  },
  contactCustomerService: {
    fr: "Contactez notre service client pour initier le retour",
    ar: "اتصل بخدمة العملاء لبدء عملية الإرجاع",
  },
  packageCarefully: {
    fr: "Emballez soigneusement l'article avec tous les accessoires",
    ar: "قم بتغليف المنتج بعناية مع جميع الملحقات",
  },
  useReturnLabel: {
    fr: "Utilisez l'étiquette de retour fournie",
    ar: "استخدم ملصق الإرجاع المقدم",
  },
  dropOffPackage: {
    fr: "Déposez le colis au point de collecte indiqué",
    ar: "قم بإيداع الطرد في نقطة التجميع المحددة",
  },
  daysGuarantee: {
    fr: "30 Jours",
    ar: "30 يوم",
  },
  forReturning: {
    fr: "Pour retourner vos articles",
    ar: "لإرجاع منتجاتك",
  },
  warranty: {
    fr: "Garantie",
    ar: "الضمان",
  },
  yearWarranty: {
    fr: "Produits garantis 1 an",
    ar: "منتجات مضمونة لمدة سنة",
  },
  support: {
    fr: "Support",
    ar: "الدعم",
  },
  dedicatedSupport: {
    fr: "Assistance dédiée",
    ar: "دعم مخصص",
  },
  yourName: {
    fr: "Votre nom",
    ar: "اسمك",
  },
  yourEmail: {
    fr: "Votre email",
    ar: "بريدك الإلكتروني",
  },
  messageSubject: {
    fr: "Sujet du message",
    ar: "موضوع الرسالة",
  },
  typeYourMessage: {
    fr: "Tapez votre message ici...",
    ar: "اكتب رسالتك هنا...",
  },
  emptyFavorites: {
    fr: "Aucun favori",
    ar: "لا توجد مفضلات",
  },
  bestEquipment: {
    fr: "Le meilleur équipement militaire et tactique pour les professionnels et les passionnés.",
    ar: "أفضل المعدات العسكرية والتكتيكية للمحترفين والهواة.",
  },
  aboutUsDescription: {
    fr: "Nidal Boots est votre destination de confiance pour l'équipement militaire et tactique de haute qualité. Depuis notre fondation, nous nous sommes engagés à fournir les meilleurs produits aux professionnels et aux passionnés.",
    ar: "نضال بوتس هي وجهتك الموثوقة للمعدات العسكرية والتكتيكية عالية الجودة. منذ تأسيسنا، التزمنا بتقديم أفضل المنتجات للمحترفين والهواة.",
  },
  productSelection: {
    fr: "Notre sélection comprend des bottes militaires robustes, des vestes tactiques et des accessoires essentiels, tous soigneusement choisis pour leur qualité et leur durabilité.",
    ar: "تشمل مجموعتنا أحذية عسكرية متينة وسترات تكتيكية وإكسسوارات أساسية، تم اختيارها جميعًا بعناية لجودتها ومتانتها.",
  },
  ordersProcessed: {
    fr: "Les commandes sont traitées du lundi au vendredi",
    ar: "تتم معالجة الطلبات من الاثنين إلى الجمعة",
  },
  confirmationEmail: {
    fr: "Un email de confirmation vous sera envoyé après l'expédition",
    ar: "سيتم إرسال بريد إلكتروني للتأكيد بعد الشحن",
  },
  differentAddress: {
    fr: "Possibilité de livraison à une adresse différente",
    ar: "إمكانية التوصيل إلى عنوان مختلف",
  },
  customerSupport: {
    fr: "Service client disponible pour toute question",
    ar: "خدمة العملاء متاحة لأي استفسار",
  },
  // Add translations for components with hardcoded text
  sendMessageCta: {
    fr: "Envoyez-nous un message",
    ar: "أرسل لنا رسالة",
  },
  messageSentSuccess: {
    fr: "Message envoyé avec succès!",
    ar: "تم إرسال الرسالة بنجاح!",
  }
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

  // Detect browser language on mount
  useEffect(() => {
    const detectBrowserLanguage = () => {
      const browserLang = navigator.language.toLowerCase();

      // Check if the browser language is Arabic or French
      if (browserLang.startsWith("ar")) {
        setLanguage("ar");
      } else if (browserLang.startsWith("fr")) {
        setLanguage("fr");
      }
      // Default is already set to 'fr'
    };

    detectBrowserLanguage();
  }, []);

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
