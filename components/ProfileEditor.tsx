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
  const [uploadError, setUploadError] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (field: keyof UserUpdatePayload, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error
    setUploadError('')

    // Validasi ukuran — max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Ukuran foto maksimal 2MB')
      return
    }

    // Validasi tipe file
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setUploadError('Format harus JPG, PNG, WEBP, atau GIF')
      return
    }

    setUploadingAvatar(true)

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const filename = `${user.id}-${Date.now()}.${ext}`

      // Coba upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filename, file, {
          upsert: true,
          contentType: file.type,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        if (uploadError.message.includes('bucket')) {
          setUploadError('Bucket "avatars" belum dibuat di Supabase Storage. Buat dulu di dashboard.')
        } else if (uploadError.message.includes('policy')) {
          setUploadError('Policy storage belum diatur. Jalankan schema.sql di Supabase.')
        } else {
          setUploadError(`Upload gagal: ${uploadError.message}`)
        }
        return
      }

      // Ambil public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filename)
      const url = data.publicUrl

      setAvatarPreview(url)
      setForm(prev => ({ ...prev, avatar_url: url }))
      setUploadError('')
    } catch (err) {
      console.error('Unexpected upload error:', err)
      setUploadError('Terjadi kesalahan tak terduga saat upload.')
    } finally {
      setUploadingAvatar(false)
      // Reset input agar bisa upload file yang sama lagi
      if (fileInputRef.current) fileInputRef.current.value = ''
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
    { key: 'full_name', label: 'NAMA_LENGKAP',  placeholder: 'Nama asli kamu (kalau mau jujur)' },
    { key: 'alias',     label: 'ALIAS_LUCU',     placeholder: 'Nama panggilan absurd kamu' },
    { key: 'status',    label: 'STATUS_MOOD',    placeholder: 'Lagi ngapain / ngerasain apa' },
    { key: 'bio',       label: 'BIO_DESKRIPSI',  placeholder: 'Ceritain dirimu... atau jangan', multiline: true },
    { key: 'quote',     label: 'QUOTE_ABSURD',   placeholder: 'Kata mutiara paling receh kamu', multiline: true },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-6 p-4 terminal-border text-center">
        <div className="font-terminal text-xs text-green mb-1 tracking-widest" style={{ opacity: 0.7 }}>
          AKSES DIBERIKAN
        </div>
        <div
          className="font-terminal text-xl text-green tracking-widest"
          style={{ textShadow: '0 0 15px #00ff41' }}
        >
          ✓ SELAMAT DATANG, {user.username.toUpperCase()}
        </div>
        <div className="font-terminal text-xs text-green mt-1" style={{ opacity: 0.6 }}>
          // edit profil kamu di bawah ini
        </div>
      </div>

      {/* Avatar */}
      <div className="mb-6 flex flex-col items-center gap-3">
        {/* Preview foto */}
        <div
          className="overflow-hidden cursor-pointer relative"
          style={{
            width: 112,
            height: 112,
            borderRadius: '50%',
            border: '2px solid #00ff41',
            boxShadow: '0 0 20px rgba(0,255,65,0.3)',
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarPreview}
              alt="avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#050505',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}
            >
              👤
            </div>
          )}

          {/* Loading overlay */}
          {uploadingAvatar && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="font-terminal text-xs text-green blink">UPLOAD...</span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleAvatarUpload}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-terminal text-xs px-4 py-2"
          disabled={uploadingAvatar}
        >
          {uploadingAvatar ? '[ MENGUPLOAD... ]' : '[ GANTI FOTO PROFIL ]'}
        </button>

        <div className="font-terminal text-xs text-green" style={{ opacity: 0.5 }}>
          JPG / PNG / WEBP — maks 2MB
        </div>

        {/* Error upload */}
        {uploadError && (
          <div
            className="font-terminal text-xs text-center px-4 py-2"
            style={{
              color: '#ff0040',
              border: '1px solid rgba(255,0,64,0.4)',
              background: 'rgba(255,0,64,0.05)',
              maxWidth: '300px',
            }}
          >
            ⚠ {uploadError}
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {fields.map(({ key, label, placeholder, multiline }) => (
          <div key={key}>
            <label className="block font-terminal text-xs text-green mb-1 tracking-widest" style={{ opacity: 0.8 }}>
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
      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-terminal w-full py-3 text-base"
          style={saved ? { borderColor: '#00ff41', background: 'rgba(0,255,65,0.1)' } : {}}
        >
          {saving ? '[ MENYIMPAN... ]' : saved ? '[ ✓ TERSIMPAN! ]' : '[ SIMPAN PROFIL ]'}
        </button>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center font-terminal text-xs text-green"
          style={{ opacity: 0.7 }}
        >
          // data berhasil dikirim ke database gelap kami 🗄️
        </motion.div>
      )}
    </motion.div>
  )
}