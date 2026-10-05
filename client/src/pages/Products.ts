import { ar, en } from '../content'
import type { Lang } from '../i18n'
import type { SiteContent } from '../siteContent'

export type ProductItemData = {
  t: string
  d: string
  tag: string
}

export type ProductsContent = {
  eyebrow: string
  title: string
  sub: string
  items: ProductItemData[]
}

const fallbackData: Record<Lang, { products: ProductsContent }> = {
  ar: { products: ar.products },
  en: { products: en.products },
}

export function getProductsContent(lang: Lang, content: SiteContent): ProductsContent {
  const productsData = content as Partial<Record<Lang, { products?: ProductsContent }>>
  return productsData[lang]?.products ?? fallbackData[lang].products
}
