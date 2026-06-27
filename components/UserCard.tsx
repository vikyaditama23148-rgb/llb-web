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
        className="group flex items-center gap-4 px-4 py-3 border-b border-green/20 hover:bg-green/5 transition-all duration-150 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          boxShadow: hovered ? 'inset 0 0 20px rgba(0,255,65,0.05)' : 'none',
        }}
      >
        {/* Index */}
        <span className="text-green/40 text-xs w-8 shrink-0">{padIndex}</span>

        {/* Status dot */}
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{
            background: hovered ? '#00ff41' : '#003b00',
            boxShadow: hovered ? '0 0 6px #00ff41' : 'none',
            transition: 'all 0.2s',
          }}
        />

        {/* Username */}
        <span
          className="font-terminal text-sm tracking-widest uppercase flex-1"
          style={{
            color: hovered ? '#00ff41' : '#00cc33',
            textShadow: hovered ? '0 0 10px #00ff41' : 'none',
          }}
        >
          {hovered ? '> ' : '  '}{user.username}
        </span>

        {/* Alias jika ada */}
        {user.alias && (
          <span className="text-green/30 text-xs hidden sm:block">
            [{user.alias}]
          </span>
        )}

        {/* Status jika ada */}
        {user.status && (
          <span className="text-green/25 text-xs hidden md:block truncate max-w-32">
            {user.status}
          </span>
        )}

        {/* Arrow */}
        <span
          className="text-green/30 text-xs shrink-0"
          style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.2s' }}
        >
          [AKSES →]
        </span>
      </div>
    </Link>
  )
}
