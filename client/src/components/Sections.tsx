import type { ReactNode } from 'react'
import { useLang } from '../i18n'
import { DivisionIcon } from './Icons'
import { LogoMark } from './Logo'
import { Reveal } from './Reveal'

export function SectionHead({
  eyebrow,
  title,
  sub,
  light = false,
}: {
  eyebrow: string
  title: string
  sub?: string
  light?: boolean
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <span className="inline-block rounded-full bg-gold-500/15 px-4 py-1 text-sm font-bold text-gold-700 ring-1 ring-gold-500/30 data-[light=true]:text-gold-300" data-light={light}>
        {eyebrow}
      </span>
      <h2 className={`mt-4 text-3xl font-black sm:text-4xl lg:text-5xl ${light ? 'text-white' : 'text-brown-900'}`}>
        {title}
      </h2>
      {sub && <p className={`mt-4 text-lg ${light ? 'text-white/70' : 'text-ink/70'}`}>{sub}</p>}
    </Reveal>
  )
}

function Section({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`px-4 py-20 sm:px-6 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

export function About() {
  const { t } = useLang()
  const a = t.about
  return (
    <Section id="about">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <span className="inline-block rounded-full bg-gold-500/15 px-4 py-1 text-sm font-bold text-gold-700 ring-1 ring-gold-500/30">
            {a.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-black leading-tight text-brown-900 sm:text-4xl lg:text-5xl">{a.title}</h2>
          <p className="mt-6 text-lg leading-loose text-ink/80">{a.p1}</p>
          <p className="mt-4 text-lg leading-loose text-ink/80">{a.p2}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <h3 className="font-extrabold text-gold-700">{a.visionT}</h3>
              <p className="mt-2 text-ink/80">{a.vision}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <h3 className="font-extrabold text-gold-700">{a.missionT}</h3>
              <p className="mt-2 text-ink/80">{a.mission}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative overflow-hidden rounded-[2rem] bg-brown-900 p-8 text-white shadow-2xl sm:p-10">
            <LogoMark className="pointer-events-none absolute -end-10 -top-10 h-56 w-auto opacity-10" />
            <h3 className="relative text-2xl font-black text-gold-300">{a.valuesT}</h3>
            <ul className="relative mt-6 space-y-5">
              {a.values.map((v, i) => (
                <li key={v.t} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-lg font-black text-brown-950">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-extrabold">{v.t}</div>
                    <div className="text-sm text-white/70">{v.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

export function Divisions() {
  const { t } = useLang()
  const s = t.divisions
  return (
    <Section id="divisions" className="bg-white">
      <SectionHead eyebrow={s.eyebrow} title={s.title} sub={s.sub} />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {s.items.map((it, i) => (
          <Reveal key={it.key} delay={i * 0.1}>
            <article className="group relative h-full overflow-hidden rounded-3xl bg-fog p-7 ring-1 ring-black/5 transition duration-500 hover:-translate-y-2 hover:bg-brown-900 hover:shadow-2xl hover:shadow-gold-500/20">
              <div className="absolute -end-10 -top-10 h-32 w-32 rounded-full bg-gold-500/20 blur-2xl transition group-hover:bg-gold-500/40" />
              {it.soon && (
                <span className="absolute end-4 top-4 rounded-full bg-violet-500 px-2.5 py-0.5 text-xs font-bold text-white">
                  {s.soon}
                </span>
              )}
              <div className="relative grid h-14 w-14 place-items-center rounded-2xl rounded-ss-sm bg-gradient-to-br from-gold-400 to-gold-600 text-brown-950 shadow-lg shadow-gold-500/30 transition group-hover:rotate-6">
                <DivisionIcon name={it.key} className="h-7 w-7" />
              </div>
              <h3 className="relative mt-6 text-xl font-black text-brown-900 transition group-hover:text-gold-300">{it.t}</h3>
              <p className="relative mt-3 leading-relaxed text-ink/70 transition group-hover:text-white/75">{it.d}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function Journey() {
  const { t } = useLang()
  const j = t.journey
  return (
    <Section id="journey" className="bg-brown-900">
      <SectionHead eyebrow={j.eyebrow} title={j.title} light />
      <div className="relative mt-16">
        <div className="absolute inset-x-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent lg:block" />
        <div role="list" className="grid gap-10 lg:grid-cols-4 lg:gap-6">
          {j.items.map((it, i) => (
            <Reveal key={it.y} delay={i * 0.12}>
              <div role="listitem" className="relative text-center lg:text-start">
                <span className="relative mx-auto grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 font-black text-brown-950 ring-8 ring-brown-900 lg:mx-0">
                  <span className="absolute inset-0 rounded-full bg-gold-400/50" style={{ animation: 'pulse-ring 2.4s ease-out infinite', animationDelay: `${i * 0.4}s` }} />
                  <span className="relative">{i + 1}</span>
                </span>
                <div className="mt-5 text-2xl font-black text-gold-300">{it.y}</div>
                <div className="mt-1 text-lg font-extrabold text-white">{it.t}</div>
                <p className="mt-2 text-white/65">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function Hse() {
  const { t } = useLang()
  const h = t.hse
  return (
    <Section id="hse">
      <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <span className="inline-block rounded-full bg-gold-500/15 px-4 py-1 text-sm font-bold text-gold-700 ring-1 ring-gold-500/30">
            {h.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-black text-brown-900 sm:text-4xl lg:text-5xl">{h.title}</h2>
          <p className="mt-5 text-lg leading-loose text-ink/80">{h.p}</p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {h.items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.12}>
              <div className="h-full rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="h-1.5 w-12 rounded-full bg-gradient-to-r from-gold-600 to-gold-300" />
                <h3 className="mt-5 text-lg font-black text-brown-900">{it.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
