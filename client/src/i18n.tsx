import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ar, en, type Dict } from './content'

export type Lang = 'ar' | 'en'

interface LangCtx {
  lang: Lang
  dir: 'rtl' | 'ltr'
  t: Dict
  toggle: () => void
}

const Ctx = createContext<LangCtx | null>(null)

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('watad-lang')
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    /* storage unavailable */
  }
  return 'ar'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  const value = useMemo<LangCtx>(
    () => ({
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      t: lang === 'ar' ? ar : en,
      toggle: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')),
    }),
    [lang],
  )

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = value.dir
    document.title = value.t.meta.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', value.t.meta.description)
    try {
      localStorage.setItem('watad-lang', lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang, value])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
