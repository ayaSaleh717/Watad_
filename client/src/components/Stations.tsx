import { useLang } from '../i18n'
import { useSiteContent } from '../siteContent'
import { STATIONS_ROUTE, getStationsContent, getStationsPageContent } from '../pages/Stations'
import { Pumpjack } from './Backdrop'
import { CheckIcon, DivisionIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHead } from './Sections'

/** Animated refinery illustration: distillation towers, tanks, flowing pipes, flare and vapor. */
function Refinery({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 300" className={className} aria-hidden="true" style={{ direction: 'ltr' }}>
      <defs>
        <linearGradient id="st-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffc61a" />
          <stop offset="1" stopColor="#c98d08" />
        </linearGradient>
        <linearGradient id="st-steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5a3b0c" />
          <stop offset="1" stopColor="#2b1c0a" />
        </linearGradient>
        <radialGradient id="st-flame" cx="0.5" cy="0.8" r="0.7">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="0.5" stopColor="#fdc324" />
          <stop offset="1" stopColor="#d79a0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground */}
      <rect x="0" y="268" width="420" height="32" fill="#120b03" />
      <rect x="0" y="266" width="420" height="3" fill="url(#st-gold)" opacity="0.7" />

      {/* storage tanks */}
      <g>
        <rect x="18" y="206" width="72" height="62" rx="10" fill="url(#st-steel)" />
        <rect x="18" y="206" width="72" height="62" rx="10" fill="none" stroke="#fbb40b" strokeOpacity="0.5" />
        <path d="M18 226h72M18 246h72" stroke="#fbb40b" strokeOpacity="0.25" />
        <rect x="104" y="226" width="50" height="42" rx="8" fill="url(#st-steel)" />
        <rect x="104" y="226" width="50" height="42" rx="8" fill="none" stroke="#fbb40b" strokeOpacity="0.5" />
      </g>

      {/* towers */}
      <g>
        <rect x="170" y="62" width="50" height="206" rx="12" fill="url(#st-gold)" />
        <path d="M170 104h50M170 146h50M170 188h50M170 228h50" stroke="#2b1c0a" strokeOpacity="0.45" strokeWidth="3" />
        <rect x="232" y="108" width="40" height="160" rx="10" fill="url(#st-steel)" />
        <rect x="232" y="108" width="40" height="160" rx="10" fill="none" stroke="#fbb40b" strokeOpacity="0.55" />
        <path d="M232 148h40M232 188h40M232 228h40" stroke="#fbb40b" strokeOpacity="0.3" />
        <rect x="186" y="48" width="18" height="16" rx="3" fill="#d79a0b" />
      </g>

      {/* flare stack */}
      <rect x="340" y="132" width="9" height="136" rx="2" fill="#4a3010" />
      <path d="M344.5 132c-12-8-8-24 0-34 8 10 12 26 0 34z" className="flame" fill="url(#st-flame)" />

      {/* pipes (animated flow) */}
      <g fill="none" stroke="#ffd24d" strokeWidth="3" strokeLinecap="round">
        <path className="flow-pipe" d="M90 246H150V226H104" opacity="0.9" />
        <path className="flow-pipe" d="M154 247H170" />
        <path className="flow-pipe" d="M220 150H232" />
        <path className="flow-pipe" d="M272 196H344.5V268" />
      </g>

      {/* vapor */}
      <g fill="#fff" opacity="0">
        {[0, 1.3, 2.6].map((d, i) => (
          <circle key={d} className="vapor" cx={195 + i * 4} cy="44" r={5 + i} style={{ animationDelay: `${d}s` }} />
        ))}
      </g>
    </svg>
  )
}

export function Stations() {
  const { lang } = useLang()
  const content = useSiteContent()
  const s = getStationsContent(lang, content)
  const page = getStationsPageContent(lang, content)

  return (
    <section id={STATIONS_ROUTE.id} className="relative min-h-screen overflow-hidden bg-brown-900 px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-32">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 50% at 15% 30%, rgba(251,180,11,0.16), transparent 70%), radial-gradient(40% 40% at 90% 90%, rgba(215,154,11,0.12), transparent 70%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,210,77,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,210,77,1) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(70% 65% at 50% 42%, #000, transparent)',
            WebkitMaskImage: 'radial-gradient(70% 65% at 50% 42%, #000, transparent)',
          }}
        />
        <Pumpjack className="absolute -bottom-1 -start-12 w-56 text-brown-950/50 sm:w-72 lg:w-80" />
        <Pumpjack className="absolute -bottom-3 -end-20 hidden w-[26rem] text-gold-500/15 sm:block lg:w-[32rem]" />
        <Pumpjack className="absolute bottom-24 end-[28%] hidden w-40 text-brown-800/35 lg:block" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <SectionHead eyebrow={s.eyebrow} title={s.title} sub={s.sub} light />

        <div className="mt-14">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-black text-gold-300">{page.locationsT}</h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-white/70">{page.locationsSub}</p>
              </div>
              <span className="inline-flex w-fit items-center rounded-full bg-gold-500/15 px-4 py-2 text-sm font-bold text-gold-300 ring-1 ring-gold-400/30">
                {page.moreSoon}
              </span>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {page.locations.map((station, i) => (
              <Reveal key={station.name} delay={i * 0.1}>
                <article className="relative h-full overflow-hidden rounded-3xl bg-white p-7 shadow-2xl shadow-black/10 ring-1 ring-white/10">
                  <div className="absolute -end-12 -top-12 h-40 w-40 rounded-full bg-gold-500/20 blur-2xl" />
                  <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl rounded-ss-md bg-gradient-to-br from-gold-300 to-gold-600 text-brown-950 shadow-lg shadow-gold-500/30">
                      <DivisionIcon name="markets" className="h-10 w-10" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-2xl font-black text-brown-900">{station.name}</h4>
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-500/25">
                          {station.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-bold text-gold-700">{station.area}</div>
                      <p className="mt-3 leading-relaxed text-ink/75">{station.d}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {station.points.map((point) => (
                          <li
                            key={point}
                            className="inline-flex items-center gap-2 rounded-full bg-brown-900/5 px-3 py-1.5 text-sm font-bold text-ink/75"
                          >
                            <CheckIcon className="h-4 w-4 text-gold-700" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div className="rounded-[2rem] bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur sm:p-6">
              <Refinery className="h-auto w-full" />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h3 className="text-xl font-black text-gold-300">{s.flowT}</h3>
            </Reveal>
            <div role="list" className="mt-6 grid gap-4 sm:grid-cols-2">
              {s.flow.map((step, i) => (
                <Reveal key={step.t} delay={i * 0.1}>
                  <div
                    role="listitem"
                    className="flex h-full items-start gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10 hover:ring-gold-500/50"
                  >
                    <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 font-black text-brown-950">
                      <span
                        className="absolute inset-0 rounded-full bg-gold-400/40"
                        style={{ animation: 'pulse-ring 2.4s ease-out infinite', animationDelay: `${i * 0.4}s` }}
                      />
                      <span className="relative">{i + 1}</span>
                    </span>
                    <div>
                      <div className="font-extrabold text-white">{step.t}</div>
                      <div className="mt-0.5 text-sm text-white/65">{step.d}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {s.types.map((it, i) => (
            <Reveal key={it.key} delay={i * 0.12}>
              <article className="group relative h-full overflow-hidden rounded-3xl bg-white p-7 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold-500/25">
                {it.soon && (
                  <span className="absolute end-4 top-4 rounded-full bg-violet-500 px-2.5 py-0.5 text-xs font-bold text-white">
                    {s.soon}
                  </span>
                )}
                <div className="grid h-14 w-14 place-items-center rounded-2xl rounded-ss-sm bg-gradient-to-br from-gold-400 to-gold-600 text-brown-950 shadow-lg shadow-gold-500/30 transition group-hover:rotate-6">
                  <DivisionIcon name={it.key} className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-black text-brown-900">{it.t}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{it.d}</p>
                <ul className="mt-5 space-y-2.5 border-t border-black/5 pt-5">
                  {it.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm font-semibold text-ink/80">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-500/20 text-gold-700">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
