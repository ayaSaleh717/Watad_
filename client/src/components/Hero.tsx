import type { CSSProperties } from 'react'
import { useLang } from '../i18n'
import { HeroBackdrop, Wave } from './Backdrop'
import { StatIcon } from './Icons'
import { CountUp, Reveal } from './Reveal'

const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties

export function Hero() {
  const { t } = useLang()

  return (
    <>
      <section id="home" className="relative isolate min-h-[100svh] overflow-hidden">
        <HeroBackdrop />

        <div className="relative mx-auto flex min-h-[100svh] max-w-4xl items-center justify-center px-4 pb-36 pt-28 text-center sm:px-6 sm:pb-40">
          <div className="flex flex-col items-center">
            <span
              className="hero-item inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-sm font-semibold text-gold-300 backdrop-blur"
              style={d(0.1)}
            >
              <span className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_10px_2px_rgba(253,195,36,0.9)]" />
              {t.hero.kicker}
            </span>

            <h1 className="mt-6 text-4xl font-black leading-[1.15] text-white min-[400px]:text-5xl sm:text-6xl lg:text-7xl">
              {t.hero.words.map((w, i) => (
                <span
                  key={w}
                  className={`hero-item block ${i === 2 ? 'shine' : ''}`}
                  style={d(0.25 + i * 0.18)}
                >
                  {w}
                  {i < 2 && <span className="text-gold-500">.</span>}
                </span>
              ))}
            </h1>

            <p className="hero-item mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-xl" style={d(0.9)}>
              {t.hero.sub}
            </p>

            <div className="hero-item mt-9 flex flex-wrap items-center justify-center gap-3" style={d(1.1)}>
              <a
                href="#contact"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-7 py-3.5 text-base font-extrabold text-brown-950 shadow-[0_10px_40px_-8px_rgba(224,168,46,0.7)] transition hover:-translate-y-0.5"
              >
                <span className="relative z-10">{t.hero.cta1}</span>
                <span className="absolute inset-0 -translate-x-full bg-white/30 transition duration-700 group-hover:translate-x-full rtl:translate-x-full rtl:group-hover:-translate-x-full" />
              </a>
              <a
                href="#divisions"
                className="rounded-full border border-white/25 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition hover:border-gold-400 hover:text-gold-300"
              >
                {t.hero.cta2}
              </a>
            </div>

            <div
              className="hero-item mt-8 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-white/70 ring-1 ring-white/10 backdrop-blur"
              style={d(1.3)}
            >
              <span className="rounded-md bg-violet-500/90 px-2 py-0.5 text-xs font-bold text-white">
                {t.divisions.soon}
              </span>
              {t.hero.soon}
            </div>
          </div>

        </div>

        <Wave />
      </section>

      <section className="relative z-10 -mt-12 px-4 sm:-mt-14 sm:px-6">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-gold-500/20 shadow-xl shadow-brown-900/10 ring-1 ring-gold-500/30 sm:rounded-3xl lg:grid-cols-4">
          {t.stats.map((s, i) => (
            <Reveal
              key={s.icon}
              delay={i * 0.08}
              className="group relative overflow-hidden bg-white px-3 py-4 text-center transition-colors duration-500 hover:bg-brown-900 sm:px-4 sm:py-6"
            >
              <span className="mx-auto grid h-9 w-9 place-items-center rounded-xl rounded-ss-sm sm:h-10 sm:w-10 bg-gradient-to-br from-gold-400 to-gold-600 text-brown-950 shadow-lg shadow-gold-500/30 transition duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <StatIcon name={s.icon} className="h-5 w-5" />
              </span>
              <div
                className="mt-2.5 flex items-baseline justify-center gap-0.5 text-2xl font-black text-brown-900 transition-colors duration-500 group-hover:text-white sm:mt-3 sm:text-3xl"
                dir="ltr"
              >
                <CountUp to={s.value} />
                {s.suffix && <span className="text-base text-gold-600 sm:text-xl">{s.suffix}</span>}
              </div>
              <div className="mt-1 text-xs font-semibold leading-snug text-ink/70 sm:text-[13px] transition-colors duration-500 group-hover:text-white/75">
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
