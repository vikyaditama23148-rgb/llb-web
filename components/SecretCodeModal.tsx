'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SecretCodeModalProps {
  username: string
  onSuccess: () => void
  onClose: () => void
  correctCode: string
}

export default function SecretCodeModal({ username, onSuccess, onClose, correctCode }: SecretCodeModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (code === correctCode) {
      setError(false)
      onSuccess()
    } else {
      setError(true)
      setErrorCount(c => c + 1)
      setCode('')

      // Play error sound via Web Audio API
      try {
        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.setValueAtTime(80, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4)
        gain.gain.setValueAtTime(0.3, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
        osc.start()
        osc.stop(ctx.currentTime + 0.5)
      } catch {}

      setTimeout(() => {
        setError(false)
        inputRef.current?.focus()
      }, 1500)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/90"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className={`relative z-10 w-full max-w-md mx-4 p-6 ${error ? 'terminal-border-red' : 'terminal-border'}`}
          animate={error ? { x: [-8, 8, -8, 8, -4, 4, 0], rotate: [-1, 1, -1, 1, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: '#000', maxWidth: '460px' }}
        >
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="text-green/50 text-xs mb-2 tracking-widest">
              ════════════════════
            </div>
            <div className="font-terminal text-xs text-green/60 mb-1 tracking-widest uppercase">
              SISTEM KEAMANAN L.L.B v2.3.1
            </div>
            <div className="font-terminal text-xl text-green tracking-widest uppercase mb-1"
              style={{ textShadow: '0 0 10px #00ff41' }}>
              AKSES DIBATASI
            </div>
            <div className="font-terminal text-xs text-green/50">
              TARGET: <span className="text-green">{username.toUpperCase()}</span>
            </div>
            <div className="text-green/50 text-xs mt-2 tracking-widest">
              ════════════════════
            </div>
          </div>

          {/* Pesan error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-4 p-3 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ border: '1px solid #ff0040', background: 'rgba(255,0,64,0.05)' }}
              >
                <div
                  className="font-terminal text-lg font-bold tracking-widest"
                  style={{
                    color: '#ff0040',
                    animation: 'pulse-red 0.3s ease-in-out infinite',
                    textShadow: '0 0 10px #ff0040',
                  }}
                >
                  ⛔ AKSES DITOLAK ⛔
                </div>
                <div className="text-xs mt-1" style={{ color: '#ff0040' }}>
                  PERCOBAAN #{errorCount} — KODE SALAH BAJING
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pesan instruksi */}
          {!error && (
            <div className="mb-4 text-center">
              <div className="font-terminal text-xs text-green/70 leading-relaxed">
                {'>'} MASUKKAN KODE RAHASIA KAMU<br />
                {'>'} JIKA SALAH, KAMI TAHU RUMAHMU<br />
                {'>'} (ga ding, tapi jangan salah ya)
              </div>
            </div>
          )}

          {/* Input */}
          <div className="mb-4">
            <div className="text-xs text-green/50 mb-2">{'>'} KODE_RAHASIA:</div>
            <input
              ref={inputRef}
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
              className="input-terminal text-center text-lg tracking-[0.5em]"
              placeholder="••••••••"
              autoFocus
              maxLength={20}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="btn-terminal flex-1 py-3 text-sm"
            >
              [ MASUK ]
            </button>
            <button
              onClick={onClose}
              className="btn-terminal btn-red px-4 py-3 text-sm"
            >
              [ KABUR ]
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center text-green/25 text-xs">
            IP KAMU SEDANG DIREKAM... 👁
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
