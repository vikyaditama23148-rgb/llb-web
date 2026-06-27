'use client'

import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [tried, setTried] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Attempt autoplay
    const tryPlay = () => {
      audio.play().then(() => {
        setPlaying(true)
        setTried(true)
      }).catch(() => {
        setTried(true)
        // autoplay blocked — wait for user gesture
      })
    }

    tryPlay()

    // Fallback: play on first user interaction anywhere
    const handleInteraction = () => {
      if (!playing && audio.paused) {
        audio.play().then(() => setPlaying(true)).catch(() => {})
      }
    }

    window.addEventListener('click', handleInteraction, { once: true })
    window.addEventListener('keydown', handleInteraction, { once: true })

    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [playing])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      <audio ref={audioRef} src="/sounds/theme.mp3" loop />
      <button
        onClick={toggle}
        className="btn-terminal text-xs px-3 py-2 opacity-70 hover:opacity-100"
        title={playing ? 'Matikan suara' : 'Nyalakan suara'}
      >
        {playing ? '[ ♪ ON ]' : '[ ♪ OFF ]'}
      </button>
      {tried && !playing && (
        <span className="text-xs text-green opacity-50 blink">// klik untuk nyalain audio</span>
      )}
    </div>
  )
}
