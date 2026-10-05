import data from '../data.json'
import type { Lang } from '../i18n'
import type { SiteContent } from '../siteContent'

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
  chart: {
    title: string
    sub: string
    source: string
    points: { m: string; v: number }[]
  }
}

const fallbackData = data as Record<Lang, { costs: CostsContent }>

export function getCostsContent(lang: Lang, content: SiteContent = data): CostsContent {
  const costsData = content as Record<Lang, { costs: CostsContent }>
  return costsData[lang]?.costs ?? fallbackData[lang].costs
}
