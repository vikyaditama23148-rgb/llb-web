# L.L.B — Lemes Longor Buggung 🕵️

> *Web komunitas paling tidak jelas sejagat raya.*

---

## 🚀 SETUP DARI NOL SAMPAI JALAN

### 1. Clone / Download Project

```bash
# kalau dari git
git clone <repo-url> llb-web
cd llb-web

# atau ekstrak ZIP dan masuk ke foldernya
cd llb-web
```

---

### 2. Setup Supabase

#### a. Buat Project Baru
1. Buka [https://supabase.com](https://supabase.com) → **New Project**
2. Isi nama project (contoh: `llb-web`), pilih region terdekat, set password database
3. Tunggu project siap (1-2 menit)

#### b. Jalankan Schema SQL
1. Di dashboard Supabase → **SQL Editor** → **New Query**
2. Copy-paste isi file `schema.sql` → klik **Run**

#### c. Buat Storage Bucket
1. Di dashboard Supabase → **Storage** → **New bucket**
2. Nama bucket: `avatars`
3. **Public bucket**: ✅ ON (centang)
4. Klik **Create bucket**

#### d. Ambil API Keys
1. Di dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** (contoh: `https://abcdefgh.supabase.co`)
   - **anon public key** (string panjang)

---

### 3. Isi File .env.local

```bash
# Di folder project, buat file .env.local
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 4. Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

---

### 5. Upload File Audio MP3

1. Taruh file MP3 kamu di folder: `public/sounds/`
2. Nama file HARUS: `theme.mp3`
3. Bebas pakai lagu apa saja — rekomendasi: lagu horor, ambient gelap, atau gamelan error

```
public/
  sounds/
    theme.mp3  ← taruh di sini
```

---

### 6. (Opsional) Import Seed Data

Kalau mau langsung ada user contoh untuk testing:

1. Buka **SQL Editor** di Supabase
2. Copy-paste isi `seed.sql` → klik **Run**

User yang tersedia beserta kode rahasianya:

| Username | Kode Rahasia |
|---|---|
| `pakde_glodok` | `nasi1234` |
| `mbok_darmi_007` | `gepuk666` |
| `joko_misterius` | `kopi4ever` |
| `si_pitung_digital` | `rampok99` |
| `neng_ngambek` | `cemberut7` |

---

### 7. Jalankan Project

```bash
npm run dev
```

Buka browser: [http://localhost:3000](http://localhost:3000)

---

## 📁 STRUKTUR PROJECT

```
llb-web/
├── app/
│   ├── page.tsx              ← Gateway/pintu masuk misterius
│   ├── home/
│   │   └── page.tsx          ← Halaman utama daftar user
│   ├── user/
│   │   └── [id]/
│   │       └── page.tsx      ← Halaman profil + kode rahasia
│   ├── api/
│   │   ├── users/route.ts    ← GET semua user
│   │   └── user/[id]/route.ts← GET, PUT profil user
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── GlitchText.tsx        ← Efek teks glitch
│   ├── ScanlineOverlay.tsx   ← CRT scanline + noise
│   ├── UserCard.tsx          ← Card nama user
│   ├── SecretCodeModal.tsx   ← Modal kode rahasia
│   ├── ProfileEditor.tsx     ← Form edit profil
│   └── AudioPlayer.tsx       ← Auto-play audio
├── lib/
│   └── supabase.ts           ← Supabase client
├── types/
│   └── index.ts              ← TypeScript types
├── public/
│   └── sounds/
│       └── theme.mp3         ← [UPLOAD SENDIRI]
├── schema.sql                ← SQL untuk Supabase
├── seed.sql                  ← Data contoh
└── .env.local.example        ← Template env
```

---

## 🛠️ TAMBAH USER BARU

Bisa via SQL Editor di Supabase:

```sql
INSERT INTO users (username, secret_code, full_name, bio, status, alias, quote)
VALUES (
  'username_kamu',
  'kode_rahasia_kamu',
  'Nama Lengkap Kamu',
  'Bio singkat kamu',
  'Status mood kamu',
  'Alias lucu kamu',
  'Quote absurd kamu'
);
```

---

## ⚠️ TROUBLESHOOTING

**Audio tidak bunyi?**
Klik tombol `[ ♪ OFF ]` di pojok kanan bawah. Browser memblokir autoplay — butuh interaksi user dulu.

**Foto tidak bisa diupload?**
Pastikan bucket `avatars` di Supabase sudah **public** dan policy storage sudah dijalankan.

**Data tidak muncul?**
Cek `.env.local` — pastikan URL dan key Supabase benar.

**Efek glitch tidak kelihatan?**
Pastikan internet aktif (font Google Fonts perlu download pertama kali).

---

## 🎨 KUSTOMISASI

- **Warna:** Edit variabel di `app/globals.css` bagian `:root`
- **Teks gateway:** Edit array `BOOT_LINES` di `app/page.tsx`
- **Tagline:** Edit array `TAGLINES` di `app/home/page.tsx`
- **Audio:** Ganti `public/sounds/theme.mp3` dengan file lain

---

*// L.L.B tidak bertanggung jawab atas kebingungan, kedutan mata, atau kerusakan monitor yang terjadi akibat penggunaan web ini.*
