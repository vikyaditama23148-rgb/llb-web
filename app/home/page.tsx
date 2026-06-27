'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ScanlineOverlay from '@/components/ScanlineOverlay'
import AudioPlayer from '@/components/AudioPlayer'
import UserCard from '@/components/UserCard'
import GlitchText from '@/components/GlitchText'
import { User } from '@/types'

const TAGLINES = [
  '// komunitas paling tidak jelas sejagat raya',
  '// bukan dark web. tapi juga bukan bright web.',
  '// 100% receh. 0% berguna.',
  '// jika kamu bingung, itu memang tujuannya.',
]

const STATUS_CYCLE = [
  'ENKRIPSI: AES-256-BOONG',
  'FIREWALL: MATI KARENA MALAS',
  'UPTIME: 69 HARI 4 JAM 20 MENIT',
  'USERS ONLINE: CLASSIFIED',
  'LOKASI SERVER: ENTAH DI MANA',
]

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [tagline, setTagline] = useState(TAGLINES[0])
  const [taglineIdx, setTaglineIdx] = useState(0)
  const [statusLine, setStatusLine] = useState(STATUS_CYCLE[0])
  const [photoGlitch, setPhotoGlitch] = useState(false)
  const [photoError, setPhotoError] = useState(false)

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(d => { setUsers(d.data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setTaglineIdx(i => {
        const next = (i + 1) % TAGLINES.length
        setTagline(TAGLINES[next])
        return next
      })
    }, 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      i++
      setStatusLine(STATUS_CYCLE[i % STATUS_CYCLE.length])
    }, 3000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const schedule = () => {
      const delay = 4000 + Math.random() * 3000
      return setTimeout(() => {
        setPhotoGlitch(true)
        setTimeout(() => {
          setPhotoGlitch(false)
          schedule()
        }, 250)
      }, delay)
    }
    const t = schedule()
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="min-h-screen bg-black relative">
      <ScanlineOverlay />
      <AudioPlayer />

      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)' }}
      />

      <div className="relative z-20 max-w-4xl mx-auto px-4 py-6">

        {/* ─── HEADER ─── */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <GlitchText
            text="L.L.B"
            as="h1"
            intensity="medium"
            color="green"
            className="font-vt323 text-7xl md:text-9xl block mb-2"
          />
          <div className="font-terminal text-xs text-green/60 tracking-[0.5em] mb-2">
            LEMES LONGOR BUGGUNG
          </div>
          <motion.div
            key={tagline}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-terminal text-xs text-green/40 h-4"
          >
            {tagline}
          </motion.div>
        </motion.div>

        {/* ─── STATUS BAR ─── */}
        <div className="mb-8 px-4 py-2 border border-green/20 flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full bg-green blink shrink-0"
            style={{ boxShadow: '0 0 6px #00ff41' }}
          />
          <span className="font-terminal text-xs text-green/50 tracking-wider">{statusLine}</span>
        </div>

        {/* ─── FOTO GRUP ─── */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="font-terminal text-xs text-green/40 mb-2 text-center tracking-widest">
            {'>'} CLASSIFIED_PHOTO // IDENTITAS TERENKRIPSI
          </div>

          <div
            style={{
              position: 'relative',
              maxWidth: '700px',
              margin: '0 auto',
              border: '1px solid rgba(0,255,65,0.4)',
              boxShadow: '0 0 30px rgba(0,255,65,0.15)',
            }}
          >
            {/* Corner decorations */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 24, height: 24, borderTop: '2px solid #00ff41', borderLeft: '2px solid #00ff41', zIndex: 10 }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderTop: '2px solid #00ff41', borderRight: '2px solid #00ff41', zIndex: 10 }} />
            <div style={{ position: 'absolute', bottom: 40, left: 0, width: 24, height: 24, borderBottom: '2px solid #00ff41', borderLeft: '2px solid #00ff41', zIndex: 10 }} />
            <div style={{ position: 'absolute', bottom: 40, right: 0, width: 24, height: 24, borderBottom: '2px solid #00ff41', borderRight: '2px solid #00ff41', zIndex: 10 }} />

            {/* Foto */}
            {!photoError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/foto-grup.jpg"
                alt="Foto Grup L.L.B"
                onError={() => setPhotoError(true)}
                style={{
                  width: '100%',
                  display: 'block',
                  filter: photoGlitch
                    ? 'hue-rotate(90deg) saturate(2) brightness(1.3)'
                    : 'grayscale(20%) brightness(0.85) contrast(1.1)',
                  transform: photoGlitch ? 'translateX(4px)' : 'none',
                  transition: photoGlitch ? 'none' : 'filter 0.3s ease',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: '#050505',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '2.5rem' }}>📷</div>
                <div className="font-terminal text-xs tracking-widest" style={{ color: 'rgba(0,255,65,0.2)' }}>
                  FOTO_GRUP.JPG NOT FOUND
                </div>
                <div className="font-terminal text-xs" style={{ color: 'rgba(0,255,65,0.1)' }}>
                  taruh foto di /public/foto-grup.jpg
                </div>
              </div>
            )}

            {/* Scanline overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
              }}
            />

            {/* Label bawah */}
            <div
              className="px-4 py-2 flex items-center justify-between"
              style={{ background: 'rgba(0,0,0,0.85)', borderTop: '1px solid rgba(0,255,65,0.2)' }}
            >
              <span className="font-terminal text-xs tracking-widest" style={{ color: 'rgba(0,255,65,0.5)' }}>
                L.L.B CREW // [CLASSIFIED]
              </span>
              <span className="font-terminal text-xs blink" style={{ color: 'rgba(0,255,65,0.3)' }}>
                ● LIVE
              </span>
            </div>
          </div>

          <div className="font-terminal text-xs text-center mt-2" style={{ color: 'rgba(0,255,65,0.75)' }}>
  // wajah-wajah di atas tidak bertanggung jawab atas kerusakan yang terjadi
</div>
        </motion.div>

        {/* ─── DATABASE HEADER ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-2"
        >
          <div className="font-terminal text-xs text-green/40 mb-1">
            {'>'} SELECT * FROM users ORDER BY created_at DESC;
          </div>
          <div className="font-terminal text-xs text-green/25">
            — {users.length} baris ditemukan. semua dicurigai.
          </div>
        </motion.div>

        {/* ─── TABLE HEADER ─── */}
        <div className="flex items-center gap-4 px-4 py-2 border-b border-t border-green/30 mb-1">
          <span className="text-green/30 text-xs w-8">#ID</span>
          <span className="text-green/30 text-xs w-2" />
          <span className="text-green/50 text-xs flex-1 tracking-widest">USERNAME</span>
          <span className="text-green/30 text-xs hidden sm:block">ALIAS</span>
          <span className="text-green/30 text-xs hidden md:block mr-8">STATUS</span>
        </div>

        {/* ─── USER LIST ─── */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="font-terminal text-green/50 text-sm blink">
              {'>'} MENGAMBIL DATA DARI SERVER GELAP...
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center">
            <div className="font-terminal text-green/40 text-sm">
              {'>'} TIDAK ADA USER. DATABASE KOSONG. SEPI.<br />
              <span className="text-xs text-green/25">// mungkin semua sudah kabur</span>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <UserCard user={user} index={i} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ─── FOOTER ─── */}
        <div className="mt-10 pt-4 border-t border-green/10 text-center">
          <div className="font-terminal text-xs text-green/20 space-y-1">
            <div>// klik nama untuk akses profil // kode rahasia diperlukan</div>
            <div>// L.L.B tidak bertanggung jawab atas kebingungan yang terjadi</div>
            <div className="text-green/10">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</div>
          </div>
        </div>

      </div>
    </main>
  )
}