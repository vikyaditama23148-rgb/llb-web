'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ScanlineOverlay from '@/components/ScanlineOverlay'
import AudioPlayer from '@/components/AudioPlayer'
import GlitchText from '@/components/GlitchText'
import { User } from '@/types'
import Link from 'next/link'

const TAGLINES = [
  '// kamu tidak seharusnya ada di sini',
  '// identitasmu sedang direkam',
  '// 100% receh. 0% berguna. 666% mencurigakan.',
  '// jika kamu bingung, itu memang tujuannya.',
  '// kami tahu kamu sedang membaca ini',
]

const STATUS_CYCLE = [
  '⚠ SISTEM TIDAK STABIL — LANJUTKAN DENGAN RISIKO SENDIRI',
  '🔴 KONEKSI AMAN: TIDAK. TAPI TIDAK APA-APA.',
  '👁 KAMU SEDANG DIPANTAU OLEH 1 ENTITAS TIDAK DIKENAL',
  '⚡ UPTIME: 666 HARI 6 JAM 6 MENIT',
  '🕳 LOKASI SERVER: TIDAK ADA. ATAU ADA. TERSERAH.',
  '💀 PENGGUNA AKTIF: [DIKLASIFIKASIKAN]',
]

const AMBIENT_TEXTS = [
  'MEREKA TAHU', 'SIAPA KAMU', 'MENGAPA KAU KEMBALI',
  '01001100 01001100 01000010', 'ERROR 666', 'JANGAN LIHAT KE ATAS',
  'SUDAH TERLAMBAT', '̴̧̢̛͓̙̗̲͔͚̜̣̖̰̮̱͖͍̩̜̻̙̻͇̤̣̞̭̦̯͉͙̻̗͓̣̞̱͈͈͓̲̭̹͕͙̦̰̞̺̼̰̹̺̗̩͔̯͈̲̝̰̟͓̮̯̮͊̓̾͌̈́̆̈́̀̈͂̓̾̄̇̈́̆̿̇̀̃̈́̊̂͑̄͗̑̋̿̑͌̅̅̓̋̑̌͒̈́͑͒̈́̀͊̒̌͑̀̈́̈́̓̿̑̒̾̈́̓͒̃̃̔̓̉̈́̈́̏̀̐̈͒̈̈́̓͘͘͘̚͘͜͜͝͠͝͝',
]

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [tagline, setTagline] = useState(TAGLINES[0])
  const [statusLine, setStatusLine] = useState(STATUS_CYCLE[0])
  const [photoGlitch, setPhotoGlitch] = useState(false)
  const [photoError, setPhotoError] = useState(false)
  const [ambientIdx, setAmbientIdx] = useState(0)
  const [tick, setTick] = useState(0)
  const [floaters, setFloaters] = useState<{id:number;x:number;y:number;text:string}[]>([])

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(d => { setUsers(d.data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 100)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setTagline(TAGLINES[Math.floor(Math.random() * TAGLINES.length)])
    }, 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    let i = 0
    const t = setInterval(() => { i++; setStatusLine(STATUS_CYCLE[i % STATUS_CYCLE.length]) }, 3500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setAmbientIdx(i => (i + 1) % AMBIENT_TEXTS.length)
    }, 2500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const schedule = () => {
      const delay = 3000 + Math.random() * 4000
      return setTimeout(() => {
        setPhotoGlitch(true)
        setTimeout(() => { setPhotoGlitch(false); schedule() }, 300)
      }, delay)
    }
    const t = schedule()
    return () => clearTimeout(t)
  }, [])

  // Floating ghost text
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const id = Date.now()
        const text = AMBIENT_TEXTS[Math.floor(Math.random() * AMBIENT_TEXTS.length)] ?? '...'
        setFloaters(prev => [
          ...prev.slice(-5),
          { id, x: 5 + Math.random() * 80, y: 10 + Math.random() * 70, text }
        ])
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: '#000' }}>
      <ScanlineOverlay />
      <AudioPlayer />

      {/* Deep vignette */}
      <div className="fixed inset-0 pointer-events-none z-10" style={{
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 20%, rgba(0,0,0,0.97) 100%)'
      }} />

      {/* Red corner bleeds */}
      <div className="fixed top-0 left-0 w-64 h-64 pointer-events-none z-5" style={{
        background: 'radial-gradient(ellipse at top left, rgba(255,0,64,0.07) 0%, transparent 70%)'
      }} />
      <div className="fixed bottom-0 right-0 w-64 h-64 pointer-events-none z-5" style={{
        background: 'radial-gradient(ellipse at bottom right, rgba(255,0,64,0.07) 0%, transparent 70%)'
      }} />

      {/* Floating ghost texts */}
      {floaters.map(f => (
        <div key={f.id} className="fixed pointer-events-none z-15 font-terminal"
          style={{
            left: `${f.x}%`, top: `${f.y}%`,
            color: 'rgba(255,0,64,0.08)',
            fontSize: '11px', letterSpacing: '0.3em',
            animation: 'flicker 3s ease-in-out forwards',
          }}
        >{f.text}</div>
      ))}

      <div className="relative z-20 max-w-3xl mx-auto px-4 py-6">

        {/* ─── HEADER ─── */}
        <motion.div className="text-center mb-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

          {/* Warning bar */}
          <div className="mb-4 px-3 py-1 flex items-center justify-center gap-2"
            style={{ border: '1px solid rgba(255,0,64,0.3)', background: 'rgba(255,0,64,0.04)' }}>
            <span className="blink" style={{ color: '#ff0040', fontSize: '10px' }}>⚠</span>
            <span className="font-terminal text-xs" style={{ color: 'rgba(255,0,64,0.8)', letterSpacing: '0.2em' }}>
              ANDA MEMASUKI ZONA TIDAK AMAN
            </span>
            <span className="blink" style={{ color: '#ff0040', fontSize: '10px' }}>⚠</span>
          </div>

          <GlitchText text="L.L.B" as="h1" intensity="high" color="green"
            className="font-vt323 block mb-1"
            style={{ fontSize: 'clamp(4rem, 18vw, 7rem)', textShadow: '0 0 40px #00ff41, 0 0 80px rgba(0,255,65,0.3)' } as React.CSSProperties}
          />

          <div className="font-terminal text-xs md:text-sm text-green mb-2" style={{ letterSpacing: '0.5em', opacity: 0.7 }}>
            L E M E S · L O N G O R · B U G G U N G
          </div>

          {/* Ambient ghost text */}
          <motion.div key={ambientIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="font-terminal text-xs mb-1" style={{ color: 'rgba(255,0,64,0.5)', letterSpacing: '0.3em' }}>
            {AMBIENT_TEXTS[ambientIdx]}
          </motion.div>

          <motion.div key={tagline} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="font-terminal text-xs text-green" style={{ opacity: 0.55 }}>
            {tagline}
          </motion.div>
        </motion.div>

        {/* ─── STATUS BAR ─── */}
        <div className="mb-6 px-3 py-2 flex items-center gap-2"
          style={{ border: '1px solid rgba(255,0,64,0.25)', background: 'rgba(5,0,0,0.8)' }}>
          <span className="w-2 h-2 rounded-full shrink-0 blink"
            style={{ background: '#ff0040', boxShadow: '0 0 6px #ff0040' }} />
          <span className="font-terminal text-xs text-green" style={{ opacity: 0.85 }}>{statusLine}</span>
        </div>

        {/* ─── FOTO GRUP ─── */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="font-terminal text-xs text-green mb-2 text-center" style={{ opacity: 0.5, letterSpacing: '0.3em' }}>
            ━━━━━━━━━━ CLASSIFIED_DOC #001 ━━━━━━━━━━
          </div>

          <div className="relative mx-auto" style={{
            maxWidth: '680px',
            border: '1px solid rgba(255,0,64,0.3)',
            boxShadow: '0 0 40px rgba(255,0,64,0.08), 0 0 2px rgba(0,255,65,0.2)',
          }}>
            {/* Corner brackets merah */}
            {[
              { top: 0, left: 0, borderTop: '2px solid #ff0040', borderLeft: '2px solid #ff0040' },
              { top: 0, right: 0, borderTop: '2px solid #ff0040', borderRight: '2px solid #ff0040' },
              { bottom: 38, left: 0, borderBottom: '2px solid #ff0040', borderLeft: '2px solid #ff0040' },
              { bottom: 38, right: 0, borderBottom: '2px solid #ff0040', borderRight: '2px solid #ff0040' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'absolute', width: 20, height: 20, zIndex: 10, ...s }} />
            ))}

            {!photoError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/foto-grup.jpg" alt="Foto Grup L.L.B" onError={() => setPhotoError(true)}
                style={{
                  width: '100%', display: 'block',
                  filter: photoGlitch
                    ? 'hue-rotate(180deg) saturate(3) brightness(1.5) contrast(2)'
                    : 'grayscale(60%) brightness(0.7) contrast(1.3) sepia(20%)',
                  transform: photoGlitch ? `translateX(${Math.random() > 0.5 ? 6 : -6}px) skewX(${Math.random() > 0.5 ? 1 : -1}deg)` : 'none',
                  transition: photoGlitch ? 'none' : 'filter 0.5s ease',
                }}
              />
            ) : (
              <div style={{ width: '100%', aspectRatio: '16/9', background: '#030303', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ fontSize: '2rem', filter: 'grayscale(1)' }}>📷</div>
                <div className="font-terminal text-sm text-green" style={{ opacity: 0.4 }}>FOTO_GRUP.JPG</div>
              </div>
            )}

            {/* Dark scanline overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
            }} />

            {/* Red tint overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'linear-gradient(180deg, rgba(255,0,64,0.04) 0%, rgba(0,0,0,0.3) 100%)',
            }} />

            <div className="px-3 py-2 flex items-center justify-between" style={{
              background: 'rgba(0,0,0,0.95)', borderTop: '1px solid rgba(255,0,64,0.2)'
            }}>
              <span className="font-terminal text-xs text-green" style={{ opacity: 0.6 }}>
                [IDENTITAS TERENKRIPSI] — L.L.B COLLECTIVE
              </span>
              <span className="font-terminal text-xs blink" style={{ color: '#ff0040' }}>● CLASSIFIED</span>
            </div>
          </div>

          <div className="font-terminal text-xs text-center mt-2 text-green" style={{ opacity: 0.4 }}>
            // wajah-wajah di atas tidak bertanggung jawab atas kerusakan yang terjadi
          </div>
        </motion.div>

        {/* ─── DATABASE SECTION ─── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>

          <div className="mb-3 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,0,64,0.2)' }} />
            <span className="font-terminal text-xs" style={{ color: 'rgba(255,0,64,0.6)', letterSpacing: '0.3em' }}>
              DATABASE LEAK
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,0,64,0.2)' }} />
          </div>

          <div className="font-terminal text-xs text-green mb-1" style={{ opacity: 0.5 }}>
            {'>'} SELECT * FROM users; — {users.length} record ditemukan
          </div>
          <div className="font-terminal text-xs mb-4" style={{ color: 'rgba(255,0,64,0.5)' }}>
            {'>'} semua identitas terekspos. semua dicurigai.
          </div>

          {/* User cards */}
          {loading ? (
            <div className="py-12 text-center font-terminal text-sm text-green blink" style={{ opacity: 0.6 }}>
              {'>'} mengambil data dari server yang tidak seharusnya ada...
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center font-terminal text-sm text-green" style={{ opacity: 0.5 }}>
              {'>'} tidak ada data. atau ada, tapi disembunyikan.
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user, i) => (
                <motion.div key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <Link href={`/user/${user.id}`}>
                    <div className="group cursor-pointer transition-all duration-200"
                      style={{ border: '1px solid rgba(0,255,65,0.15)', background: 'rgba(0,5,0,0.7)' }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLDivElement
                        el.style.borderColor = 'rgba(0,255,65,0.45)'
                        el.style.background = 'rgba(0,255,65,0.04)'
                        el.style.boxShadow = '0 0 20px rgba(0,255,65,0.06), inset 0 0 20px rgba(0,255,65,0.02)'
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLDivElement
                        el.style.borderColor = 'rgba(0,255,65,0.15)'
                        el.style.background = 'rgba(0,5,0,0.7)'
                        el.style.boxShadow = 'none'
                      }}
                    >
                      <div className="p-3 flex gap-3 items-start">

                        {/* Avatar */}
                        <div className="shrink-0 relative" style={{
                          width: 56, height: 56,
                          border: '1px solid rgba(0,255,65,0.25)',
                          overflow: 'hidden',
                          background: '#030303',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {user.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatar_url} alt={user.username}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%) brightness(0.8)' }}
                            />
                          ) : (
                            <span style={{ fontSize: '1.5rem', opacity: 0.3, filter: 'grayscale(1)' }}>👤</span>
                          )}
                          {/* Red overlay on avatar */}
                          <div className="absolute inset-0" style={{ background: 'rgba(255,0,64,0.06)' }} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          {/* Username */}
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-terminal text-xs" style={{ color: 'rgba(255,0,64,0.5)' }}>
                              #{String(i + 1).padStart(3, '0')}
                            </span>
                            <span className="font-terminal text-sm md:text-base text-green uppercase tracking-widest"
                              style={{ textShadow: '0 0 8px rgba(0,255,65,0.4)' }}>
                              {user.username}
                            </span>
                          </div>

                          {user.alias && (
                            <div className="font-terminal text-xs mb-0.5" style={{ color: 'rgba(0,255,65,0.7)' }}>
                              ▸ alias: {user.alias}
                            </div>
                          )}
                          {user.status && (
                            <div className="font-terminal text-xs mb-0.5" style={{ color: 'rgba(0,255,65,0.65)' }}>
                              ▸ status: {user.status}
                            </div>
                          )}
                          {user.quote && (
                            <div className="font-terminal text-xs mt-1 italic"
                              style={{
                                color: 'rgba(0,255,65,0.55)',
                                borderLeft: '2px solid rgba(255,0,64,0.3)',
                                paddingLeft: '8px',
                                wordBreak: 'break-word',
                              }}>
                              "{user.quote}"
                            </div>
                          )}
                        </div>

                        {/* Lock icon */}
                        <div className="shrink-0 self-center font-terminal text-xs"
                          style={{ color: 'rgba(255,0,64,0.5)' }}>
                          🔒
                        </div>
                      </div>

                      {/* Card footer */}
                      <div className="px-3 py-1 flex justify-between items-center"
                        style={{ borderTop: '1px solid rgba(0,255,65,0.08)', background: 'rgba(0,0,0,0.4)' }}>
                        <span className="font-terminal" style={{ fontSize: '10px', color: 'rgba(0,255,65,0.35)' }}>
                          {user.id.slice(0, 12).toUpperCase()}...
                        </span>
                        <span className="font-terminal" style={{ fontSize: '10px', color: 'rgba(255,0,64,0.5)' }}>
                          [ AKSES TERKUNCI → ]
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ─── FOOTER ─── */}
        <div className="mt-10 pt-4 text-center space-y-2" style={{ borderTop: '1px solid rgba(255,0,64,0.1)' }}>
          <div className="font-terminal text-xs text-green" style={{ opacity: 0.45 }}>
            // klik kartu untuk akses profil // butuh kode rahasia
          </div>
          <div className="font-terminal text-xs" style={{ color: 'rgba(255,0,64,0.35)' }}>
            // L.L.B tidak bertanggung jawab atas kebingungan, ketakutan, atau eksistensial crisis yang terjadi
          </div>
          <div style={{ color: 'rgba(255,0,64,0.1)', fontSize: '12px', letterSpacing: '0.1em' }}>
            ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
          </div>
        </div>

      </div>
    </main>
  )
}