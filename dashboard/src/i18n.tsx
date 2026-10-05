import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ar, en, type Dict } from './dict'
import type { Lang } from './types'

interface Ctx {
  lang: Lang
  dir: 'rtl' | 'ltr'
  t: Dict
  toggle: () => void
  /** Format a number with Latin digits and locale grouping. */
  num: (n: number) => string
  /** Format a YYYY-MM-DD (UTC) date as a short label, e.g. "4 Oct". */
  shortDate: (iso: string) => string
  /** Today's date as a long label in the given language. */
  today: (lang: Lang) => string
}

const I18nCtx = createContext<Ctx | null>(null)
const KEY = 'watad-admin-lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    /* storage unavailable */
  }
  return 'ar'
}

export const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ''))

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  const value = useMemo<Ctx>(() => {
    const locale = lang === 'ar' ? 'ar-u-nu-latn' : 'en'
    const numberFmt = new Intl.NumberFormat(locale)
    const shortFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' })
    return {
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      t: lang === 'ar' ? ar : en,
      toggle: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')),
      num: (n) => numberFmt.format(n),
      shortDate: (iso) => shortFmt.format(new Date(`${iso}T00:00:00Z`)),
      today: (l) =>
        new Intl.DateTimeFormat(l === 'ar' ? 'ar-u-nu-latn' : 'en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(new Date()),
    }
  }, [lang])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = value.dir
    document.title = value.t.metaTitle
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang, value])

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nCtx)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
