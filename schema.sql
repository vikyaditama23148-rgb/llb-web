-- ============================================================
-- L.L.B — Lemes Longor Buggung
-- Jalankan file ini di Supabase SQL Editor
-- ============================================================

-- 1. Buat tabel users
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  secret_code TEXT NOT NULL,
  full_name TEXT,
  bio TEXT,
  status TEXT,
  alias TEXT,
  quote TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Row Level Security (biarkan publik bisa baca & update — ini web santai)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow public update" ON users
  FOR UPDATE USING (true);

-- 3. Index untuk performa
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================================
-- STORAGE: Buat bucket "avatars" secara manual di Supabase Dashboard
-- Storage → New bucket → nama: avatars → Public: ON
-- Atau jalankan ini (mungkin perlu akses service role):
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('avatars', 'avatars', true)
-- ON CONFLICT DO NOTHING;

-- Policy untuk storage avatars
-- Jalankan ini setelah bucket dibuat:
CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Public upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Public update avatars" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars');
