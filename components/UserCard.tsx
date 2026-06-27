'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User } from '@/types'

interface UserCardProps {
  user: User
  index: number
}

export default function UserCard({ user, index }: UserCardProps) {
  const [hovered, setHovered] = useState(false)
  const padIndex = String(index + 1).padStart(3, '0')

  return (
    <Link href={`/user/${user.id}`}>
      <div
        className="group px-4 py-3 border-b border-green/20 hover:bg-green/5 transition-all duration-150 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          boxShadow: hovered ? 'inset 0 0 20px rgba(0,255,65,0.05)' : 'none',
        }}
      >
        {/* Baris atas: index + status dot + username + arrow */}
        <div className="flex items-center gap-3">
          <span className="text-green/60 text-xs w-8 shrink-0">{padIndex}</span>

          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              background: hovered ? '#00ff41' : '#005520',
              boxShadow: hovered ? '0 0 6px #00ff41' : 'none',
              transition: 'all 0.2s',
            }}
          />

          <span
            className="font-terminal text-sm tracking-widest uppercase flex-1"
            style={{
              color: hovered ? '#00ff41' : '#00dd33',
              textShadow: hovered ? '0 0 10px #00ff41' : 'none',
            }}
          >
            {hovered ? '> ' : '  '}{user.username}
          </span>

          <span
            className="text-green/70 text-xs shrink-0"
            style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}
          >
            [AKSES →]
          </span>
        </div>

        {/* Baris bawah: alias + status — selalu tampil di semua ukuran layar */}
        {(user.alias || user.status) && (
          <div className="flex items-center gap-3 mt-1 pl-11">
            {user.alias && (
              <span
                className="font-terminal text-xs"
                style={{ color: 'rgba(0,255,65,0.65)' }}
              >
                [{user.alias}]
              </span>
            )}
            {user.status && (
              <span
                className="font-terminal text-xs truncate"
                style={{ color: 'rgba(0,255,65,0.55)' }}
              >
                // {user.status}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}