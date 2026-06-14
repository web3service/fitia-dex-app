-- ============================================================
-- FITIA PRO MINER — Supabase Database Schema
-- À exécuter dans l'éditeur SQL de Supabase (SQL Editor)
-- ============================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  wallet_address  TEXT    NOT NULL UNIQUE,
  username        TEXT,
  email           TEXT,
  avatar_url      TEXT,
  referral_code   TEXT    UNIQUE,
  referred_by     TEXT,
  level           INTEGER DEFAULT 0,
  total_invested  NUMERIC DEFAULT 0,
  total_earned    NUMERIC DEFAULT 0,
  machines_count  INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 2. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  wallet_address  TEXT    NOT NULL,
  tx_type         TEXT    NOT NULL,
  token_from      TEXT,
  token_to        TEXT,
  amount_from     NUMERIC,
  amount_to       NUMERIC,
  tx_hash         TEXT,
  status          TEXT    DEFAULT 'pending',
  block_number    BIGINT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 3. ACTIVITY LOG TABLE
CREATE TABLE IF NOT EXISTS activity_log (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  wallet_address  TEXT    NOT NULL,
  action          TEXT    NOT NULL,
  details         TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 4. REFERRAL COMMISSIONS TABLE
CREATE TABLE IF NOT EXISTS referral_commissions (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  referrer_addr   TEXT    NOT NULL,
  referred_addr   TEXT    NOT NULL,
  tx_hash         TEXT,
  commission_type TEXT,
  amount_fta      NUMERIC DEFAULT 0,
  amount_usdt     NUMERIC DEFAULT 0,
  status          TEXT    DEFAULT 'pending',
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_wallet      ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_tx_wallet         ON transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_tx_type           ON transactions(tx_type);
CREATE INDEX IF NOT EXISTS idx_tx_created        ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_wallet   ON activity_log(wallet_address);
CREATE INDEX IF NOT EXISTS idx_activity_created  ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ref_referrer      ON referral_commissions(referrer_addr);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Enable on all tables
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_commissions ENABLE ROW LEVEL SECURITY;

-- === USERS POLICIES ===
-- Anyone can read public profile fields
CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- === TRANSACTIONS POLICIES ===
-- Users can read their own transactions
CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can insert their own transactions
CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can update their own transactions (for status changes)
CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- === ACTIVITY LOG POLICIES ===
CREATE POLICY "Users can read own activity"
  ON activity_log FOR SELECT
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own activity"
  ON activity_log FOR INSERT
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- === REFERRAL POLICIES ===
CREATE POLICY "Referrers can read their commissions"
  ON referral_commissions FOR SELECT
  USING (referrer_addr = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert commissions"
  ON referral_commissions FOR INSERT
  WITH CHECK (referrer_addr = current_setting('request.jwt.claims', true)::json->>'sub');

-- ============================================================
-- HELPER: Auto-update updated_at on users
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- VIEW: Leaderboard (public)
-- ============================================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  wallet_address,
  COALESCE(username, 'Anonymous Miner') AS username,
  COALESCE(level, 0) AS level,
  COALESCE(total_earned, 0) AS total_earned,
  COALESCE(total_invested, 0) AS total_invested,
  COALESCE(machines_count, 0) AS machines_count,
  last_login
FROM users
WHERE is_active = true
ORDER BY total_earned DESC;
