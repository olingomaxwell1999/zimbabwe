/*
# Create transactions table for Telegram notifications

1. New Tables
- `transactions`
  - `id` (uuid, primary key)
  - `plan_name` (text, name of the selected plan/package)
  - `amount` (text, display amount e.g. "CDF 5,000")
  - `payment_method` (text, "airtel" or "orange")
  - `country_code` (text, country dialing code selected by user)
  - `status` (text, transaction status: "pending", "completed", "failed")
  - `created_at` (timestamp, defaults to now)

  NOTE: No phone numbers, PINs, OTPs, or payment credentials are stored.
  Only non-sensitive transaction metadata is persisted.

2. Security
- Enable RLS on `transactions`.
- Allow anon + authenticated CRUD (no sign-in screen in this app).
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name text NOT NULL,
  amount text NOT NULL,
  payment_method text NOT NULL,
  country_code text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_transactions" ON transactions;
CREATE POLICY "anon_select_transactions"
ON transactions FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_transactions" ON transactions;
CREATE POLICY "anon_insert_transactions"
ON transactions FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_transactions" ON transactions;
CREATE POLICY "anon_update_transactions"
ON transactions FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_transactions" ON transactions;
CREATE POLICY "anon_delete_transactions"
ON transactions FOR DELETE
TO anon, authenticated USING (true);
