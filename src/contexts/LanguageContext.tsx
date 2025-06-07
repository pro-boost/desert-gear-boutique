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
  contactDescription: {
    fr: "Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question.",
    ar: "نحن هنا لمساعدتك. لا تتردد في الاتصال بنا لأي استفسار.",
  },
  aboutUs: {
    fr: "À propos de nous",
    ar: "من نحن",
  },
  admin: {
    fr: "Administrateur",
    ar: "المشرف",
  },
  addToCart: {
    fr: "Ajouter au panier",
    ar: "أضف إلى السلة",
  },
  outOfStock: {
    fr: "En rupture de stock",
    ar: "نفد من المخزون",
  },
  stock: {
    fr: "Stock",
    ar: "المخزون",
  },
  adress: {
    fr: "Institut Imam Ouarch, Filles pour l'éducation musulmane, Meknès",
    ar: "مكناس  مؤسسة الإمام ورش بنات للتعليم العتيق",
  },
  allStock: {
    fr: "Tous les stocks",
    ar: "كل المخازن",
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
    fr: "E-mail",
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
    fr: "Nos produits",
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
    fr: "Commande",
    ar: "الطلب",
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
    fr: "Mot de passe oublié ?",
    ar: "نسيت كلمة المرور؟",
  },
  noAccount: {
    fr: "Pas de compte ?",
    ar: "ليس لديك حساب؟",
  },
  hasAccount: {
    fr: "Vous avez déjà un compte ?",
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
    fr: "équipements tactiques de haute qualité",
    ar: "معدات عالية الجودة",
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
    fr: "Taille :",
    ar: "المقاس :",
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
  backToCategories: {
    fr: "Retour aux catégories",
    ar: "العودة إلى الفئات",
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
    fr: "Nous nous engageons à fournir des équipements tactiques de la plus haute qualité, en mettant l'accent sur la durabilité et la performance.",
    ar: "نلتزم بتقديم معدات الأمان من أعلى جودة، مع التركيز على المتانة والأداء.",
  },
  visionDescription: {
    fr: "Devenir le leader de référence dans le domaine des équipements tactiques au Maroc et en Afrique.",
    ar: "أن نصبح الرائد المرجعي في مجال معدات الأمان في المغرب وأفريقيا.",
  },
  standardDelivery: {
    fr: "Livraison standard",
    ar: "التوصيل العادي",
  },
  expressDelivery: {
    fr: "Livraison express",
    ar: "التوصيل السريع",
  },
  orderTracking: {
    fr: "Suivi de commande",
    ar: "تتبع الطلب",
  },
  realTimeTracking: {
    fr: "Suivi en temps réel",
    ar: "تتبع في الوقت الحقيقي",
  },
  emailNotifications: {
    fr: "Sur site de livraison",
    ar: "في موقع التوصيل",
  },
  businessDays: {
    fr: "jours ouvrables",
    ar: "أيام العمل",
  },
  freeForOrders: {
    fr: "Livraison gratuite",
    ar: "توصيل مجاني",
  },
  surcharge: {
    fr: "Supplément de",
    ar: "رسوم إضافية قدرها",
  },
  deliveryZones: {
    fr: "Zones de livraison",
    ar: "مناطق التوصيل",
  },
  deliveryZonesDescription: {
    fr: "Nous livrons dans toutes les villes du Maroc. Les délais peuvent varier selon votre localisation.",
    ar: "نقوم بالتوصيل إلى جميع مدن المغرب. قد تختلف مدة التوصيل حسب موقعك.",
  },
  importantToKnow: {
    fr: "Important à savoir",
    ar: "مهم أن تعرف",
  },
  returnPolicy: {
    fr: "Politique de retour",
    ar: "سياسة الإرجاع",
  },
  returnPolicyDescription: {
    fr: "Nous acceptons les retours dans un délai de 2 jours après la réception de votre commande ou directement avec le même livreur, si la pointure ne correspond pas.\nLes articles doivent être dans leur état d'origine, non utilisés et dans leur emballage d'origine.",
    ar: "نقبل إرجاع المنتج خلال مدة لا تتجاوز يومين بعد استلام الطلب، أو يمكن إرجاعه مباشرة مع نفس عامل التوصيل إذا كان المقاس غير مناسب.\nيجب أن يكون المنتج في حالته الأصلية، غير مستعمل، وفي عبوته الأصلية.",
  },
  howToReturn: {
    fr: "Comment retourner un article",
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
    fr: "2 jours",
    ar: "2 يوما",
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
    fr: "Produits garantis 3 mois",
    ar: "منتجات مضمونة لمدة 3 شهور",
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
    fr: "Votre e-mail",
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
    fr: "Les meilleurs équipements tactiques pour les professionnels et les passionnés.",
    ar: "أفضل معدات الأمان للمحترفين والهواة.",
  },
  aboutUsDescription: {
    fr: "Strike Gear est votre destination de confiance pour les équipements tactiques de haute qualité. Depuis notre fondation, nous nous sommes engagés à fournir les meilleurs produits aux professionnels et aux passionnés.",
    ar: "سترايك جير هي وجهتك الموثوقة لمعدات الأمان عالية الجودة. منذ تأسيسنا، التزمنا بتقديم أفضل المنتجات للمحترفين والهواة.",
  },
  productSelection: {
    fr: "Notre sélection comprend des bottes robustes, des vestes tactiques et des accessoires essentiels, tous soigneusement choisis pour leur qualité et leur durabilité.",
    ar: "تشمل مجموعتنا أحذية متينة وسترات تكتيكية وإكسسوارات أساسية، تم اختيارها جميعًا بعناية لجودتها ومتانتها.",
  },
  ordersProcessed: {
    fr: "Les commandes sont traitées du lundi au vendredi",
    ar: "تتم معالجة الطلبات من الاثنين إلى الجمعة",
  },
  confirmationEmail: {
    fr: "Un message de confirmation vous sera envoyé après l'expédition",
    ar: "سيتم إرسال رسالة تأكيد بعد الشحن",
  },
  differentAddress: {
    fr: "Possibilité de livraison à une adresse différente",
    ar: "إمكانية التوصيل إلى عنوان مختلف",
  },
  customerSupport: {
    fr: "Service client disponible pour toute question",
    ar: "خدمة العملاء متاحة لأي استفسار",
  },
  sendMessageCta: {
    fr: "Envoyez-nous un message",
    ar: "أرسل لنا رسالة",
  },
  messageSentSuccess: {
    fr: "Message envoyé avec succès !",
    ar: "تم إرسال الرسالة بنجاح!",
  },
  loginRequired: {
    fr: "Veuillez vous connecter pour ajouter des articles au panier",
    ar: "يرجى تسجيل الدخول لإضافة منتجات إلى السلة",
  },
  loginToAddToCart: {
    fr: "Se connecter pour ajouter au panier",
    ar: "تسجيل الدخول لإضافة إلى السلة",
  },
  buyNow: {
    fr: "Acheter maintenant",
    ar: "اشتر الآن",
  },
  resetProducts: {
    fr: "Réinitialiser les produits",
    ar: "إعادة تعيين المنتجات",
  },
  productsReset: {
    fr: "Les produits ont été réinitialisés avec succès",
    ar: "تم إعادة تعيين المنتجات بنجاح",
  },
  welcomeToDesertGear: {
    fr: "Bienvenue chez Strike Gear Boutique",
    ar: "مرحباً بكم في سترايك جير بوتيك",
  },
  heroSubtitle: {
    fr: "Votre destination de confiance pour des équipements tactiques de haute qualité",
    ar: "وجهتك الموثوقة لمعدات عالية الجودة",
  },
  viewAll: {
    fr: "Voir tout",
    ar: "عرض الكل",
  },
  whyChooseUs: {
    fr: "Pourquoi nous choisir",
    ar: "لماذا تختارنا",
  },
  qualityAssuranceDescription: {
    fr: "Nous garantissons la qualité de chaque produit que nous vendons",
    ar: "نضمن جودة كل منتج نبيعه",
  },
  fastShippingDescription: {
    fr: "Livraison rapide et fiable dans tout le Maroc",
    ar: "توصيل سريع وموثوق في جميع أنحاء المغرب",
  },
  expertSupport: {
    fr: "Support expert",
    ar: "دعم متخصص",
  },
  expertSupportDescription: {
    fr: "Notre équipe d'experts est là pour vous aider",
    ar: "فريقنا من الخبراء هنا لمساعدتك",
  },
  filterProducts: {
    fr: "Filtrer les produits",
    ar: "تصفية المنتجات",
  },
  filterProductsDescription: {
    fr: "Utilisez les filtres ci-dessous pour trouver exactement ce que vous cherchez",
    ar: "استخدم الفلاتر أدناه للعثور على ما تبحث عنه بالضبط",
  },
  searchProducts: {
    fr: "Rechercher des produits...",
    ar: "البحث عن منتجات...",
  },
  selectCategory: {
    fr: "Sélectionner une catégorie",
    ar: "اختر فئة",
  },
  allCategories: {
    fr: "Toutes les catégories",
    ar: "جميع الفئات",
  },
  stockStatus: {
    fr: "État du stock",
    ar: "حالة المخزون",
  },
  viewDetails: {
    fr: "Voir les détails",
    ar: "عرض التفاصيل",
  },
  selectSizeForAllItems: {
    fr: "Veuillez sélectionner une taille pour tous les articles",
    ar: "الرجاء اختيار مقاس لجميع المنتجات",
  },
  addedToCart: {
    fr: "Produit ajouté au panier",
    ar: "تمت إضافة المنتج إلى السلة",
  },
  back: {
    fr: "Retour",
    ar: "رجوع",
  },
  selectSizes: {
    fr: "Sélectionner les tailles",
    ar: "اختر المقاسات",
  },
  backToCart: {
    fr: "Retour au panier",
    ar: "العودة إلى السلة",
  },
  orderInformation: {
    fr: "Informations de commande",
    ar: "معلومات الطلب",
  },
  emptyCartMessage: {
    fr: "Vous n'avez pas encore ajouté de produits à votre panier.",
    ar: "لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.",
  },
  cartEmpty: {
    fr: "Votre panier est vide",
    ar: "سلة التسوق فارغة",
  },
  orderPlacedSuccess: {
    fr: "Commande passée avec succès ! Nous vous contacterons bientôt pour confirmer votre commande.",
    ar: "تم تقديم الطلب بنجاح! سنتواصل معك قريبًا لتأكيد طلبك.",
  },
  orderPlacementError: {
    fr: "Un problème est survenu lors de la passation de votre commande. Veuillez réessayer.",
    ar: "حدثت مشكلة أثناء تقديم طلبك. يرجى المحاولة مرة أخرى.",
  },
  updatedCart: {
    fr: "Panier mis à jour",
    ar: "تم تحديث السلة",
  },
  removedFromCart: {
    fr: "Produit retiré du panier",
    ar: "تمت إزالة المنتج من السلة",
  },
  cartCleared: {
    fr: "Panier vidé",
    ar: "تم تفريغ السلة",
  },
  item: {
    fr: "article",
    ar: "منتج",
  },
  items: {
    fr: "articles",
    ar: "منتجات",
  },
  product: {
    fr: "Produit",
    ar: "المنتج",
  },
  clearCart: {
    fr: "Vider le panier",
    ar: "تفريغ السلة",
  },
  payAfterDelivery: {
    fr: "Paiement à la livraison",
    ar: "الدفع عند الاستلام",
  },
  deliveryConfirmation: {
    fr: "Nous vous contacterons pour confirmer votre commande et organiser la livraison à votre adresse.",
    ar: "سنتواصل معك لتأكيد طلبك وترتيب التوصيل إلى عنوانك.",
  },
  fullName: {
    fr: "Nom complet",
    ar: "الاسم الكامل",
  },
  enterFullName: {
    fr: "Entrez votre nom complet",
    ar: "أدخل اسمك الكامل",
  },
  emailAddress: {
    fr: "Adresse e-mail",
    ar: "البريد الإلكتروني",
  },
  enterEmailAddress: {
    fr: "Entrez votre adresse e-mail",
    ar: "أدخل بريدك الإلكتروني",
  },
  phoneNumber: {
    fr: "Numéro de téléphone",
    ar: "رقم الهاتف",
  },
  enterPhoneNumber: {
    fr: "Entrez votre numéro de téléphone",
    ar: "أدخل رقم هاتفك",
  },
  deliveryAddress: {
    fr: "Adresse de livraison",
    ar: "عنوان التوصيل",
  },
  enterDeliveryAddress: {
    fr: "Entrez votre adresse complète de livraison",
    ar: "أدخل عنوان التوصيل الكامل",
  },
  agreeToPolicies: {
    fr: "En passant votre commande, vous acceptez nos :",
    ar: "بإتمامك للطلب، فإنك توافق على:",
  },
  shippingPolicy: {
    fr: "Politique de livraison",
    ar: "سياسة الشحن",
  },
  placeOrder: {
    fr: "Passer la commande",
    ar: "تأكيد الطلب",
  },
  subtotal: {
    fr: "Sous-total",
    ar: "المجموع الفرعي",
  },
  orderSummary: {
    fr: "Récapitulatif de la commande",
    ar: "ملخص الطلب",
  },
  free: {
    fr: "Gratuit",
    ar: "مجاني",
  },
  proceedToCheckout: {
    fr: "Passer à la commande",
    ar: "المتابعة إلى الدفع",
  },
  newOrder: {
    fr: "Nouvelle commande de produit",
    ar: "طلب منتج جديد",
  },
  orderItems: {
    fr: "Articles commandés",
    ar: "المنتجات المطلوبة",
  },
  provideDeliveryDetails: {
    fr: "Veuillez fournir vos informations de livraison dans le chat",
    ar: "يرجى تقديم تفاصيل التوصيل في المحادثة",
  },
  payAfterReceiving: {
    fr: "Paiement à la réception de la commande",
    ar: "الدفع عند استلام الطلب",
  },
  // Admin page translations
  adminDashboard: {
    fr: "Tableau de bord administrateur",
    ar: "لوحة تحكم المشرف",
  },
  backToHome: {
    fr: "Retour à l'accueil",
    ar: "العودة إلى الصفحة الرئيسية",
  },
  categories: {
    fr: "Catégories",
    ar: "الفئات",
  },
  manageProductsDescription: {
    fr: "Gérez vos produits : ajoutez-en de nouveaux ou modifiez les existants.",
    ar: "قم بإدارة منتجاتك، أضف منتجات جديدة أو عدّل المنتجات الموجودة.",
  },
  manageCategories: {
    fr: "Gérer les catégories",
    ar: "إدارة الفئات",
  },
  manageCategoriesDescription: {
    fr: "Gérez les catégories de produits et leurs tailles disponibles.",
    ar: "قم بإدارة فئات المنتجات والمقاسات المتاحة.",
  },
  addCategory: {
    fr: "Ajouter une catégorie",
    ar: "إضافة فئة",
  },
  editCategory: {
    fr: "Modifier la catégorie",
    ar: "تعديل الفئة",
  },
  editCategoryDescription: {
    fr: "Modifiez les détails de la catégorie et ses tailles disponibles.",
    ar: "قم بتعديل تفاصيل الفئة والمقاسات المتاحة.",
  },
  addCategoryDescription: {
    fr: "Créez une nouvelle catégorie avec ses tailles disponibles.",
    ar: "أنشئ فئة جديدة مع المقاسات المتاحة.",
  },
  categoryName: {
    fr: "Nom de la catégorie",
    ar: "اسم الفئة",
  },
  nameFr: {
    fr: "Nom (français)",
    ar: "الاسم (بالفرنسية)",
  },
  nameAr: {
    fr: "Nom (arabe)",
    ar: "الاسم (بالعربية)",
  },
  enterCategoryName: {
    fr: "Entrez le nom de la catégorie",
    ar: "أدخل اسم الفئة",
  },
  sizes: {
    fr: "Tailles",
    ar: "المقاسات",
  },
  enterSize: {
    fr: "Entrez une taille",
    ar: "أدخل مقاسًا",
  },
  addSize: {
    fr: "Ajouter une taille",
    ar: "إضافة مقاس",
  },
  deleteCategory: {
    fr: "Supprimer la catégorie",
    ar: "حذف الفئة",
  },
  categoryDeleted: {
    fr: "Catégorie supprimée avec succès",
    ar: "تم حذف الفئة بنجاح",
  },
  deleteCategoryConfirmation: {
    fr: "Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.",
    ar: "هل أنت متأكد أنك تريد حذف هذه الفئة؟ هذا الإجراء لا يمكن التراجع عنه.",
  },
  image: {
    fr: "Image",
    ar: "الصورة",
  },
  actions: {
    fr: "Actions",
    ar: "الإجراءات",
  },
  deleteProductConfirmation: {
    fr: "Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.",
    ar: "هل أنت متأكد أنك تريد حذف هذا المنتج؟ هذا الإجراء لا يمكن التراجع عنه.",
  },
  unauthorizedAccess: {
    fr: "Accès non autorisé",
    ar: "وصول غير مصرح به",
  },
  // Product form translations
  backToAdmin: {
    fr: "Retour à l'administration",
    ar: "العودة إلى لوحة التحكم",
  },
  editProductDetails: {
    fr: "Modifier les détails du produit",
    ar: "تعديل تفاصيل المنتج",
  },
  addProductDetails: {
    fr: "Ajouter un nouveau produit",
    ar: "إضافة منتج جديد",
  },
  editProductDescription: {
    fr: "Modifiez les informations du produit ci-dessous.",
    ar: "قم بتعديل معلومات المنتج أدناه.",
  },
  addProductDescription: {
    fr: "Remplissez les informations du produit ci-dessous.",
    ar: "املأ معلومات المنتج أدناه.",
  },
  productName: {
    fr: "Nom du produit",
    ar: "اسم المنتج",
  },
  discountPrice: {
    fr: "Prix réduit",
    ar: "السعر المخفض",
  },
  images: {
    fr: "Images",
    ar: "الصور",
  },
  productUpdated: {
    fr: "Produit mis à jour avec succès",
    ar: "تم تحديث المنتج بنجاح",
  },
  productAdded: {
    fr: "Produit ajouté avec succès",
    ar: "تمت إضافة المنتج بنجاح",
  },
  errorSavingProduct: {
    fr: "Erreur lors de l'enregistrement du produit",
    ar: "حدث خطأ أثناء حفظ المنتج",
  },
  errorLoadingData: {
    fr: "Erreur lors du chargement des données",
    ar: "حدث خطأ أثناء تحميل البيانات",
  },
  // ImageDropzone translations
  dropImagesHere: {
    fr: "Déposez l'image ici",
    ar: "أسقط الصورة هنا",
  },
  dropImagesHereMultiple: {
    fr: "Déposez les images ici",
    ar: "أسقط الصور هنا",
  },
  dragDropImage: {
    fr: "Glissez-déposez l'image du produit ici ou cliquez pour sélectionner",
    ar: "اسحب وأفلت صورة المنتج هنا أو انقر لاختيارها",
  },
  dragDropImages: {
    fr: "Glissez-déposez les images du produit ici ou cliquez pour sélectionner (max 5)",
    ar: "اسحب وأفلت صور المنتج هنا أو انقر لاختيارها (الحد الأقصى 5)",
  },
  productPreview: {
    fr: "Aperçu du produit",
    ar: "معاينة المنتج",
  },
  productPreviewMultiple: {
    fr: "Aperçu du produit {index}",
    ar: "معاينة المنتج {index}",
  },

  // Homepage feature translations
  fastShipping: {
    fr: "Livraison rapide",
    ar: "توصيل سريع",
  },
  qualityAssurance: {
    fr: "Garantie qualité",
    ar: "ضمان الجودة",
  },

  // Contact form placeholders
  yourPhone: {
    fr: "Votre numéro de téléphone",
    ar: "رقم هاتفك",
  },
  enterPhone: {
    fr: "+212-600-000-000",
    ar: "+212-600-000-000",
  },
  phoneNumberTooShort: {
    fr: "Le numéro de téléphone doit contenir au moins 10 chiffres",
    ar: "يجب أن يحتوي رقم الهاتف على 10 أرقام على الأقل",
  },
  phoneNumberFormat: {
    fr: "Veuillez entrer un numéro de téléphone valide (minimum 10 chiffres)",
    ar: "يرجى إدخال رقم هاتف صالح (10 أرقام على الأقل)",
  },
  enterSubject: {
    fr: "Comment pouvons-nous vous aider ?",
    ar: "كيف يمكننا مساعدتك؟",
  },
  enterMessage: {
    fr: "Écrivez votre message ici...",
    ar: "اكتب رسالتك هنا...",
  },

  // UI and product options
  direction: {
    fr: "ltr",
    ar: "rtl",
  },
  seeProduct: {
    fr: "Voir le produit",
    ar: "عرض المنتج",
  },
  maxSizesSelected: {
    fr: "Vous ne pouvez sélectionner que 5 tailles maximum",
    ar: "يمكنك اختيار 5 مقاسات كحد أقصى",
  },
  selectedSizes: {
    fr: "Tailles sélectionnées",
    ar: "المقاسات المختارة",
  },
  maxSizesNote: {
    fr: "Maximum 5 tailles par commande",
    ar: "الحد الأقصى 5 مقاسات لكل طلب",
  },
  addedToFavorites: {
    fr: "Produit ajouté aux favoris",
    ar: "تمت إضافة المنتج إلى المفضلة",
  },
  removedFromFavorites: {
    fr: "Produit retiré des favoris",
    ar: "تمت إزالة المنتج من المفضلة",
  },
  allSizes: {
    fr: "Toutes les tailles",
    ar: "جميع المقاسات",
  },
  resetFilters: {
    fr: "Réinitialiser les filtres",
    ar: "إعادة تعيين الفلاتر",
  },
  tryDifferentFilters: {
    fr: "Essayez d'autres filtres",
    ar: "جرب فلاتر مختلفة",
  },

  // Admin actions
  delete: {
    fr: "Supprimer",
    ar: "حذف",
  },
  edit: {
    fr: "Modifier",
    ar: "تعديل",
  },
  browseFiles: {
    fr: "Parcourir les fichiers",
    ar: "تصفح الملفات",
  },
  addMoreImages: {
    fr: "Ajouter d'autres images",
    ar: "إضافة المزيد من الصور",
  },
  pleaseFillAllRequiredFields: {
    fr: "Veuillez remplir tous les champs obligatoires",
    ar: "يرجى ملء جميع الحقول المطلوبة",
  },

  // Error messages
  errorAddingProduct: {
    fr: "Une erreur est survenue lors de l'ajout du produit",
    ar: "حدث خطأ أثناء إضافة المنتج",
  },
  errorUpdatingProduct: {
    fr: "Une erreur est survenue lors de la mise à jour du produit",
    ar: "حدث خطأ أثناء تحديث المنتج",
  },
  errorLoadingCategories: {
    fr: "Une erreur est survenue lors du chargement des catégories",
    ar: "حدث خطأ أثناء تحميل الفئات",
  },
  errorLoadingProduct: {
    fr: "Une erreur est survenue lors du chargement du produit",
    ar: "حدث خطأ أثناء تحميل المنتج",
  },
  errorUploadingImage: {
    fr: "Une erreur est survenue lors du téléversement de l'image",
    ar: "حدث خطأ أثناء تحميل الصورة",
  },
  errorRemovingImage: {
    fr: "Une erreur est survenue lors de la suppression de l'image",
    ar: "حدث خطأ أثناء حذف الصورة",
  },
  errorReorderingImages: {
    fr: "Une erreur est survenue lors du réagencement des images",
    ar: "حدث خطأ أثناء إعادة ترتيب الصور",
  },
  maxImagesReached: {
    fr: "Vous avez atteint le nombre maximal d'images (5)",
    ar: "لقد وصلت إلى الحد الأقصى للصور (5)",
  },
  invalidImageFormat: {
    fr: "Format d'image invalide. Formats acceptés : JPEG, JPG, PNG, WEBP",
    ar: "تنسيق صورة غير صالح. التنسيقات المقبولة: JPEG، JPG، PNG، WEBP",
  },
  imageTooLarge: {
    fr: "L'image est trop volumineuse. Taille maximale : 5 Mo",
    ar: "الصورة كبيرة جدًا. الحجم الأقصى: 5 ميجابايت",
  },

  // Descriptions
  descriptionFr: {
    fr: "Description (français)",
    ar: "الوصف (بالفرنسية)",
  },
  descriptionAr: {
    fr: "Description (arabe)",
    ar: "الوصف (بالعربية)",
  },
  // Product reordering translations
  orderUpdated: {
    fr: "Ordre des produits mis à jour",
    ar: "تم تحديث ترتيب المنتجات",
  },
  failedToUpdateOrder: {
    fr: "Échec de la mise à jour de l'ordre des produits",
    ar: "فشل في تحديث ترتيب المنتجات",
  },
  dragToReorder: {
    fr: "Faites glisser pour réorganiser",
    ar: "اسحب لإعادة الترتيب",
  },

  // Product details
  quantityLabel: {
    fr: "Quantité",
    ar: "الكمية",
  },
  sizesLabel: {
    fr: "Tailles",
    ar: "المقاسات",
  },
  pricePerItemLabel: {
    fr: "Prix par article",
    ar: "السعر لكل وحدة",
  },
  subtotalLabel: {
    fr: "Sous-total",
    ar: "المجموع الفرعي",
  },
  currencyLabel: {
    fr: "Dh",
    ar: "درهم",
  },

  // Product inquiry
  productInquiryHeader: {
    fr: "NOUVELLE DEMANDE DE PRODUIT",
    ar: "طلب معلومات عن منتج جديد",
  },
  productLabel: {
    fr: "Produit",
    ar: "المنتج",
  },
  priceLabel: {
    fr: "Prix",
    ar: "السعر",
  },
  availableSizesLabel: {
    fr: "Tailles disponibles",
    ar: "المقاسات المتوفرة",
  },
  inquiryGreeting: {
    fr: "Bonjour,",
    ar: "مرحباً،",
  },
  inquiryMessage: {
    fr: "Je suis intéressé(e) par ce produit et souhaiterais avoir plus d'informations.",
    ar: "أنا مهتم بهذا المنتج وأرغب في الحصول على مزيد من المعلومات.",
  },
  inquiryThankYou: {
    fr: "Merci d'avance pour votre retour.",
    ar: "شكراً لكم مسبقاً على ردكم.",
  },
  inquireOnWhatsApp: {
    fr: "Demander via WhatsApp",
    ar: "الاستفسار عبر واتساب",
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

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

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

export { useLanguage };
