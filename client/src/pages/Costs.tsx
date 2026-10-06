import data from '../../../data.json'
import type { Lang } from '../i18n'
import type { SiteContent } from '../siteContent'
import { useLang } from '../i18n'
import { useSiteContent } from '../siteContent'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/Sections'

export const COSTS_ROUTE = {
  id: 'costs',
  href: '/costs',
} as const

export type CostCardData = {
  kind: 'pump' | 'barrel' | 'gas'
  label: string
  product: string
  value: string
  unit: string
  tone: 'dark' | 'gold' | 'blue'
}

export type CostsContent = {
  eyebrow: string
  title: string
  sub: string
  dateLabel: string
  date: string
  unit: string
  cards: CostCardData[]
}

const fallbackData = data as Record<Lang, { costs: CostsContent }>

export function getCostsContent(lang: Lang, content: SiteContent = data): CostsContent {
  const costsData = content as Record<Lang, { costs: CostsContent }>
  return costsData[lang]?.costs ?? fallbackData[lang].costs
}

const toneClass = {
  dark: {
    body: 'from-brown-950 via-brown-800 to-brown-950',
    accent: 'bg-gold-400',
    text: 'text-gold-300',
  },
  gold: {
    body: 'from-gold-700 via-gold-500 to-gold-300',
    accent: 'bg-red-700',
    text: 'text-brown-950',
  },
  blue: {
    body: 'from-sky-800 via-sky-600 to-sky-500',
    accent: 'bg-sky-200',
    text: 'text-white',
  },
}

function classes(tone: string) {
  return toneClass[tone as keyof typeof toneClass] ?? toneClass.dark
}

function FuelPumpFigure({ card }: { card: CostCardData }) {
  const c = classes(card.tone)

  return (
    <div className="relative mx-auto h-48 w-40" style={{ direction: 'ltr' }} aria-hidden="true">
      <div className={`absolute bottom-3 left-4 h-36 w-24 rounded-t-2xl bg-gradient-to-r ${c.body} shadow-xl`}>
        <div className="absolute left-3 right-3 top-4 rounded-lg bg-white px-2 py-1 text-center font-black text-brown-950 ring-4 ring-brown-950/80">
          <span className="text-xl leading-none">{card.value}</span>
          <span className="ms-1 text-[10px]">{card.unit}</span>
        </div>
        <div className="absolute left-4 right-4 top-16 h-1.5 rounded-full bg-white/85" />
        <div className={`absolute bottom-5 left-1/2 h-5 w-3 -translate-x-1/2 rounded-full ${c.accent}`} />
        <div className="absolute -bottom-3 -left-3 -right-3 h-4 rounded-full bg-brown-950" />
      </div>
      <div className={`absolute left-[104px] top-[58px] h-12 w-4 rounded-sm ${c.accent}`} />
      <div className={`absolute left-[108px] top-[68px] h-28 w-5 rounded-full border-[10px] border-l-0 border-current ${c.text}`} />
      <div className={`absolute left-[112px] top-[52px] h-5 w-11 rotate-[32deg] rounded-e-full ${c.accent}`} />
    </div>
  )
}

function BarrelFigure({ card }: { card: CostCardData }) {
  const c = classes(card.tone)

  return (
    <div className="relative mx-auto h-48 w-40" aria-hidden="true">
      <div className={`absolute inset-x-5 bottom-4 top-8 rounded-xl bg-gradient-to-r ${c.body} shadow-xl`}>
        <div className="absolute inset-x-0 top-6 h-3 bg-black/25" />
        <div className="absolute inset-x-0 bottom-6 h-3 bg-black/25" />
        <div className="absolute -left-2 top-10 h-5 w-5 rounded-full bg-brown-950" />
        <div className="absolute -right-2 top-10 h-5 w-5 rounded-full bg-brown-950" />
        <div className="absolute inset-0 grid place-items-center px-4 text-center">
          <div>
            <div className="text-2xl font-black text-white">{card.value}</div>
            <div className="mt-1 text-sm font-black text-gold-300">{card.unit}</div>
          </div>
        </div>
        <div className="absolute left-1/2 top-5 h-6 w-4 -translate-x-1/2 rounded-full bg-white" />
      </div>
    </div>
  )
}

function GasFigure({ card }: { card: CostCardData }) {
  const c = classes(card.tone)

  return (
    <div className="relative mx-auto h-48 w-40" aria-hidden="true">
      <div className="absolute left-1/2 top-2 h-7 w-16 -translate-x-1/2 rounded-t-xl border-4 border-sky-700 bg-white" />
      <div className={`absolute inset-x-7 bottom-4 top-10 rounded-[2rem] bg-gradient-to-r ${c.body} shadow-xl`}>
        <div className="absolute inset-x-4 top-9 h-2 rounded-full bg-white/85" />
        <div className="absolute inset-x-4 bottom-9 h-2 rounded-full bg-white/85" />
        <div className="absolute inset-0 grid place-items-center px-4 text-center">
          <div>
            <div className="text-3xl font-black text-white">{card.value}</div>
            <div className="mt-1 text-sm font-black text-sky-100">{card.unit}</div>
          </div>
        </div>
        <div className="absolute left-1/2 bottom-5 h-5 w-3 -translate-x-1/2 rounded-full bg-white" />
      </div>
    </div>
  )
}

function PriceFigure({ card }: { card: CostCardData }) {
  if (card.kind === 'barrel') return <BarrelFigure card={card} />
  if (card.kind === 'gas') return <GasFigure card={card} />
  return <FuelPumpFigure card={card} />
}

export function CostsSection() {
  const { lang } = useLang()
  const content = useSiteContent()
  const p = getCostsContent(lang, content)

  return (
    <section id={COSTS_ROUTE.id} className="min-h-screen bg-white px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow={p.eyebrow} title={p.title} sub={p.sub} />

        <Reveal>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-gold-500/15 px-4 py-2 text-sm font-black text-gold-700 ring-1 ring-gold-500/30">
              {p.dateLabel}: {p.date}
            </span>
            <span className="rounded-full bg-brown-900 px-4 py-2 text-sm font-black text-gold-300">
              {p.unit}
            </span>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {p.cards.map((card, i) => (
            <Reveal key={`${card.product}-${card.label}`} delay={i * 0.08}>
              <article className="group h-full rounded-3xl bg-fog p-5 text-center ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-gold-500/15">
                <div className="text-sm font-black text-brown-900">{card.label}</div>
                <PriceFigure card={card} />
                <h3 className="text-lg font-black text-brown-900">{card.product}</h3>
                <div className="mt-2 inline-flex items-baseline gap-1 rounded-full bg-white px-4 py-2 font-black text-brown-950 ring-1 ring-black/5">
                  <span className="text-2xl">{card.value}</span>
                  <span className="text-xs text-ink/65">{card.unit}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}

export function CostsPage() {
  return (
    <main>
      <CostsSection />
    </main>
  )
}
