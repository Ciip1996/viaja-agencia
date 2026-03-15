-- ============================================================
-- Migration 004: Feature modules tables
-- Quote requests, newsletter subscribers, contact submissions
-- ============================================================

-- Quote requests (from chatbot + wizard + contact)
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'wizard',
  status TEXT NOT NULL DEFAULT 'nueva',
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  destination TEXT,
  travel_type TEXT,
  check_in DATE,
  check_out DATE,
  adults INT DEFAULT 2,
  children INT DEFAULT 0,
  budget_range TEXT,
  notes TEXT,
  chat_history JSONB,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  locale TEXT NOT NULL DEFAULT 'es',
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- Contact submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  travel_type TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert quote_requests') THEN
    CREATE POLICY "Public can insert quote_requests" ON quote_requests FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth can manage quote_requests') THEN
    CREATE POLICY "Auth can manage quote_requests" ON quote_requests FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon can read quote_requests') THEN
    CREATE POLICY "Anon can read quote_requests" ON quote_requests FOR SELECT TO anon USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert newsletter') THEN
    CREATE POLICY "Public can insert newsletter" ON newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth can manage newsletter') THEN
    CREATE POLICY "Auth can manage newsletter" ON newsletter_subscribers FOR ALL TO authenticated USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert contact') THEN
    CREATE POLICY "Public can insert contact" ON contact_submissions FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth can manage contact') THEN
    CREATE POLICY "Auth can manage contact" ON contact_submissions FOR ALL TO authenticated USING (true);
  END IF;
END $$;
