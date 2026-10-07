import { useState, type FormEvent } from 'react'
import { CONTACT } from '../content'
import { useLang } from '../i18n'
import { CheckIcon, FacebookIcon, MailIcon, PhoneIcon, TelegramIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHead } from './Sections'

interface FormState {
  name: string
  company: string
  phone: string
  product: number // index into c.form.options, so it follows the active language
  qty: string
  message: string
}

const field =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-gold-400 focus:bg-white/10'

export function Contact() {
  const { t, lang } = useLang()
  const c = t.contact
  const [sent, setSent] = useState(false)
  const [f, setF] = useState<FormState>({
    name: '',
    company: '',
    phone: '',
    product: 0,
    qty: '',
    message: '',
  })

  const set = (k: Exclude<keyof FormState, 'product'>) => (e: { target: { value: string } }) =>
    setF((s) => ({ ...s, [k]: e.target.value }))

  const productName = c.form.options[f.product] ?? c.form.options[0]

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = `${lang === 'ar' ? 'طلب عرض سعر' : 'Quote request'} - ${productName}`
    const body = [
      `${c.form.name}: ${f.name}`,
      `${c.form.company}: ${f.company}`,
      `${c.form.phone}: ${f.phone}`,
      `${c.form.product}: ${productName}`,
      `${c.form.qty}: ${f.qty}`,
      '',
      f.message,
    ].join('\n')
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const channels = [
    { label: c.info.phone, value: CONTACT.phone, href: `tel:${CONTACT.phone}`, icon: PhoneIcon, ltr: true },
    { label: c.info.email, value: CONTACT.email, href: `mailto:${CONTACT.email}`, icon: MailIcon, ltr: true },
    { label: c.info.facebook, value: CONTACT.facebook, href: `https://facebook.com/${CONTACT.facebook}`, icon: FacebookIcon, ltr: true },
    { label: c.info.telegram, value: CONTACT.telegram, href: `https://t.me/${CONTACT.telegram}`, icon: TelegramIcon, ltr: true },
  ]

  return (
    <section id="contact" className="relative overflow-hidden bg-brown-950 px-4 py-20 sm:px-6 sm:py-28">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(50% 60% at 85% 20%, rgba(224,168,46,0.18), transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionHead eyebrow={c.eyebrow} title={c.title} sub={c.sub} light />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <form
              onSubmit={onSubmit}
              className="grid gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur sm:grid-cols-2 sm:p-8"
            >
              <input required className={field} placeholder={c.form.name} value={f.name} onChange={set('name')} />
              <input className={field} placeholder={c.form.company} value={f.company} onChange={set('company')} />
              <input
                required
                dir="ltr"
                type="tel"
                className={`${field} text-start`}
                placeholder={c.form.phone}
                value={f.phone}
                onChange={set('phone')}
              />
              <select
                className={`${field} [&>option]:text-ink`}
                value={f.product}
                onChange={(e) => setF((s) => ({ ...s, product: Number(e.target.value) }))}
                aria-label={c.form.product}
              >
                {c.form.options.map((o, i) => (
                  <option key={o} value={i}>
                    {o}
                  </option>
                ))}
              </select>
              <input className={`${field} sm:col-span-2`} placeholder={c.form.qty} value={f.qty} onChange={set('qty')} />
              <textarea
                rows={4}
                className={`${field} resize-none sm:col-span-2`}
                placeholder={c.form.message}
                value={f.message}
                onChange={set('message')}
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 px-6 py-3.5 text-base font-extrabold text-brown-950 shadow-[0_10px_40px_-10px_rgba(224,168,46,0.8)] transition hover:-translate-y-0.5 sm:col-span-2"
              >
                {c.form.send}
              </button>
              {sent && (
                <p className="flex items-center gap-2 text-sm font-semibold text-gold-300 sm:col-span-2" role="status">
                  <CheckIcon className="h-5 w-5 shrink-0" />
                  {c.form.sent}
                </p>
              )}
            </form>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="grid gap-4">
              {channels.map((ch) => (
                <li key={ch.label}>
                  <a
                    href={ch.href}
                    target={ch.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="group flex items-center gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-gold-500 hover:ring-gold-400"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-300 transition group-hover:bg-brown-950 group-hover:text-gold-300">
                      <ch.icon className="h-6 w-6" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-white/60 transition group-hover:text-brown-900/70">{ch.label}</span>
                      <span
                        dir={ch.ltr ? 'ltr' : undefined}
                        className="block truncate text-start font-bold text-white transition group-hover:text-brown-950"
                      >
                        {ch.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
