import type { CSSProperties } from 'react'
import { useLang } from '../i18n'
import { HeroBackdrop, Wave } from './Backdrop'
import { StatIcon } from './Icons'
import { LogoMark } from './Logo'
import { CountUp, Reveal } from './Reveal'

const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties

export function Hero() {
  const { t } = useLang()

  return (
    <>
      <section id="home" className="relative isolate min-h-[100svh] overflow-hidden">
        <HeroBackdrop />

        <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-4 pb-32 pt-28 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span
              className="hero-item inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-sm font-semibold text-gold-300 backdrop-blur"
              style={d(0.1)}
            >
              <span className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_10px_2px_rgba(253,195,36,0.9)]" />
              {t.hero.kicker}
            </span>

            <h1 className="mt-6 text-5xl font-black leading-[1.15] text-white sm:text-6xl lg:text-7xl">
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

            <p className="hero-item mt-6 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl" style={d(0.9)}>
              {t.hero.sub}
            </p>

            <div className="hero-item mt-9 flex flex-wrap items-center gap-3" style={d(1.1)}>
              <a
                href="#contact"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-gold-500 to-gold-400 px-7 py-3.5 text-base font-extrabold text-brown-950 shadow-[0_10px_40px_-8px_rgba(251,180,11,0.7)] transition hover:-translate-y-0.5"
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
              className="hero-item mt-8 inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-white/70 ring-1 ring-white/10 backdrop-blur"
              style={d(1.3)}
            >
              <span className="rounded-md bg-violet-500/90 px-2 py-0.5 text-xs font-bold text-white">
                {t.divisions.soon}
              </span>
              {t.hero.soon}
            </div>
          </div>

          <div className="hero-item relative mx-auto hidden aspect-square w-full max-w-md lg:block" style={d(0.5)}>
            <div className="orbit absolute inset-0 rounded-full border border-dashed border-gold-500/30" />
            <div className="orbit rev absolute inset-8 rounded-full border border-gold-400/20">
              <span className="absolute -top-1.5 start-1/2 h-3 w-3 rounded-full bg-gold-400 shadow-[0_0_16px_4px_rgba(253,195,36,0.8)]" />
            </div>
            <div className="absolute inset-16 rounded-full bg-gold-500/20 blur-3xl" />
            <LogoMark className="float absolute inset-0 m-auto h-[62%] w-auto drop-shadow-[0_20px_50px_rgba(251,180,11,0.4)]" />
          </div>
        </div>

        <Wave />
      </section>

      <section className="relative z-10 -mt-14 px-4 sm:px-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl bg-gold-500/20 shadow-2xl shadow-brown-900/10 ring-1 ring-gold-500/30 lg:grid-cols-4">
          {t.stats.map((s, i) => (
            <Reveal
              key={s.icon}
              delay={i * 0.08}
              className="group relative overflow-hidden bg-white px-5 py-7 text-center transition-colors duration-500 hover:bg-brown-900 sm:py-9"
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl rounded-ss-sm bg-gradient-to-br from-gold-400 to-gold-600 text-brown-950 shadow-lg shadow-gold-500/30 transition duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <StatIcon name={s.icon} className="h-6 w-6" />
              </span>
              <div
                className="mt-4 flex items-baseline justify-center gap-0.5 text-4xl font-black text-brown-900 transition-colors duration-500 group-hover:text-white sm:text-5xl"
                dir="ltr"
              >
                <CountUp to={s.value} />
                {s.suffix && <span className="text-2xl text-gold-600 sm:text-3xl">{s.suffix}</span>}
              </div>
              <div className="mt-2 text-sm font-semibold leading-snug text-ink/70 transition-colors duration-500 group-hover:text-white/75">
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
