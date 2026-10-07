export type Lang = 'ar' | 'en'
export type Kind = 'pump' | 'barrel' | 'gas'
export type Tone = 'dark' | 'gold' | 'blue'

export interface CostCard {
  kind: Kind
  label: string
  product: string
  value: string
  unit: string
  tone: Tone
}

export interface CostsLang {
  date: string
  cards: CostCard[]
}

export type CostsPayload = Record<Lang, CostsLang>

export interface Station {
  name: string
  area: string
  status: string
  d: string
  points: string[]
}

export type StationsPayload = Record<Lang, { locations: Station[] }>

export interface Stats {
  totals: {
    totalViews: number
    uniqueVisitors: number
    todayViews: number
    todayVisitors: number
    last7Views: number
    last7Visitors: number
  }
  range: { days: number; views: number; visitors: number }
  series: { date: string; views: number; visitors: number }[]
  langs: Record<Lang, number>
  paths: { name: string; count: number }[]
  referrers: { name: string; count: number }[]
}
