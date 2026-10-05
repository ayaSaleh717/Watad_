import { useEffect, useState } from 'react'
import { setToken, hasToken, setUnauthorizedHandler } from './api'
import { IconChart, IconExternal, IconOut, IconPin, IconTag, ToastProvider } from './components/ui'
import { useI18n } from './i18n'
import { Login } from './pages/Login'
import { Overview } from './pages/Overview'
import { Prices } from './pages/Prices'
import { Products } from './pages/Products'
import { Stations } from './pages/Stations'

type Page = 'overview' | 'prices' | 'stations' | 'products'

const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'http://localhost:5173'

function readPage(): Page {
  const hash = window.location.hash.replace(/^#\/?/, '')
  return hash === 'prices' || hash === 'stations' || hash === 'products' ? hash : 'overview'
}

const navItems = [
  { id: 'overview', Icon: IconChart },
  { id: 'prices', Icon: IconTag },
  { id: 'stations', Icon: IconPin },
  { id: 'products', Icon: IconTag },
] as const

export default function App() {
  const { t, toggle } = useI18n()
  const [authed, setAuthed] = useState(hasToken)
  const [page, setPage] = useState<Page>(readPage)

  useEffect(() => {
    setUnauthorizedHandler(() => setAuthed(false))
  }, [])

  useEffect(() => {
    const onHash = () => {
      setPage(readPage())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (!authed) return <Login onLoggedIn={() => setAuthed(true)} />

  const signOut = () => {
    setToken(null)
    setAuthed(false)
  }

  const navLink = (id: Page, Icon: typeof IconChart, mobile: boolean) => (
    <a
      key={id}
      href={`#/${id}`}
      aria-current={page === id ? 'page' : undefined}
      className={
        mobile
          ? `flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-black transition ${
              page === id ? 'bg-gold-500 text-brown-950' : 'text-white/75 hover:bg-white/10'
            }`
          : `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-black transition ${
              page === id ? 'bg-gold-500 text-brown-950' : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`
      }
    >
      <Icon className="h-5 w-5" />
      {t.nav[id]}
    </a>
  )

  const langButton = (
    <button
      type="button"
      onClick={toggle}
      className="rounded-lg px-3 py-1.5 text-sm font-black text-gold-300 ring-1 ring-white/20 transition hover:bg-white/10"
    >
      {t.nav.otherLang}
    </button>
  )

  return (
    <ToastProvider>
      <div className="min-h-screen lg:flex">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col bg-brown-950 p-5 lg:sticky lg:top-0 lg:flex lg:h-screen">
          <div className="flex items-center gap-3 px-2 pb-8 pt-2">
            <img src="/logo-mark.svg" alt="" className="h-11 w-auto" />
            <div>
              <div className="text-base font-black leading-tight text-gold-400">{t.brand.name}</div>
              <div className="text-xs font-bold text-white/55">{t.brand.sub}</div>
            </div>
          </div>

          <nav className="space-y-1.5" aria-label={t.brand.sub}>
            {navItems.map(({ id, Icon }) => navLink(id, Icon, false))}
          </nav>

          <div className="mt-auto space-y-2 border-t border-white/10 pt-4">
            <a
              href={SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <IconExternal className="h-4 w-4" />
              {t.nav.viewSite}
            </a>
            <button
              type="button"
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <IconOut className="h-4 w-4" />
              {t.nav.signOut}
            </button>
            <div className="px-1 pt-1">{langButton}</div>
          </div>
        </aside>

        {/* Mobile header */}
        <header className="sticky top-0 z-40 bg-brown-950 px-4 pb-3 pt-3 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img src="/logo-mark.svg" alt="" className="h-8 w-auto" />
              <span className="text-sm font-black text-gold-400">{t.brand.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {langButton}
              <button
                type="button"
                onClick={signOut}
                aria-label={t.nav.signOut}
                title={t.nav.signOut}
                className="grid h-9 w-9 place-items-center rounded-lg text-white/75 ring-1 ring-white/20 hover:bg-white/10"
              >
                <IconOut className="h-4 w-4" />
              </button>
            </div>
          </div>
          <nav className="mt-3 flex gap-1.5" aria-label={t.brand.sub}>
            {navItems.map(({ id, Icon }) => navLink(id, Icon, true))}
          </nav>
        </header>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">
          <div className="mx-auto max-w-5xl">
            {/* Pages stay mounted so unsaved edits survive switching tabs. */}
            <div hidden={page !== 'overview'}>
              <Overview active={page === 'overview'} />
            </div>
            <div hidden={page !== 'prices'}>
              <Prices />
            </div>
            <div hidden={page !== 'stations'}>
              <Stations />
            </div>
            <div hidden={page !== 'products'}>
              <Products />
            </div>
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}
