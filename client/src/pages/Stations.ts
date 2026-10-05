import data from '../data.json'
import type { Lang } from '../i18n'
import type { SiteContent } from '../siteContent'

export const STATIONS_ROUTE = {
  id: 'stations',
  href: '/stations',
} as const

export type StationsContent = {
  eyebrow: string
  title: string
  sub: string
  flowT: string
  flow: { t: string; d: string }[]
  soon: string
  types: {
    key: string
    t: string
    d: string
    soon: boolean
    points: string[]
  }[]
}

export type StationsPageContent = {
  locationsT: string
  locationsSub: string
  moreSoon: string
  locations: {
    name: string
    area: string
    status: string
    d: string
    points: string[]
  }[]
}

const fallbackData = data as Record<Lang, { stations: StationsContent; stationsPage: StationsPageContent }>

export function getStationsContent(lang: Lang, content: SiteContent = data): StationsContent {
  const stationsData = content as Record<Lang, { stations: StationsContent; stationsPage: StationsPageContent }>
  return stationsData[lang]?.stations ?? fallbackData[lang].stations
}

export function getStationsPageContent(lang: Lang, content: SiteContent = data): StationsPageContent {
  const stationsData = content as Record<Lang, { stations: StationsContent; stationsPage: StationsPageContent }>
  return stationsData[lang]?.stationsPage ?? fallbackData[lang].stationsPage
}
