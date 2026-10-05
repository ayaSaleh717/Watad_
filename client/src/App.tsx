import { useCallback, useEffect, useState } from 'react'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Prices } from './components/Prices'
import { About, Divisions, Hse, Journey, Products } from './components/Sections'
import { Splash } from './components/Splash'
import { Stations } from './components/Stations'
import { COSTS_ROUTE } from './pages/Costs'
import { STATIONS_ROUTE } from './pages/Stations'
import { useLang } from './i18n'
import { reportSiteVisit } from './siteContent'

type Route = 'home' | 'costs' | 'stations'

function normalizePath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized || '/'
}

function readRoute(pathname = window.location.pathname): Route {
  switch (normalizePath(pathname)) {
    case COSTS_ROUTE.href:
      return 'costs'
    case STATIONS_ROUTE.href:
      return 'stations'
    default:
      return 'home'
  }
}

function isAppRoute(pathname: string) {
  const path = normalizePath(pathname)
  return path === '/' || path === COSTS_ROUTE.href || path === STATIONS_ROUTE.href
}

function scrollToHash(hash: string) {
  if (!hash) {
    window.scrollTo({ top: 0 })
    return
  }

  try {
    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (target) {
      target.scrollIntoView()
      return
    }
  } catch {
    /* keep the route usable if a malformed hash appears */
  }

  window.scrollTo({ top: 0 })
}

function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Divisions />
      <Products />
      <Journey />
      <Hse />
      <Contact />
    </main>
  )
}

export default function App() {
  const { lang } = useLang()
  const [ready, setReady] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [route, setRoute] = useState<Route>(() => readRoute())

  const onDone = useCallback(() => setShowSplash(false), [])

  // Start the hero entrance just as the blur begins to clear.
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 3000)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const syncRoute = () => {
      setRoute(readRoute())
      window.requestAnimationFrame(() => scrollToHash(window.location.hash))
    }

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      if (!(event.target instanceof Element)) return

      const anchor = event.target.closest<HTMLAnchorElement>('a[href]')
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return

      const url = new URL(anchor.href)
      if (url.origin !== window.location.origin || !isAppRoute(url.pathname)) return

      event.preventDefault()

      const destination = `${url.pathname}${url.hash}`
      const current = `${window.location.pathname}${window.location.hash}`
      if (destination !== current) {
        window.history.pushState(null, '', destination)
      }

      setRoute(readRoute(url.pathname))
      window.requestAnimationFrame(() => scrollToHash(url.hash))
    }

    document.addEventListener('click', onClick)
    window.addEventListener('popstate', syncRoute)
    window.requestAnimationFrame(() => scrollToHash(window.location.hash))

    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', syncRoute)
    }
  }, [])

  useEffect(() => {
    reportSiteVisit(lang)
  }, [lang, route])

  return (
    <div data-ready={ready}>
      {showSplash && <Splash onDone={onDone} />}
      <Navbar />
      {route === 'home' && <HomePage />}
      {route === 'costs' && (
        <main>
          <Prices />
        </main>
      )}
      {route === 'stations' && (
        <main>
          <Stations />
        </main>
      )}
      <Footer />
    </div>
  )
}
