'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ScanlineOverlay from '@/components/ScanlineOverlay'
import SecretCodeModal from '@/components/SecretCodeModal'
import ProfileEditor from '@/components/ProfileEditor'
import GlitchText from '@/components/GlitchText'
import { User } from '@/types'

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/user/${id}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json() })
      .then(d => { setUser(d.data); setLoading(false); setShowModal(true) })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ScanlineOverlay />
        <div className="font-terminal text-green text-sm blink">
          {'>'} MENGAMBIL DATA USER...
        </div>
      </div>
    )
  }

  if (notFound || !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <ScanlineOverlay />
        <GlitchText text="USER NOT FOUND" as="h1" intensity="high" color="red" className="text-4xl" />
        <div className="font-terminal text-xs text-green/50">// user ini mungkin sudah menghilang ke dimensi lain</div>
        <button onClick={() => router.push('/home')} className="btn-terminal">[ KEMBALI ]</button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black relative">
      <ScanlineOverlay />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.75) 100%)' }}
      />

      <div className="relative z-20 max-w-2xl mx-auto px-4 py-8">

        {/* Back */}
        <button
          onClick={() => router.push('/home')}
          className="font-terminal text-xs text-green/40 hover:text-green mb-6 block"
        >
          ← [ KEMBALI KE DATABASE ]
        </button>

        {/* Locked state — show mystery info */}
        {!unlocked && (
          <div className="text-center py-16">
            <GlitchText
              text={user.username.toUpperCase()}
              as="h1"
              intensity="medium"
              color="green"
              className="text-5xl md:text-6xl mb-4 block"
            />
            <div className="font-terminal text-xs text-green/40 mb-8 space-y-1">
              <div>ID: {user.id.slice(0, 8).toUpperCase()}...</div>
              <div>DIBUAT: {new Date(user.created_at).toLocaleDateString('id-ID')}</div>
              <div className="text-red-blood/60">STATUS: TERKUNCI 🔒</div>
            </div>

            <div
              className="inline-block px-8 py-4 mb-6 text-center"
              style={{ border: '1px solid rgba(255,0,64,0.3)' }}
            >
              <div className="font-terminal text-red-blood text-sm tracking-widest mb-1">
                ████ AKSES DIBATASI ████
              </div>
              <div className="font-terminal text-xs text-red-blood/60">
                // profil ini dilindungi kode rahasia
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowModal(true)}
                className="btn-terminal px-10 py-3"
              >
                [ COBA AKSES ]
              </button>
            </div>
          </div>
        )}

        {/* Unlocked state — show profile */}
        <AnimatePresence>
          {unlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Profile header */}
              <div className="text-center mb-8">
                <GlitchText
                  text={user.username.toUpperCase()}
                  as="h1"
                  intensity="low"
                  color="green"
                  className="text-4xl md:text-5xl block mb-2"
                />
                <div className="font-terminal text-xs text-green/40 tracking-widest">
                  ID: {user.id.slice(0, 8).toUpperCase()}... ✓ TERVERIFIKASI
                </div>
              </div>

              {/* Profile editor */}
              <ProfileEditor
                user={user}
                onSaved={(updated) => setUser(updated)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Secret code modal */}
      {showModal && !unlocked && (
        <SecretCodeModal
          username={user.username}
          correctCode={user.secret_code}
          onSuccess={() => { setShowModal(false); setUnlocked(true) }}
          onClose={() => { setShowModal(false) }}
        />
      )}
    </main>
  )
}
