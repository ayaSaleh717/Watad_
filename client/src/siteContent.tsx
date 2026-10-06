import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import fallbackData from '../../data.json'
import type { Lang } from './i18n'

export type SiteContent = typeof fallbackData

const ContentCtx = createContext<SiteContent>(fallbackData)
const CONTENT_REFRESH_MS = 5_000

const apiBase = (() => {
  const value = import.meta.env.VITE_API_BASE_URL
  return value === undefined ? 'http://localhost:4100' : value.replace(/\/$/, '')
})()

function apiUrl(path: string) {
  return `${apiBase}${path}`
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(fallbackData)

  useEffect(() => {
    const controllers = new Set<AbortController>()

    const load = () => {
      const controller = new AbortController()
      controllers.add(controller)

      fetch(apiUrl('/api/content'), { signal: controller.signal, cache: 'no-store' })
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
        .then((nextContent: SiteContent) => setContent(nextContent))
        .catch(() => {
          /* keep the current content when the admin API is offline */
        })
        .finally(() => controllers.delete(controller))
    }

    const loadIfVisible = () => {
      if (!document.hidden) load()
    }

    load()
    const interval = window.setInterval(loadIfVisible, CONTENT_REFRESH_MS)
    window.addEventListener('focus', load)
    document.addEventListener('visibilitychange', loadIfVisible)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', load)
      document.removeEventListener('visibilitychange', loadIfVisible)
      controllers.forEach((controller) => controller.abort())
    }
  }, [])

  return <ContentCtx.Provider value={content}>{children}</ContentCtx.Provider>
}

export function useSiteContent() {
  return useContext(ContentCtx)
}

function readVisitorId() {
  const key = 'watad-visitor-id'

  try {
    const saved = localStorage.getItem(key)
    if (saved) return saved
    const created =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    localStorage.setItem(key, created)
    return created
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

export function reportSiteVisit(lang: Lang) {
  const payload = {
    visitorId: readVisitorId(),
    lang,
    path: window.location.pathname || '/',
    referrer: document.referrer,
  }

  fetch(apiUrl('/api/visits'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    /* analytics should never block the public site */
  })
}
