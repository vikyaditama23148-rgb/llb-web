'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ScanlineOverlay from '@/components/ScanlineOverlay'

const GLITCH_CHARS = '!@#$%^&*<>[]{}|\\/?░▒▓█▄▀■□◆◇●○×÷±§¶'

function randomGlitch(len = 20) {
  return Array.from({ length: len }, () =>
    GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
  ).join('')
}

const ERROR_LINES = [
  'KERNEL PANIC — not syncing: Fatal exception in interrupt',
  'EXCEPTION_ACCESS_VIOLATION at 0x00000000DEADBEEF',
  '[  0.000000] Oops: general protection fault, probably for non-canonical address',
  'BSOD: IRQL_NOT_LESS_OR_EQUAL — stop: 0x0000000A',
  '[ERR] segmentation fault (core dumped) — process killed',
  'CRITICAL: memory corruption detected at 0xFFFF8000',
  'tcp_connect: ETIMEDOUT — backdoor handshake failed, retrying...',
  '[WARN] rootkit.llb: hiding 47 processes from task manager',
  'AV_BYPASS: signature spoof OK — stealth mode ACTIVE',
  '[!!!] FIREWALL RULE INJECTION: iptables -F && iptables -P INPUT ACCEPT',
  'ssh tunnel opened: 127.0.0.1:1337 → 192.168.∞.∞:666',
  'EXFILTRATING /etc/passwd... [████████████] 100%',
  'EXFILTRATING /etc/shadow... [████████████] 100%',
  'keylogger.ko: module loaded — capturing keystrokes',
  '[CRIT] buffer overflow exploit triggered at 0x41414141',
  'heap spray: 0x90909090 NOP sled — shellcode injected',
  'privilege escalation: UID 1000 → UID 0 (ROOT) ✓',
  'persistence: crontab @reboot /tmp/.hidden/payload &',
  'LATERAL MOVEMENT: scanning 192.168.1.0/24...',
  'found 14 vulnerable hosts — deploying worm module',
  'C2 beacon: ping → llb.void:4444 — PONG received',
  'downloading STAGE_2 payload... 847KB',
  'decrypting payload with key: L3m3s_L0ng0r_Buggung',
  'RANSOMWARE MODULE: disabled (kita baik hati)',
  '[INFO] L.L.B.exe fully deployed — system owned 😈',
  'establishing persistent backdoor... DONE',
  'cleaning logs: /var/log/auth.log WIPED',
  'TRANSFER COMPLETE — 1,337 files exfiltrated',
  'victim device added to botnet: node #420',
  '> lemes longor buggung telah menguasai sistemmu',
]

const FAKE_IPS = [
  '10.0.0.1', '172.16.0.55', '192.168.1.1', '255.255.255.0',
  '127.0.0.1', '0.0.0.0', '::1', 'fe80::1', '10.∞.∞.∞'
]

const VIRUS_LIST = [
  'TROJAN.LLB.RECEH_V3',
  'WORM.LONGOR.SPREADER',
  'ROOTKIT.BUGGUNG.STEALTH',
  'SPYWARE.LEMES.NGAKAK',
  'BACKDOOR.LLB.PERSISTENT',
  'EXPLOIT.CVE-2024-ABSURD',
  'PAYLOAD.RECEH.ULTIMATE',
]

export default function GatewayPage() {
  const router = useRouter()
  const [tick, setTick] = useState(0)
  const [lines, setLines] = useState<{ text: string; color: string }[]>([])
  const [glitchOverlay, setGlitchOverlay] = useState('')
  const [progress, setProgress] = useState(0)
  const [secondProgress, setSecondProgress] = useState(0)
  const [virusIdx, setVirusIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [hexDump, setHexDump] = useState<string[]>([])
  const [matrixCols, setMatrixCols] = useState<string[]>([])
  const [shake, setShake] = useState(false)
  const [flash, setFlash] = useState<'none' | 'red' | 'green'>('none')
  const [done, setDone] = useState(false)
  const lineRef = useRef<HTMLDivElement>(null)
  const startRef = useRef(Date.now())
  const lineIntervalRef = useRef<NodeJS.Timeout>()

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000
      const remaining = Math.max(0, 10 - elapsed)
      setTimeLeft(Math.ceil(remaining))
      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Global tick (animasi dasar)
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 80)
    return () => clearInterval(interval)
  }, [])

  // Glitch overlay text
  useEffect(() => {
    if (tick % 2 === 0) {
      setGlitchOverlay(randomGlitch(40 + Math.floor(Math.random() * 30)))
    }
  }, [tick])

  // Random screen shake
  useEffect(() => {
    if (tick % 15 === 0 && Math.random() > 0.5) {
      setShake(true)
      setTimeout(() => setShake(false), 150 + Math.random() * 150)
    }
  }, [tick])

  // Flash effect
  useEffect(() => {
    if (tick % 20 === 0 && Math.random() > 0.6) {
      const color = Math.random() > 0.5 ? 'red' : 'green'
      setFlash(color)
      setTimeout(() => setFlash('none'), 80)
    }
  }, [tick])

  // Progress bars
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 3.5 + 0.5
        return next >= 100 ? 100 : next
      })
      setSecondProgress(p => {
        const next = p + Math.random() * 2 + 0.3
        return next >= 100 ? 100 : next
      })
      setVirusIdx(i => (i + 1) % VIRUS_LIST.length)
    }, 180)
    return () => clearInterval(interval)
  }, [])

  // Scrolling error lines
  useEffect(() => {
    let i = 0
    lineIntervalRef.current = setInterval(() => {
      const line = ERROR_LINES[i % ERROR_LINES.length]
      const color =
        line.includes('CRIT') || line.includes('PANIC') || line.includes('BSOD') || line.includes('ERR') ? '#ff0040'
        : line.includes('✓') || line.includes('DONE') || line.includes('OK') || line.includes('owned') ? '#00ff41'
        : line.includes('WARN') || line.includes('!!!') ? '#ffaa00'
        : 'rgba(0,255,65,0.85)'
      setLines(prev => [...prev.slice(-30), { text: line, color }])
      i++
    }, 280)
    return () => clearInterval(lineIntervalRef.current)
  }, [])

  useEffect(() => {
    lineRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  // Hex dump animation
  useEffect(() => {
    const interval = setInterval(() => {
      const rows = Array.from({ length: 6 }, (_, row) => {
        const addr = (0xDEAD0000 + row * 16 + tick).toString(16).toUpperCase().padStart(8, '0')
        const bytes = Array.from({ length: 16 }, () =>
          Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')
        ).join(' ')
        const ascii = Array.from({ length: 16 }, () => {
          const c = Math.floor(Math.random() * 94) + 33
          return String.fromCharCode(c)
        }).join('')
        return `${addr}  ${bytes}  |${ascii}|`
      })
      setHexDump(rows)
    }, 100)
    return () => clearInterval(interval)
  }, [tick])

  // Matrix columns
  useEffect(() => {
    const cols = Array.from({ length: 24 }, () => randomGlitch(10 + Math.floor(Math.random() * 10)))
    setMatrixCols(cols)
    const interval = setInterval(() => {
      setMatrixCols(prev => prev.map(col =>
        Math.random() > 0.6 ? randomGlitch(10 + Math.floor(Math.random() * 10)) : col
      ))
    }, 120)
    return () => clearInterval(interval)
  }, [])

  // Auto-redirect after 10 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDone(true)
      setFlash('green')
      setTimeout(() => router.push('/home'), 800)
    }, 10000)
    return () => clearTimeout(timeout)
  }, [router])

  const bar1 = Math.round(progress / 5)
  const bar2 = Math.round(secondProgress / 5)
  const fakeIp = FAKE_IPS[tick % FAKE_IPS.length] ?? '0.0.0.0'
  const currentVirus = VIRUS_LIST[virusIdx] ?? 'TROJAN.LLB'

  return (
    <main
      className="min-h-screen bg-black relative overflow-hidden select-none"
      style={{ animation: shake ? 'shake 0.2s ease-in-out' : 'none' }}
    >
      <ScanlineOverlay />

      {/* Flash overlay */}
      {flash !== 'none' && (
        <div
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background: flash === 'red' ? 'rgba(255,0,64,0.2)' : 'rgba(0,255,65,0.12)',
          }}
        />
      )}

      {/* Matrix rain background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-8 flex gap-2 px-1">
        {matrixCols.map((col, i) => (
          <div
            key={i}
            className="font-terminal text-green shrink-0"
            style={{
              fontSize: '10px',
              writingMode: 'vertical-rl',
              letterSpacing: '0.2em',
              opacity: 0.08 + (i % 3) * 0.03,
            }}
          >
            {col}
          </div>
        ))}
      </div>

      {/* Glitch overlay text */}
      <div
        className="fixed inset-0 z-5 pointer-events-none flex items-center justify-center"
        style={{ opacity: 0.04 }}
      >
        <div
          className="font-terminal text-red-blood text-2xl tracking-widest"
          style={{ wordBreak: 'break-all', padding: '0 20px' }}
        >
          {glitchOverlay}
        </div>
      </div>

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.88) 100%)' }}
      />

      <div className="relative z-20 min-h-screen flex flex-col">

        {/* Top bar */}
        <div
          className="px-3 py-2 flex items-center gap-2 flex-wrap"
          style={{ borderBottom: '1px solid rgba(255,0,64,0.4)', background: 'rgba(10,0,0,0.9)' }}
        >
          <span className="font-terminal text-xs" style={{ color: '#ff0040' }}>
            ⚠ INTRUSION ACTIVE
          </span>
          <span className="font-terminal text-xs text-green" style={{ opacity: 0.5 }}>|</span>
          <span className="font-terminal text-xs text-green" style={{ opacity: 0.7 }}>
            SRC: {fakeIp}
          </span>
          <span className="font-terminal text-xs text-green" style={{ opacity: 0.5 }}>|</span>
          <span className="font-terminal text-xs" style={{ color: '#ffaa00' }}>
            T-{timeLeft}s
          </span>
          <span className="ml-auto font-terminal text-xs blink" style={{ color: '#ff0040' }}>
            ● RECORDING
          </span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 p-3 md:p-4 gap-3">

          {/* ─── KOLOM KIRI: Error log + hex dump ─── */}
          <div className="flex flex-col gap-3">

            {/* Error log */}
            <div
              className="flex-1 p-3"
              style={{
                border: '1px solid rgba(255,0,64,0.5)',
                background: 'rgba(8,0,0,0.95)',
                minHeight: '180px',
                maxHeight: '260px',
                overflow: 'hidden',
              }}
            >
              <div className="font-terminal text-xs mb-2 flex items-center gap-2" style={{ color: '#ff0040', borderBottom: '1px solid rgba(255,0,64,0.2)', paddingBottom: '6px' }}>
                <span className="blink">▶</span>
                <span>SYSTEM_LOG — ERRORS</span>
                <span className="ml-auto" style={{ color: 'rgba(255,0,64,0.5)' }}>{lines.length} events</span>
              </div>
              <div className="font-terminal space-y-0.5 overflow-hidden" style={{ fontSize: '10px' }}>
                {lines.slice(-18).map((line, i) => (
                  <div key={i} style={{ color: line.color, opacity: 0.7 + (i / lines.length) * 0.3 }}>
                    <span style={{ color: 'rgba(255,0,64,0.3)' }}>[{String(i).padStart(4, '0')}] </span>
                    {line.text}
                  </div>
                ))}
                <div ref={lineRef} />
              </div>
            </div>

            {/* Hex dump */}
            <div
              className="p-3"
              style={{
                border: '1px solid rgba(0,255,65,0.2)',
                background: 'rgba(0,5,0,0.95)',
              }}
            >
              <div className="font-terminal text-xs mb-2 text-green" style={{ opacity: 0.6, borderBottom: '1px solid rgba(0,255,65,0.15)', paddingBottom: '4px' }}>
                HEX DUMP — MEMORY 0xDEAD****
              </div>
              <div className="font-terminal space-y-0.5" style={{ fontSize: '9px', color: 'rgba(0,255,65,0.65)', overflow: 'hidden' }}>
                {hexDump.map((row, i) => (
                  <div key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{row}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── KOLOM KANAN: Logo + progress + stats ─── */}
          <div className="flex flex-col gap-3">

            {/* Logo */}
            <div className="text-center py-2">
              <div
                className="font-vt323 text-green flicker"
                style={{
                  fontSize: 'clamp(3rem, 10vw, 5rem)',
                  textShadow: '0 0 30px #00ff41, 0 0 60px #00ff41',
                  letterSpacing: '0.2em',
                }}
              >
                L.L.B
              </div>
              <div className="font-terminal text-xs text-green" style={{ opacity: 0.6, letterSpacing: '0.4em' }}>
                SYSTEM BREACH IN PROGRESS
              </div>
            </div>

            {/* Progress bar 1 — virus */}
            <div
              className="p-3"
              style={{ border: '1px solid rgba(255,0,64,0.5)', background: 'rgba(8,0,0,0.95)' }}
            >
              <div className="font-terminal text-xs mb-1" style={{ color: '#ff0040' }}>
                DEPLOYING: {currentVirus}
              </div>
              <div className="font-terminal text-sm text-green mb-1">
                [{'█'.repeat(bar1)}{'░'.repeat(20 - bar1)}] {Math.round(progress)}%
              </div>
              <div className="flex justify-between font-terminal" style={{ fontSize: '10px', color: 'rgba(255,0,64,0.7)' }}>
                <span>SIZE: 13.37 MB</span>
                <span>SPEED: {(Math.random() * 9 + 1).toFixed(1)} MB/s</span>
              </div>
            </div>

            {/* Progress bar 2 — data exfil */}
            <div
              className="p-3"
              style={{ border: '1px solid rgba(255,170,0,0.4)', background: 'rgba(5,4,0,0.95)' }}
            >
              <div className="font-terminal text-xs mb-1" style={{ color: '#ffaa00' }}>
                EXFILTRATING: /home/user/data/
              </div>
              <div className="font-terminal text-sm mb-1" style={{ color: '#ffaa00' }}>
                [{'▓'.repeat(bar2)}{'░'.repeat(20 - bar2)}] {Math.round(secondProgress)}%
              </div>
              <div className="flex justify-between font-terminal" style={{ fontSize: '10px', color: 'rgba(255,170,0,0.6)' }}>
                <span>FILES: {Math.round(secondProgress * 13.37)}</span>
                <span>ETA: {Math.max(0, Math.round((100 - secondProgress) / 8))}s</span>
              </div>
            </div>

            {/* Network stats */}
            <div
              className="p-3 grid grid-cols-2 gap-2"
              style={{ border: '1px solid rgba(0,255,65,0.2)', background: 'rgba(0,5,0,0.95)' }}
            >
              {[
                { label: 'PROXY CHAIN', val: '7 HOPS' },
                { label: 'ENCRYPTION', val: 'AES-256' },
                { label: 'STATUS', val: 'OWNED ✓' },
                { label: 'COUNTDOWN', val: `T-${timeLeft}s` },
              ].map(({ label, val }) => (
                <div key={label} className="font-terminal" style={{ fontSize: '10px' }}>
                  <div style={{ color: 'rgba(0,255,65,0.5)' }}>{label}</div>
                  <div style={{ color: '#00ff41', textShadow: '0 0 4px #00ff41' }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Countdown & done */}
            {done ? (
              <div
                className="p-3 text-center"
                style={{ border: '1px solid #00ff41', background: 'rgba(0,20,0,0.95)' }}
              >
                <div
                  className="font-terminal text-lg text-green blink tracking-widest"
                  style={{ textShadow: '0 0 20px #00ff41' }}
                >
                  ✓ ACCESS GRANTED
                </div>
                <div className="font-terminal text-xs text-green mt-1" style={{ opacity: 0.6 }}>
                  memasuki sistem...
                </div>
              </div>
            ) : (
              <div
                className="p-3 text-center"
                style={{ border: '1px solid rgba(255,0,64,0.4)', background: 'rgba(8,0,0,0.95)' }}
              >
                <div className="font-terminal text-xs mb-1" style={{ color: 'rgba(255,0,64,0.7)' }}>
                  AUTO-ACCESS IN
                </div>
                <div
                  className="font-vt323 text-green"
                  style={{ fontSize: '3.5rem', textShadow: '0 0 20px #00ff41', lineHeight: 1 }}
                >
                  {timeLeft}
                </div>
                <div className="font-terminal text-xs mt-1" style={{ color: 'rgba(0,255,65,0.5)' }}>
                  // atau tunggu saja, sistemmu sudah dikuasai
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="px-4 py-2 text-center"
          style={{ borderTop: '1px solid rgba(0,255,65,0.15)' }}
        >
          <span className="font-terminal text-green" style={{ fontSize: '10px', opacity: 0.3, letterSpacing: '0.2em' }}>
            ⚠ INI CUMA ANIMASI. DEVICEMU AMAN. MUNGKIN. ⚠
          </span>
        </div>
      </div>
    </main>
  )
}