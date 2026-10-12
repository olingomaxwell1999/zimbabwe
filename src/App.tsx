import { useState, useEffect } from "react";
import AirtelPayment from "@/AirtelPayment";
import OrangePayment from "@/OrangePayment";
import { notifyTransaction } from "@/lib/notify";

interface PlanCard {
  id: string;
  name: string;
  data: string;
  oldPrice: string;
  promoPrice: string;
  period: string;
  features: {
    label: string;
    bg: string;
    text: string;
  }[];
  iconBg: string;
  iconText: string;
  iconSvg: string;
  popular?: boolean;
  cdf: number;
  originalCdf: number;
}

const monthlyPlans: PlanCard[] = [
  {
    id: "basique-m",
    name: "Forfait Basique",
    data: "5 Go /mois",
    oldPrice: "CDF 5,000",
    promoPrice: "CDF 3,000",
    period: "/mois",
    cdf: 3000,
    originalCdf: 5000,
    features: [
      {
        label: "Données illimitées",
        bg: "bg-green-100",
        text: "text-green-600",
      },
      {
        label: "Économique",
        bg: "bg-green-100",
        text: "text-green-600",
      },
    ],
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    iconSvg: "signal",
  },
  {
    id: "standard-m",
    name: "Forfait Standard",
    data: "15 Go /mois",
    oldPrice: "CDF 8,000",
    promoPrice: "CDF 5,000",
    period: "/mois",
    cdf: 5000,
    originalCdf: 8000,
    features: [
      {
        label: "Données illimitées",
        bg: "bg-blue-100",
        text: "text-blue-600",
      },
      {
        label: "Meilleur rapport qualité-prix",
        bg: "bg-blue-100",
        text: "text-blue-600",
      },
    ],
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    iconSvg: "bolt",
  },
  {
    id: "premium-m",
    name: "Forfait Premium",
    data: "30 Go /mois",
    oldPrice: "CDF 12,000",
    promoPrice: "CDF 8,000",
    period: "/mois",
    cdf: 8000,
    originalCdf: 12000,
    features: [
      {
        label: "Données illimitées",
        bg: "bg-purple-100",
        text: "text-purple-600",
      },
      {
        label: "Streaming HD",
        bg: "bg-purple-100",
        text: "text-purple-600",
      },
    ],
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    iconSvg: "rocket",
  },
  {
    id: "pro-m",
    name: "Forfait Pro",
    data: "60 Go /mois",
    oldPrice: "CDF 18,000",
    promoPrice: "CDF 12,000",
    period: "/mois",
    cdf: 12000,
    originalCdf: 18000,
    features: [
      {
        label: "Données illimitées",
        bg: "bg-indigo-100",
        text: "text-indigo-600",
      },
      {
        label: "Usage intensif",
        bg: "bg-indigo-100",
        text: "text-indigo-600",
      },
    ],
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    iconSvg: "shield",
  },
  {
    id: "business-m",
    name: "Forfait Business",
    data: "100 Go /mois",
    oldPrice: "CDF 30,000",
    promoPrice: "CDF 20,000",
    period: "/mois",
    cdf: 20000,
    originalCdf: 30000,
    features: [
      {
        label: "Données illimitées",
        bg: "bg-gray-100",
        text: "text-gray-700",
      },
      {
        label: "Entreprise",
        bg: "bg-gray-100",
        text: "text-gray-700",
      },
    ],
    iconBg: "bg-gray-100",
    iconText: "text-gray-700",
    iconSvg: "building",
  },
];

const bundlePlans: PlanCard[] = [
  {
    id: "starter",
    name: "Forfait Starter",
    data: "120 GB / 2 mois",
    oldPrice: "CDF 42,000",
    promoPrice: "CDF 30,000",
    period: "/2 mois",
    cdf: 30000,
    originalCdf: 42000,
    features: [
      {
        label: "Données illimitées",
        bg: "bg-green-100",
        text: "text-green-600",
      },
      {
        label: "Économique",
        bg: "bg-green-100",
        text: "text-green-600",
      },
    ],
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    iconSvg: "signal",
  },
  {
    id: "standard",
    name: "Forfait Avancé",
    data: "250 GB / 2 mois",
    oldPrice: "CDF 70,000",
    promoPrice: "CDF 50,000",
    period: "/2 mois",
    cdf: 50000,
    originalCdf: 70000,
    features: [
      {
        label: "Données illimitées",
        bg: "bg-blue-100",
        text: "text-blue-600",
      },
      {
        label: "Meilleur rapport qualité-prix",
        bg: "bg-blue-100",
        text: "text-blue-600",
      },
    ],
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    iconSvg: "bolt",
    popular: true,
  },
  {
    id: "premium",
    name: "Forfait Élite",
    data: "400 GB / 2 mois",
    oldPrice: "CDF 105,000",
    promoPrice: "CDF 75,000",
    period: "/2 mois",
    cdf: 75000,
    originalCdf: 105000,
    features: [
      {
        label: "Données illimitées",
        bg: "bg-purple-100",
        text: "text-purple-600",
      },
      {
        label: "Streaming HD",
        bg: "bg-purple-100",
        text: "text-purple-600",
      },
    ],
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    iconSvg: "rocket",
  },
  {
    id: "pro",
    name: "Forfait Pro",
    data: "600 GB / 3 mois",
    oldPrice: "CDF 140,000",
    promoPrice: "CDF 100,000",
    period: "/3 mois",
    cdf: 100000,
    originalCdf: 140000,
    features: [
      {
        label: "Données illimitées",
        bg: "bg-cyan-100",
        text: "text-cyan-600",
      },
      {
        label: "Usage intensif",
        bg: "bg-cyan-100",
        text: "text-cyan-600",
      },
    ],
    iconBg: "bg-cyan-100",
    iconText: "text-cyan-600",
    iconSvg: "cloud",
  },
  {
    id: "business",
    name: "Forfait Business",
    data: "1 TB / 3 mois",
    oldPrice: "CDF 210,000",
    promoPrice: "CDF 150,000",
    period: "/3 mois",
    cdf: 150000,
    originalCdf: 210000,
    features: [
      {
        label: "Données illimitées",
        bg: "bg-indigo-100",
        text: "text-indigo-600",
      },
      {
        label: "Entreprise",
        bg: "bg-indigo-100",
        text: "text-indigo-600",
      },
      {
        label: "Support prioritaire",
        bg: "bg-indigo-100",
        text: "text-indigo-600",
      },
    ],
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    iconSvg: "briefcase",
  },
  {
    id: "unlimited",
    name: "Forfait Illimité",
    data: "Données illimitées / 3 mois",
    oldPrice: "CDF 350,000",
    promoPrice: "CDF 250,000",
    period: "/3 mois",
    cdf: 250000,
    originalCdf: 350000,
    features: [
      {
        label: "Illimité 24/7",
        bg: "bg-orange-100",
        text: "text-orange-600",
      },
      {
        label: "Support VIP",
        bg: "bg-orange-100",
        text: "text-orange-600",
      },
      {
        label: "IP statique",
        bg: "bg-orange-100",
        text: "text-orange-600",
      },
    ],
    iconBg: "bg-gradient-to-br from-yellow-400 to-orange-500",
    iconText: "text-white",
    iconSvg: "star",
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

function App() {
  const [selectedPlan, setSelectedPlan] = useState<PlanCard | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<"airtel" | "orange">(
    "airtel",
  );
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);

  useEffect(() => {
    document.title = "Plans Starlink";
    document.documentElement.lang = "fr";
  }, []);

  const handlePlanClick = (plan: PlanCard) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentMethod = (method: "airtel" | "orange") => {
    setShowPaymentModal(false);
    setLoadingMethod(method);
    setShowLoadingModal(true);

    if (selectedPlan) {
      notifyTransaction({
        planName: selectedPlan.name,
        amount: selectedPlan.promoPrice,
        paymentMethod: method,
        countryCode: "",
        status: "pending",
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-black text-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <StarlinkLogo className="w-9 h-9" />

            <span className="font-bold text-xl sm:text-2xl tracking-widest">
              STARLINK
            </span>

            <span className="text-sm border-l pl-2 ml-2 border-gray-600 hidden sm:inline">
              Reseller
            </span>
          </a>

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
              <span className="hidden sm:inline">État du service</span>
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
              <span className="hidden sm:inline">Forfaits</span>
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
              <span className="hidden sm:inline">Commandes</span>
            </a>
          </nav>
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
                  FORFAITS INTERNET
                </p>

                <h1 className="text-2xl sm:text-3xl font-black mt-2">
                  Choisissez Votre Forfait
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

            <p className="text-gray-400 text-sm">
              Cliquez sur un forfait pour voir les options de paiement Mobile Money (Airtel, Moov, Lumitel, EcoCash, Orange).
            </p>
          </div>

          {/* Package Cards */}
          <div className="space-y-4">
            {monthlyPlans.map((plan) => (
              <PackageCard
                key={plan.id}
                plan={plan}
                onClick={() => handlePlanClick(plan)}
                onConfigure={() => setShowConfigureModal(true)}
              />
            ))}

            {bundlePlans.map((plan) => (
              <PackageCard
                key={plan.id}
                plan={plan}
                onClick={() => handlePlanClick(plan)}
                onConfigure={() => setShowConfigureModal(true)}
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
                  Paiement Mobile Money (Airtel, Moov, Lumitel, EcoCash, Orange)
                </h4>

                <p className="text-sm text-gray-600">
                  Cliquez d'abord sur un forfait ci-dessus, puis choisissez votre opérateur pour finaliser le paiement.
                </p>
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
            <span className="text-xs font-semibold">État du service</span>
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
            <span className="text-xs font-semibold">Forfaits</span>
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
            <span className="text-xs font-semibold">Commandes</span>
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
            <span className="text-xs font-semibold">Paramètres</span>
          </a>
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">
                STARLINK
              </h3>

              <p className="text-sm">
                Revendeur agréé de forfaits de données pour les services Starlink. Paiements rapides, fiables et sécurisés via Airtel Money.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">SUPPORT</h3>

              <p className="text-sm">Email: support@starlink.reseller</p>

              <p className="text-sm mt-1">
                Disponible 24h/24, 7j/7 pour l'assistance technique.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">PAIEMENT</h3>

              <p className="text-sm">
                Payez en toute sécurité avec Airtel Money. Assurez-vous d'avoir un solde suffisant pour le forfait sélectionné.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Starlink Reseller. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* Payment Flow */}
      {showPaymentFlow && selectedPlan && loadingMethod === "airtel" && (
        <AirtelPayment
          packageName={selectedPlan.name}
          amount={selectedPlan.promoPrice}
          onBack={closePaymentFlow}
        />
      )}

      {showPaymentFlow && selectedPlan && loadingMethod === "orange" && (
        <OrangePayment
          packageName={selectedPlan.name}
          amount={selectedPlan.promoPrice}
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
              className="w-[50px] h-[50px] rounded-lg flex items-center justify-center mx-auto mb-4 text-white text-[11px] font-bold"
              style={{
                background: loadingMethod === "airtel" ? "#ed1c24" : "#FF6600",
              }}
            >
              {loadingMethod === "airtel" ? "airtel" : "Orange"}
            </div>

            <h3 className="text-[17px] font-semibold text-gray-800 mb-2">
              Traitement du paiement
            </h3>

            <p className="text-[13px] text-gray-500 mb-2 leading-snug">
              {loadingMethod === "airtel"
                ? "Connexion à Airtel Money en cours..."
                : "Connexion à Orange Money en cours..."}
            </p>

            <p className="text-xs text-gray-400 italic">
              Veuillez patienter, ne fermez pas cette fenêtre.
            </p>
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
            className="bg-white rounded-2xl p-7 max-w-[360px] w-[90%] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 text-center mb-1.5">
              Choisissez votre méthode de paiement
            </h3>

            <p className="text-sm text-gray-500 text-center mb-5">
              Choisissez comment vous voulez payer.
            </p>

            <div className="flex flex-col gap-3">
              {/* Airtel Money */}
              <button
                onClick={() => handlePaymentMethod("airtel")}
                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-red-500 hover:bg-red-50 hover:-translate-y-0.5 hover:shadow-md text-left"
              >
                <div className="w-[50px] h-[50px] rounded-[10px] flex items-center justify-center font-bold text-[11px] text-white bg-[#ed1c24] flex-shrink-0">
                  airtel
                </div>

                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-800">
                    Airtel Money
                  </h4>

                  <p className="text-xs text-gray-500">
                    Payez avec votre portefeuille Airtel.
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

              {/* Orange Money */}
              <button
                onClick={() => handlePaymentMethod("orange")}
                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-orange-500 hover:bg-orange-50 hover:-translate-y-0.5 hover:shadow-md text-left"
              >
                <div className="w-[50px] h-[50px] rounded-[10px] flex items-center justify-center font-bold text-[11px] text-white bg-[#FF6600] flex-shrink-0">
                  Orange
                </div>

                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-800">
                    Orange Money
                  </h4>

                  <p className="text-xs text-gray-500">
                    Payez avec Orange Money.
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
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="block w-full mt-4 p-3 bg-transparent border border-gray-200 rounded-lg text-gray-500 text-sm cursor-pointer transition hover:bg-gray-50"
            >
              Annuler
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
              <svg
                className="w-8 h-8 text-amber-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Configurez votre forfait
            </h3>

            <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
              Vous n'avez pas d'abonnement actif pour ce forfait. Abonnez-vous maintenant pour l'activer.
            </p>

            <button
              onClick={() => {
                setShowConfigureModal(false);
                setShowPaymentModal(true);
              }}
              className="w-full p-3.5 bg-blue-600 text-white rounded-xl text-[15px] font-semibold cursor-pointer mb-2.5 transition hover:bg-blue-700"
            >
              S'abonner maintenant
            </button>

            <button
              onClick={() => setShowConfigureModal(false)}
              className="w-full p-3 bg-transparent text-gray-500 border-[1.5px] border-gray-300 rounded-xl text-sm font-medium cursor-pointer transition hover:border-gray-400 hover:text-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function PackageCard({
  plan,
  onClick,
  onConfigure,
}: {
  plan: PlanCard;
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
          Populaire
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
            <h3 className="font-bold text-lg text-gray-900">{plan.name}</h3>

            <p className="text-gray-500 text-sm">{plan.data}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[13px] line-through text-gray-400 leading-tight">
            {plan.oldPrice}
          </p>

          <p className={`text-2xl font-black ${plan.iconText}`}>
            {plan.promoPrice}{" "}
            <span className="inline-block bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide align-middle ml-1.5">
              PROMO
            </span>
          </p>

          <p className="text-xs text-gray-500">{plan.period}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {plan.features.map((feature, index) => (
          <span
            key={index}
            className={`text-xs ${feature.bg} ${feature.text} px-3 py-1 rounded-full`}
          >
            {feature.label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-[11px] text-gray-500">
          Cliquez pour choisir ce forfait
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onConfigure();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-black border-[1.5px] border-black rounded-lg text-xs font-semibold text-white cursor-pointer transition hover:bg-gray-800"
        >
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          Configurer
        </button>
      </div>
    </div>
  );
}

export default App;
