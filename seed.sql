-- ============================================================
-- L.L.B — SEED DATA
-- 5 user contoh absurd untuk testing
-- Jalankan SETELAH schema.sql
-- ============================================================

INSERT INTO users (username, secret_code, full_name, bio, status, alias, quote)
VALUES
  (
    'pakde_glodok',
    'nasi1234',
    'Bambang Sulistyono Prawirodihardjo',
    'Pensiunan tukang servis antena parabola. Sekarang jualan gorengan digital.',
    'Lagi nonton sinetron sambil ngoding',
    'The Legend of Glodok',
    'Hidup itu seperti kabel antena — kalau longor, sinyalnya jelek.'
  ),
  (
    'mbok_darmi_007',
    'gepuk666',
    'Darminah Susiloningsih',
    'Ibu rumah tangga yang nyasar ke internet. Hobi: forward pesan berantai WhatsApp.',
    'Masak sambil scrolling TikTok',
    'Secret Agent Nasi Uduk',
    'Saya tidak tahu apa itu JavaScript, tapi saya sudah klik Setuju di 47 website.'
  ),
  (
    'joko_misterius',
    'kopi4ever',
    NULL,
    'Tidak ada yang tahu siapa Joko. Bahkan Joko tidak tahu siapa Joko.',
    'Menghilang',
    '[REDACTED]',
    NULL
  ),
  (
    'si_pitung_digital',
    'rampok99',
    'Pitung bin Rakhmat',
    'Robin Hood versi WiFi. Nyolong bandwidth tetangga untuk kepentingan masyarakat.',
    'Nyambung ke WiFi orang',
    'Hacker Kampung Marunda',
    'Satu bar sinyal lebih berharga dari satu batang emas.'
  ),
  (
    'neng_ngambek',
    'cemberut7',
    'Sari Dewi Kusumawati',
    'Profesional ngambek. Sudah ngambek di 14 platform berbeda dalam satu minggu.',
    'Ngambek (lagi)',
    'Queen of Side Eye',
    'Ngambek itu seni. Dan saya adalah Picasso-nya.'
  );
