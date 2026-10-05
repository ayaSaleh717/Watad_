import { useLang } from '../i18n'
import { Logo } from './Logo'

export function Footer() {
  const { t } = useLang()
  return (
    <footer className="border-t border-gold-500/20 bg-brown-950 px-4 py-10 text-white/70 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-start">
        <Logo markClass="h-10" className="text-base" />
        <p className="text-sm font-semibold tracking-wide text-gold-300">{t.footer.tagline}</p>
        <p className="text-sm">
          © {new Date().getFullYear()} {t.nav.home === 'Home' ? 'Watad Petroleum' : 'وتد للبترول'} · {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
