import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

export function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, seen] as const
}

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`reveal ${seen ? 'in' : ''} ${className}`}
      style={{ '--d': `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  )
}

export function CountUp({ to, duration = 1600 }: { to: number; duration?: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.4)
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!seen) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to, duration])

  return <span ref={ref}>{n}</span>
}
