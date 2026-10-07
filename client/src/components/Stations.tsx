import { useLang } from '../i18n'
import { useSiteContent } from '../siteContent'
import { STATIONS_ROUTE, getStationsContent, getStationsPageContent } from '../pages/Stations'
import { Pumpjack } from './Backdrop'
import { CheckIcon, DivisionIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHead } from './Sections'

export function Stations() {
  const { lang } = useLang()
  const content = useSiteContent()
  const s = getStationsContent(lang, content)
  const page = getStationsPageContent(lang, content)

  return (
    <section id={STATIONS_ROUTE.id} className="relative min-h-screen overflow-hidden bg-brown-900 px-4 pb-16 pt-24 sm:px-6 sm:pb-28 sm:pt-32">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 50% at 15% 30%, rgba(224,168,46,0.16), transparent 70%), radial-gradient(40% 40% at 90% 90%, rgba(194,143,38,0.12), transparent 70%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(240,210,122,1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,210,122,1) 1px, transparent 1px)',
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
                <article className="relative h-full overflow-hidden rounded-3xl bg-white p-5 shadow-2xl sm:p-7 shadow-black/10 ring-1 ring-white/10">
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
