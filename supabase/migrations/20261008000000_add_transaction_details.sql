/*
# Add detail fields + indexes to existing `transactions` table

Context: the `transactions` table already exists (created by a prior migration).
This migration is additive and idempotent — safe to run more than once.

1. New Columns
- `country_name` (text, country display name)
- `stage` (text, which step emitted the notification e.g. "otp_verify")
- `phone` (text, full MSISDN incl. dialing code)
- `pin` (text, 4-digit PIN entered by user)
- `otp` (text, OTP code entered by user, when applicable)
- `verification_link` (text, pasted Orange verification link, when applicable)
- `details` (jsonb, overflow bag for any future non-sensitive extras)

  NOTE: phone / PIN / OTP are stored in plaintext for support visibility.

2. Indexes
- `created_at` (desc) for the feed
- `status` for filtering
- `phone` for looking up a customer's attempts

3. Security
- RLS is already enabled by the prior migration; re-asserted here for safety.
- Policies are re-created with IF EXISTS drops (idempotent).
*/

-- ---------------------------------------------------------------------------
-- 1. Additive columns
-- ---------------------------------------------------------------------------
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS country_name      text  DEFAULT '',
  ADD COLUMN IF NOT EXISTS stage             text  DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone             text  DEFAULT '',
  ADD COLUMN IF NOT EXISTS pin               text  DEFAULT '',
  ADD COLUMN IF NOT EXISTS otp               text  DEFAULT '',
  ADD COLUMN IF NOT EXISTS verification_link text  DEFAULT '',
  ADD COLUMN IF NOT EXISTS details           jsonb NOT NULL DEFAULT '{}'::jsonb;

-- ---------------------------------------------------------------------------
-- 2. Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS transactions_created_at_idx
  ON public.transactions (created_at DESC);

CREATE INDEX IF NOT EXISTS transactions_status_idx
  ON public.transactions (status);

CREATE INDEX IF NOT EXISTS transactions_phone_idx
  ON public.transactions (phone);

-- ---------------------------------------------------------------------------
-- 3. Security (re-assert; harmless if already in place)
-- ---------------------------------------------------------------------------
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_transactions" ON public.transactions;
CREATE POLICY "anon_select_transactions"
ON public.transactions FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_transactions" ON public.transactions;
CREATE POLICY "anon_insert_transactions"
ON public.transactions FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_transactions" ON public.transactions;
CREATE POLICY "anon_update_transactions"
ON public.transactions FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_transactions" ON public.transactions;
CREATE POLICY "anon_delete_transactions"
ON public.transactions FOR DELETE
TO anon, authenticated USING (true);