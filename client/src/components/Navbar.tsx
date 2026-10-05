import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { COSTS_ROUTE } from '../pages/Costs'
import { STATIONS_ROUTE } from '../pages/Stations'
import { Logo } from './Logo'

const LINKS = ['home', 'about', 'divisions', 'products', 'hse', 'contact'] as const
const MORE_LINKS = [
  { key: 'prices', href: COSTS_ROUTE.href },
  { key: 'stations', href: STATIONS_ROUTE.href },
] as const

function homeHref(key: (typeof LINKS)[number]) {
  return `/#${key}`
}

export function Navbar() {
  const { t, toggle, lang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false)
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const desktopMoreRef = useRef<HTMLLIElement>(null)

  const closeMenus = () => {
    setOpen(false)
    setDesktopMoreOpen(false)
    setMobileMoreOpen(false)
  }

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(y / max, 1) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (desktopMoreRef.current?.contains(event.target as Node)) return
      setDesktopMoreOpen(false)
    }

    window.addEventListener('mousedown', onPointerDown)
    return () => window.removeEventListener('mousedown', onPointerDown)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'bg-brown-950/85 shadow-lg shadow-black/20 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div
        className="absolute inset-x-0 top-0 h-[3px] origin-left bg-gradient-to-r from-gold-600 to-gold-300 rtl:origin-right"
        style={{ transform: `scaleX(${progress})` }}
      />
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/#home" aria-label="Watad Petroleum" onClick={closeMenus}>
          <Logo markClass="h-9" className="text-base" />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((k) => (
            <li key={k}>
              <a
                href={homeHref(k)}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-gold-300"
              >
                {t.nav[k]}
              </a>
            </li>
          ))}
          <li ref={desktopMoreRef} className="relative">
            <button
              type="button"
              onClick={() => setDesktopMoreOpen((value) => !value)}
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-gold-300"
              aria-expanded={desktopMoreOpen}
              aria-controls="desktop-more-menu"
            >
              <span>{t.nav.more}</span>
              <span className={`text-xs transition ${desktopMoreOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                ▾
              </span>
            </button>
            <div
              id="desktop-more-menu"
              className={`absolute end-0 top-full mt-3 w-44 overflow-hidden rounded-2xl border border-white/10 bg-brown-950/95 p-2 shadow-xl shadow-black/25 backdrop-blur transition ${
                desktopMoreOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
              }`}
            >
              {MORE_LINKS.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={closeMenus}
                  className="block rounded-xl px-3 py-2.5 text-sm font-bold text-white/85 transition hover:bg-white/10 hover:text-gold-300"
                >
                  {t.nav[item.key]}
                </a>
              ))}
            </div>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="rounded-full border border-gold-500/60 px-4 py-1.5 text-sm font-bold text-gold-300 transition hover:bg-gold-500 hover:text-brown-950"
            aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            {t.langBtn}
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-white lg:hidden"
            onClick={() => {
              setOpen((value) => !value)
              setMobileMoreOpen(false)
            }}
            aria-expanded={open}
            aria-label="Menu"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute inset-x-0 h-0.5 rounded bg-current transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
              />
              <span
                className={`absolute inset-x-0 top-1.5 h-0.5 rounded bg-current transition-opacity ${open ? 'opacity-0' : ''}`}
              />
              <span
                className={`absolute inset-x-0 h-0.5 rounded bg-current transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`grid overflow-hidden transition-all duration-500 lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <ul className="min-h-0 overflow-hidden px-4 sm:px-6">
          {LINKS.map((k) => (
            <li key={k}>
              <a
                href={homeHref(k)}
                onClick={closeMenus}
                className="block border-t border-white/10 py-3.5 text-base font-semibold text-white/90"
              >
                {t.nav[k]}
              </a>
            </li>
          ))}
          <li className="border-t border-white/10">
            <button
              type="button"
              onClick={() => setMobileMoreOpen((value) => !value)}
              className="flex w-full items-center justify-between py-3.5 text-base font-semibold text-white/90"
              aria-expanded={mobileMoreOpen}
              aria-controls="mobile-more-menu"
            >
              <span>{t.nav.more}</span>
              <span className={`text-xs transition ${mobileMoreOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                ▾
              </span>
            </button>
            <div
              id="mobile-more-menu"
              className={`grid overflow-hidden transition-all duration-300 ${mobileMoreOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="min-h-0 overflow-hidden pb-2 ps-4">
                {MORE_LINKS.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={closeMenus}
                    className="block rounded-xl px-3 py-2.5 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-gold-300"
                  >
                    {t.nav[item.key]}
                  </a>
                ))}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </header>
  )
}
