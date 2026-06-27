'use client'

import { useEffect, useRef } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  color?: 'green' | 'red'
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
}

export default function GlitchText({
  text,
  className = '',
  intensity = 'medium',
  color = 'green',
  as: Tag = 'div',
}: GlitchTextProps) {
  const intervalMap = { low: 5000, medium: 3000, high: 1500 }
  const durationMap = { low: 200, medium: 400, high: 700 }
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const glitchChars = '!<>-_\\/[]{}—=+*^?#░▒▓█▄▀■□▪▫'
    let timeoutId: NodeJS.Timeout
    let isGlitching = false

    const startGlitch = () => {
      if (isGlitching) return
      isGlitching = true
      const original = text
      let iterations = 0
      const maxIter = durationMap[intensity] / 40

      const glitchInterval = setInterval(() => {
        el.setAttribute('data-text', text)
        const corrupted = original
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' '
            if (idx < iterations / 2) return char
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          })
          .join('')
        el.textContent = corrupted
        iterations++
        if (iterations >= maxIter) {
          clearInterval(glitchInterval)
          el.textContent = original
          isGlitching = false
          scheduleNext()
        }
      }, 40)
    }

    const scheduleNext = () => {
      const delay = intervalMap[intensity] + Math.random() * 2000
      timeoutId = setTimeout(startGlitch, delay)
    }

    scheduleNext()
    return () => {
      clearTimeout(timeoutId)
    }
  }, [text, intensity])

  const colorClass = color === 'green' ? 'text-green' : 'text-red-blood'

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={`relative font-terminal ${colorClass} ${className}`}
      data-text={text}
      style={{
        textShadow: color === 'green'
          ? '0 0 10px #00ff41, 0 0 20px #00ff41'
          : '0 0 10px #ff0040, 0 0 20px #ff0040',
      }}
    >
      {text}
    </Tag>
  )
}
