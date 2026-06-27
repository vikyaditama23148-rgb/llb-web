'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { User, UserUpdatePayload } from '@/types'
import { supabase } from '@/lib/supabase'

interface ProfileEditorProps {
  user: User
  onSaved: (updated: User) => void
}

export default function ProfileEditor({ user, onSaved }: ProfileEditorProps) {
  const [form, setForm] = useState<UserUpdatePayload>({
    full_name: user.full_name ?? '',
    bio: user.bio ?? '',
    status: user.status ?? '',
    alias: user.alias ?? '',
    quote: user.quote ?? '',
    avatar_url: user.avatar_url ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (field: keyof UserUpdatePayload, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    try {
      const ext = file.name.split('.').pop()
      const filename = `${user.id}-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filename, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filename)
      const url = data.publicUrl

      setAvatarPreview(url)
      setForm(prev => ({ ...prev, avatar_url: url }))
    } catch (err) {
      console.error('Upload gagal:', err)
      alert('Upload foto gagal. Cek bucket storage "avatars" di Supabase.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Gagal menyimpan')
      const { data } = await res.json()
      setSaved(true)
      onSaved(data)
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan! Cek koneksi Supabase kamu.')
    } finally {
      setSaving(false)
    }
  }

  const fields: { key: keyof UserUpdatePayload; label: string; placeholder: string; multiline?: boolean }[] = [
    { key: 'full_name',  label: 'NAMA_LENGKAP',    placeholder: 'Nama asli kamu (kalau mau jujur)' },
    { key: 'alias',      label: 'ALIAS_LUCU',       placeholder: 'Nama panggilan absurd kamu' },
    { key: 'status',     label: 'STATUS_MOOD',      placeholder: 'Lagi ngapain / ngerasain apa' },
    { key: 'bio',        label: 'BIO_DESKRIPSI',    placeholder: 'Ceritain dirimu... atau jangan, terserah', multiline: true },
    { key: 'quote',      label: 'QUOTE_ABSURD',     placeholder: 'Kata mutiara paling receh kamu', multiline: true },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-6 p-4 terminal-border text-center">
        <div className="text-green/50 text-xs mb-1 tracking-widest">AKSES DIBERIKAN</div>
        <div className="font-terminal text-xl text-green tracking-widest" style={{ textShadow: '0 0 15px #00ff41' }}>
          ✓ SELAMAT DATANG, {user.username.toUpperCase()}
        </div>
        <div className="text-green/40 text-xs mt-1">// edit profil kamu di bawah ini</div>
      </div>

      {/* Avatar */}
      <div className="mb-6 flex flex-col items-center gap-3">
        <div
          className="w-28 h-28 rounded-full border-2 border-green overflow-hidden cursor-pointer relative"
          style={{ boxShadow: '0 0 20px rgba(0,255,65,0.3)' }}
          onClick={() => fileInputRef.current?.click()}
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black text-green/30 text-3xl">
              👤
            </div>
          )}
          {uploadingAvatar && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <span className="text-green text-xs blink">UPLOADING...</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-terminal text-xs px-3 py-1"
          disabled={uploadingAvatar}
        >
          {uploadingAvatar ? '[ UPLOADING... ]' : '[ GANTI FOTO ]'}
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {fields.map(({ key, label, placeholder, multiline }) => (
          <div key={key}>
            <label className="block text-xs text-green/60 mb-1 tracking-widest">
              {'>'} {label}:
            </label>
            {multiline ? (
              <textarea
                value={(form[key] as string) ?? ''}
                onChange={e => handleChange(key, e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="input-terminal resize-none"
              />
            ) : (
              <input
                type="text"
                value={(form[key] as string) ?? ''}
                onChange={e => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className="input-terminal"
              />
            )}
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="mt-6 flex gap-3 items-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-terminal flex-1 py-3"
          style={saved ? { borderColor: '#00ff41', background: 'rgba(0,255,65,0.1)' } : {}}
        >
          {saving ? '[ MENYIMPAN... ]' : saved ? '[ ✓ TERSIMPAN! ]' : '[ SIMPAN PROFIL ]'}
        </button>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-xs text-green/60"
        >
          // data berhasil dikirim ke database gelap kami 🗄️
        </motion.div>
      )}
    </motion.div>
  )
}
