import { useState, type CSSProperties } from 'react'

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
        <circle cx="168" cy="108" r="3" fill="#241911" />
      </g>
    </svg>
  )
}

interface DropSpec {
  x: number // spawn offset from the centre (% of width)
  y: number // spawn offset from the centre (% of height)
  dx: number // travel distance (vw)
  dy: number // travel distance (svh)
  rot: number // so the drop's tip points along its path
  size: number
  delay: number
  duration: number
}

const DROP_COUNT = 30

// Deterministic so SSR/StrictMode renders are stable. Drops start inside the headline area
// and fly outwards in all directions, like spray bursting out of the text.
const DROPS: DropSpec[] = Array.from({ length: DROP_COUNT }, (_, i) => {
  const jitter = (((i * 53) % 17) / 17 - 0.5) * 0.6
  const angle = (i / DROP_COUNT) * Math.PI * 2 + jitter
  const dist = 0.55 + (((i * 29) % 11) / 11) * 0.45
  const dx = Math.cos(angle) * 46 * dist
  const dy = Math.sin(angle) * 44 * dist
  return {
    x: (((i * 37) % 21) / 21 - 0.5) * 34,
    y: (((i * 23) % 13) / 13 - 0.5) * 16,
    dx,
    dy,
    rot: (Math.atan2(dx, -dy) * 180) / Math.PI - 45,
    size: 6 + ((i * 5) % 9),
    delay: (i * 0.37) % 6,
    duration: 4.5 + ((i * 7) % 6) * 0.7,
  }
})

/** Animated hero background: glow, pumpjacks, droplets spraying out of the headline and an optional video. */
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
            'radial-gradient(60% 55% at 50% 42%, rgba(224,168,46,0.24), transparent 70%), radial-gradient(50% 50% at 10% 90%, rgba(194,143,38,0.2), transparent 70%), linear-gradient(180deg, #181009 0%, #241911 60%, #34261a 100%)',
        }}
      />

      {/* Pumpjack silhouettes */}
      <Pumpjack className="absolute bottom-12 start-[2%] w-32 text-brown-700/70 sm:bottom-20 sm:w-52" />
      <Pumpjack className="absolute bottom-12 end-[4%] hidden w-64 text-brown-800 sm:bottom-20 sm:block" />
      <Pumpjack className="absolute bottom-24 end-[34%] hidden w-28 text-brown-700/40 lg:block" />

      {/* Droplets bursting out of the headline */}
      {DROPS.map((d, i) => (
        <span
          key={i}
          className="drop"
          style={
            {
              left: `${50 + d.x}%`,
              top: `${46 + d.y}%`,
              width: d.size,
              height: d.size,
              '--dx': `${d.dx.toFixed(1)}vw`,
              '--dy': `${d.dy.toFixed(1)}svh`,
              '--rot': `${d.rot.toFixed(1)}deg`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
            } as CSSProperties
          }
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
