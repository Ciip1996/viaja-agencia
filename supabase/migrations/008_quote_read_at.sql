-- Migration 008: Add read_at tracking to quote_requests
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ DEFAULT NULL;
