'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ScanlineOverlay from '@/components/ScanlineOverlay'

const BOOT_LINES: string[] = [
  'INITIALIZING KERNEL v0.0.1-BETA...',
  'LOADING ENCRYPTED MODULES...',
  'BYPASSING FIREWALL... [████████░░] 82%',
  'DECRYPTING NODE CLUSTER...',
  'INJECTING PAYLOAD... DONE',
  'CONNECTING TO SECURE SERVER: 192.168.0.∞',
  'IDENTITY VERIFICATION: BYPASSED',
  'WARNING: UNAUTHORIZED SYSTEM ACCESS DETECTED',
  'TRACING ORIGIN... 7 PROXIES FOUND',
  'OBFUSCATING TRACE ROUTE...',
  '> Selamat datang di tempat yang tidak seharusnya kamu masuki.',
  '> Tapi ya sudah, terlanjur.',
  '> .',
  '> . .',
  '> SISTEM SIAP.',
]

const HIDDEN_TEXTS: string[] = [
  'APA INI?',
  'SIAPA KAMU?',
  'MENGAPA KAMU DI SINI?',
  'INI BUKAN TEMPAT KAMU',
  'PERGI',
  'ATAU MASUK',
  'TERSERAH',
  '...',
]

function getLineColor(line: string): string {
  if (typeof line !== 'string') return '#00aa20'
  if (line.startsWith('WARNING')) return '#ff0040'
  if (line.startsWith('>')) return '#00ff41'
  return '#00aa20'
}

function getLineGlow(line: string): string {
  if (typeof line !== 'string') return 'none'
  if (line.startsWith('>')) return '0 0 6px #00ff41'
  return 'none'
}

export default function GatewayPage() {
  const router = useRouter()
  const [bootLines, setBootLines] = useState<string[]>([])
  const [bootDone, setBootDone] = useState(false)
  const [showEnter, setShowEnter] = useState(false)
  const [entering, setEntering] = useState(false)
  const [floatingTexts, setFloatingTexts] = useState<{ text: string; x: number; y: number; id: number }[]>([])
  const [currentHidden, setCurrentHidden] = useState(0)
  const lineRef = useRef<HTMLDivElement>(null)

  // Boot sequence
  useEffect(() => {
    let i = 0
    const addLine = () => {
      if (i < BOOT_LINES.length) {
        const line = BOOT_LINES[i]
        if (line !== undefined) {
          setBootLines(prev => [...prev, line])
        }
        i++
        setTimeout(addLine, 80 + Math.random() * 120)
      } else {
        setTimeout(() => {
          setBootDone(true)
          setTimeout(() => setShowEnter(true), 800)
        }, 400)
      }
    }
    const timer = setTimeout(addLine, 600)
    return () => clearTimeout(timer)
  }, [])

  // Scroll boot lines
  useEffect(() => {
    lineRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bootLines])

  // Random floating texts
  useEffect(() => {
    if (!bootDone) return
    const interval = setInterval(() => {
      const id = Date.now()
      const text = HIDDEN_TEXTS[Math.floor(Math.random() * HIDDEN_TEXTS.length)] ?? '...'
      setFloatingTexts(prev => [
        ...prev.slice(-8),
        {
          text,
          x: 5 + Math.random() * 85,
          y: 10 + Math.random() * 80,
          id,
        },
      ])
    }, 1500)
    return () => clearInterval(interval)
  }, [bootDone])

  // Cycle hidden text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHidden(c => (c + 1) % HIDDEN_TEXTS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleEnter = () => {
    if (entering) return
    setEntering(true)
    setTimeout(() => router.push('/home'), 1200)
  }

  const currentHiddenText = HIDDEN_TEXTS[currentHidden] ?? '...'

  return (
    <main className="min-h-screen bg-black relative overflow-hidden select-none">
      <ScanlineOverlay />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)' }}
      />

      {/* Floating ghost texts */}
      {bootDone && floatingTexts.map(ft => (
        <div
          key={ft.id}
          className="absolute font-terminal text-xs pointer-events-none z-20"
          style={{
            left: `${ft.x}%`,
            top: `${ft.y}%`,
            color: '#ff0040',
            opacity: 0.12,
            textShadow: '0 0 6px #ff0040',
            animation: 'flicker 2s ease-in-out forwards',
            letterSpacing: '0.3em',
          }}
        >
          {ft.text}
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-30 min-h-screen flex flex-col">

        {/* Top bar */}
        <div className="border-b border-green/20 px-4 py-2 flex items-center gap-4">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: '#ff0040', boxShadow: '0 0 6px #ff0040' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#ffaa00', boxShadow: '0 0 6px #ffaa00' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#00ff41', boxShadow: '0 0 6px #00ff41' }} />
          </div>
          <span className="font-terminal text-xs text-green/40 tracking-widest">
            TERMINAL — bash — 80×24
          </span>
          <span className="ml-auto font-terminal text-xs text-red-blood/60 blink">
            ● REC
          </span>
        </div>

        {/* Center logo (saat loading) */}
        {!bootDone && bootLines.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div
              className="font-vt323 text-8xl md:text-9xl text-green mb-4 flicker"
              style={{ textShadow: '0 0 40px #00ff41, 0 0 80px #00ff41' }}
            >
              L.L.B
            </div>
            <div className="font-terminal text-xs text-green/40 tracking-[0.5em] blink">
              INITIALIZING...
            </div>
          </div>
        )}

        {/* Boot terminal */}
        {bootLines.length > 0 && (
          <div className="flex-1 px-6 py-4 max-w-3xl mx-auto w-full">
            {/* Logo kecil setelah boot */}
            {bootDone && (
              <div className="text-center mb-6">
                <div
                  className="font-vt323 text-6xl md:text-7xl text-green flicker"
                  style={{ textShadow: '0 0 30px #00ff41, 0 0 60px #00ff41' }}
                >
                  L.L.B
                </div>
                <div className="font-terminal text-xs text-green/30 tracking-[0.4em] mt-1">
                  LEMES LONGOR BUGGUNG
                </div>
              </div>
            )}

            {/* Terminal output */}
            <div className="font-terminal text-xs space-y-0.5 max-h-64 overflow-y-auto no-scrollbar">
              {bootLines.map((line, i) => (
                <div
                  key={i}
                  className="flex gap-2"
                  style={{
                    color: getLineColor(line),
                    textShadow: getLineGlow(line),
                  }}
                >
                  {typeof line === 'string' && !line.startsWith('>') && (
                    <span className="text-green/30 shrink-0">$</span>
                  )}
                  <span>{line}</span>
                </div>
              ))}
              <div ref={lineRef} />

              {/* Cursor */}
              {!bootDone && (
                <div className="flex gap-2">
                  <span className="text-green/30">$</span>
                  <span className="blink text-green">█</span>
                </div>
              )}
            </div>

            {/* Enter button */}
            {showEnter && !entering && (
              <div className="mt-10 text-center">
                <div className="font-terminal text-xs text-green/40 mb-2 tracking-widest">
                  {currentHiddenText}
                </div>

                <div className="mb-6 flex justify-center gap-3">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-green/20" />
                  ))}
                </div>

                <button
                  onClick={handleEnter}
                  className="btn-terminal text-lg px-12 py-4 tracking-[0.3em]"
                >
                  [ MASUK ]
                </button>

                <div className="mt-4 font-terminal text-xs text-green/25">
                  // dengan menekan tombol ini, kamu setuju untuk tidak mengerti apa-apa
                </div>
              </div>
            )}

            {/* Entering animation */}
            {entering && (
              <div className="mt-10 text-center">
                <div
                  className="font-terminal text-xl text-green tracking-widest blink"
                  style={{ textShadow: '0 0 20px #00ff41' }}
                >
                  MEMASUKI SISTEM...
                </div>
                <div className="mt-3 font-terminal text-xs text-green/40">
                  JANGAN PANIK. ATAU PANIK. SAMA AJA.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom warning */}
        <div className="border-t border-green/10 px-4 py-2">
          <div className="font-terminal text-xs text-green/20 text-center tracking-widest">
            ⚠ AKSES TIDAK SAH AKAN DILACAK DAN DIABAIKAN ⚠
          </div>
        </div>
      </div>

      {/* Red flash on enter */}
      {entering && (
        <div
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background: 'rgba(255,0,64,0.15)',
            animation: 'flicker 0.1s ease-in-out infinite',
          }}
        />
      )}
    </main>
  )
}