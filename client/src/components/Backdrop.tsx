import { useState } from 'react'

export function Pumpjack({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 150" className={className} fill="currentColor" aria-hidden="true">
      <path d="M0 146h220v4H0z" />
      <rect x="66" y="128" width="92" height="12" rx="2" />
      <path d="M92 128 110 50h8l18 78h-8l-14-64-14 64z" />
      <rect className="pj-rod" x="17" y="78" width="3" height="50" />
      <g className="pj-beam">
        <rect x="30" y="46" width="150" height="9" rx="3" />
        <path d="M30 42Q8 46 10 80h14q0-24 18-27z" />
        <rect x="166" y="38" width="22" height="24" rx="3" />
      </g>
      <circle cx="114" cy="50" r="7" />
      <g className="pj-wheel">
        <circle cx="168" cy="118" r="14" />
        <circle cx="168" cy="108" r="3" fill="#1c1206" />
      </g>
    </svg>
  )
}

interface DropSpec {
  left: number
  size: number
  delay: number
  duration: number
}

// Deterministic so SSR/StrictMode renders are stable.
const DROPS: DropSpec[] = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37 + 8) % 96,
  size: 6 + ((i * 5) % 11),
  delay: (i * 1.3) % 9,
  duration: 9 + ((i * 7) % 8),
}))

/** Animated hero background: glow, grid, pumpjacks, rising droplets and an optional video. */
export function HeroBackdrop() {
  const [videoOk, setVideoOk] = useState(false)

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-brown-950">
      {/* Optional background video: drop a file at public/hero.mp4 and it fades in automatically. */}
      <video
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoOk ? 'opacity-35' : 'opacity-0'}`}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        onCanPlay={() => setVideoOk(true)}
        onError={() => setVideoOk(false)}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 70% 35%, rgba(251,180,11,0.28), transparent 70%), radial-gradient(50% 50% at 10% 90%, rgba(215,154,11,0.2), transparent 70%), linear-gradient(180deg, #120b03 0%, #1c1206 60%, #2b1c0a 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,210,77,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,210,77,1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(70% 70% at 50% 40%, #000, transparent)',
          WebkitMaskImage: 'radial-gradient(70% 70% at 50% 40%, #000, transparent)',
        }}
      />

      {/* Pumpjack silhouettes */}
      <Pumpjack className="absolute -bottom-1 start-[2%] w-40 text-brown-700/70 sm:w-56" />
      <Pumpjack className="absolute -bottom-1 end-[4%] hidden w-72 text-brown-800 sm:block" />
      <Pumpjack className="absolute bottom-2 end-[34%] hidden w-32 text-brown-700/40 lg:block" />

      {/* Rising droplets */}
      {DROPS.map((d, i) => (
        <span
          key={i}
          className="drop"
          style={{
            left: `${d.left}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

/** Animated liquid wave that blends the hero into the next (light) section. */
export function Wave() {
  const path =
    'M0 60 C 150 100 300 20 450 60 C 600 100 750 20 900 60 C 1050 100 1200 20 1350 60 C 1500 100 1650 20 1800 60 C 1950 100 2100 20 2250 60 C 2400 100 2550 20 2700 60 L2700 120 L0 120 Z'
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 overflow-hidden sm:h-28" dir="ltr">
      <svg
        className="wave slow absolute bottom-0 h-full w-[200%] text-gold-500/35"
        viewBox="0 0 2700 120"
        preserveAspectRatio="none"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
      <svg
        className="wave absolute bottom-0 h-full w-[200%] text-fog"
        viewBox="0 0 2700 120"
        preserveAspectRatio="none"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    </div>
  )
}
