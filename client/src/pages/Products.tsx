import data from '../fallbackContent.json'
import type { Lang } from '../i18n'
import { useLang } from '../i18n'
import type { SiteContent } from '../siteContent'
import { useSiteContent } from '../siteContent'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/Sections'

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

const fallbackData = data as Record<Lang, { products: ProductsContent }>

export function getProductsContent(lang: Lang, content: SiteContent = data): ProductsContent {
  const productsData = content as Partial<Record<Lang, { products?: ProductsContent }>>
  return productsData[lang]?.products ?? fallbackData[lang].products
}

export function Products() {
  const { lang } = useLang()
  const content = useSiteContent()
  const p = getProductsContent(lang, content)

  return (
    <section id="products" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow={p.eyebrow} title={p.title} sub={p.sub} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {p.items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.1}>
              <div className="group h-full rounded-3xl border border-gold-500/25 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-gold-500 hover:shadow-xl hover:shadow-gold-500/15">
                <span className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-bold text-gold-700">{it.tag}</span>
                <div className="my-6 flex justify-center">
                  <span className="relative grid h-20 w-20 place-items-center">
                    <span className="absolute inset-0 rotate-[-45deg] rounded-[50%_0_50%_50%] bg-gradient-to-br from-gold-300 to-gold-600 transition group-hover:scale-110" />
                    <span className="relative text-2xl font-black text-brown-950">{i + 1}</span>
                  </span>
                </div>
                <h3 className="text-lg font-black text-brown-900">{it.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
