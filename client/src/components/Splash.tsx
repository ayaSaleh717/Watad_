import { useEffect, useState } from 'react'
import { LogoMark } from './Logo'

const BLUR_MS = 3200
const TOTAL_MS = 4400

/** Frosted-blur intro: the page sits blurred behind the logo for a few seconds, then clears. */
export function Splash({ onDone }: { onDone: () => void }) {
  const [out, setOut] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t1 = window.setTimeout(() => setOut(true), BLUR_MS)
    const t2 = window.setTimeout(() => {
      document.body.style.overflow = ''
      onDone()
    }, TOTAL_MS)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      document.body.style.overflow = ''
    }
  }, [onDone])

  return (
    <div className={`splash ${out ? 'out' : ''}`} aria-hidden="true">
      <div className="splash-inner">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-gold-500/30 blur-2xl" />
          <span
            className="absolute inset-0 rounded-full border border-gold-400/50"
            style={{ animation: 'pulse-ring 2s ease-out infinite' }}
          />
          <LogoMark className="relative h-28 w-auto drop-shadow-[0_10px_30px_rgba(224,168,46,0.45)] sm:h-36" />
        </div>
        <div className="text-center" dir="ltr">
          <div dir="rtl" className="text-3xl font-black text-white sm:text-4xl">
            وتد للبترول
          </div>
          <div className="mt-1 text-xs font-semibold tracking-[0.5em] text-gold-300 sm:text-sm">
            WATAD PETROLEUM
          </div>
        </div>
        <div className="splash-bar">
          <span />
        </div>
      </div>
    </div>
  )
}
