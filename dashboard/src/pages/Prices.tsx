import { useCallback, useEffect, useState } from 'react'
import { api, ApiError } from '../api'
import { ar as arDict, en as enDict } from '../dict'
import { useI18n } from '../i18n'
import {
  Button,
  Field,
  IconButton,
  IconDown,
  IconPlus,
  IconTrash,
  IconUp,
  Input,
  LangTag,
  LoadState,
  PageHead,
  SaveBar,
  Select,
  useToast,
} from '../components/ui'
import type { CostsLang, CostsPayload, Kind, Lang, Tone } from '../types'

interface Side {
  label: string
  product: string
  unit: string
}
interface Row {
  id: number
  kind: Kind
  tone: Tone
  value: string
  ar: Side
  en: Side
}
interface State {
  dateAr: string
  dateEn: string
  rows: Row[]
}

let uid = 0
const nextId = () => ++uid
const PRICE_RE = /^\d+([.,]\d+)?$/
const validPrice = (v: string) => PRICE_RE.test(v.trim())

function toState(p: CostsPayload): State {
  return {
    dateAr: p.ar.date,
    dateEn: p.en.date,
    rows: p.ar.cards.map((c, i) => {
      const e = p.en.cards[i]
      return {
        id: nextId(),
        kind: c.kind,
        tone: c.tone,
        value: c.value,
        ar: { label: c.label, product: c.product, unit: c.unit },
        en: { label: e?.label ?? '', product: e?.product ?? '', unit: e?.unit ?? '' },
      }
    }),
  }
}

function toPayload(s: State): CostsPayload {
  const side = (l: Lang): CostsLang => ({
    date: l === 'ar' ? s.dateAr : s.dateEn,
    cards: s.rows.map((r) => ({
      kind: r.kind,
      tone: r.tone,
      value: r.value.trim().replace(',', '.'),
      label: r[l].label,
      product: r[l].product,
      unit: r[l].unit,
    })),
  })
  return { ar: side('ar'), en: side('en') }
}

function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir
  if (target < 0 || target >= list.length) return list
  const copy = [...list]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  return copy
}

const toneDot: Record<Tone, string> = {
  dark: 'bg-brown-900',
  gold: 'bg-gold-500',
  blue: 'bg-sky-500',
}

export function Prices() {
  const { t, lang, today } = useI18n()
  const toast = useToast()
  const [saved, setSaved] = useState<State | null>(null)
  const [draft, setDraft] = useState<State | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const state = toState(await api.getCosts())
      setSaved(state)
      setDraft(state)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (!draft || !saved) return <LoadState loading={loading} error={error} onRetry={() => void load()} />

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const hasInvalid = draft.rows.some((r) => !validPrice(r.value))

  const patch = (changes: Partial<State>) => setDraft({ ...draft, ...changes })
  const patchRow = (id: number, fn: (r: Row) => Row) => patch({ rows: draft.rows.map((r) => (r.id === id ? fn(r) : r)) })

  const addRow = () => {
    const last = draft.rows[0]
    patch({
      rows: [
        {
          id: nextId(),
          kind: 'pump',
          tone: 'dark',
          value: '0',
          ar: { label: '', product: arDict.prices.newProduct, unit: last?.ar.unit ?? '' },
          en: { label: '', product: enDict.prices.newProduct, unit: last?.en.unit ?? '' },
        },
        ...draft.rows,
      ],
    })
  }

  const save = async () => {
    setSaving(true)
    try {
      const next = { ...draft, dateAr: today('ar'), dateEn: today('en') }
      await api.saveCosts(toPayload(next))
      setDraft(next)
      setSaved(next)
      toast(t.common.saved)
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 401)) toast(t.common.saveError, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHead title={t.prices.title} sub={t.prices.sub} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-black text-brown-950">{t.prices.cardsTitle}</h2>
        <Button variant="dark" onClick={addRow}>
          <IconPlus className="h-4 w-4" />
          {t.prices.addCard}
        </Button>
      </div>
      <div className="space-y-4">
        {draft.rows.map((row, i) => (
          <article key={row.id} className="overflow-hidden rounded-3xl bg-white ring-1 ring-brown-900/10">
            <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-brown-900/10 bg-fog/60 px-4 py-3 sm:px-5">
              <span className={`h-3 w-3 shrink-0 rounded-full ${toneDot[row.tone]}`} />
              <div className="min-w-0 flex-1 basis-36">
                <div className="truncate text-sm font-black text-brown-950">{row[lang].product || t.prices.newProduct}</div>
                <div className="truncate text-xs font-bold text-ink/55">{row[lang].label}</div>
              </div>
              <div className="tabular shrink-0 rounded-full bg-brown-950 px-4 py-1.5 text-sm font-black text-gold-300" dir="ltr">
                {row.value || '0'} {row[lang].unit}
              </div>
              <div className="flex shrink-0 gap-1.5">
                <IconButton label={t.common.moveUp} disabled={i === 0} onClick={() => patch({ rows: move(draft.rows, i, -1) })}>
                  <IconUp className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label={t.common.moveDown}
                  disabled={i === draft.rows.length - 1}
                  onClick={() => patch({ rows: move(draft.rows, i, 1) })}
                >
                  <IconDown className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label={t.common.delete}
                  className="text-red-700 hover:bg-red-50"
                  onClick={() => window.confirm(t.common.confirmDelete) && patch({ rows: draft.rows.filter((r) => r.id !== row.id) })}
                >
                  <IconTrash className="h-4 w-4" />
                </IconButton>
              </div>
            </header>

            <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[13rem_1fr]">
              <div className="space-y-3">
                <Field label={t.prices.price} error={validPrice(row.value) ? undefined : t.prices.invalidPrice}>
                  <Input
                    dir="ltr"
                    inputMode="decimal"
                    value={row.value}
                    invalid={!validPrice(row.value)}
                    onChange={(e) => patchRow(row.id, (r) => ({ ...r, value: e.target.value }))}
                    className="py-3 text-2xl font-black"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label={<><LangTag code="ar" /> {t.prices.unit}</>}>
                    <Input
                      dir="rtl"
                      value={row.ar.unit}
                      onChange={(e) => patchRow(row.id, (r) => ({ ...r, ar: { ...r.ar, unit: e.target.value } }))}
                    />
                  </Field>
                  <Field label={<><LangTag code="en" /> {t.prices.unit}</>}>
                    <Input
                      dir="ltr"
                      value={row.en.unit}
                      onChange={(e) => patchRow(row.id, (r) => ({ ...r, en: { ...r.en, unit: e.target.value } }))}
                    />
                  </Field>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={<><LangTag code="ar" /> {t.prices.product}</>}>
                  <Input
                    dir="rtl"
                    value={row.ar.product}
                    onChange={(e) => patchRow(row.id, (r) => ({ ...r, ar: { ...r.ar, product: e.target.value } }))}
                  />
                </Field>
                <Field label={<><LangTag code="en" /> {t.prices.product}</>}>
                  <Input
                    dir="ltr"
                    value={row.en.product}
                    onChange={(e) => patchRow(row.id, (r) => ({ ...r, en: { ...r.en, product: e.target.value } }))}
                  />
                </Field>
                <Field label={<><LangTag code="ar" /> {t.prices.label}</>}>
                  <Input
                    dir="rtl"
                    value={row.ar.label}
                    onChange={(e) => patchRow(row.id, (r) => ({ ...r, ar: { ...r.ar, label: e.target.value } }))}
                  />
                </Field>
                <Field label={<><LangTag code="en" /> {t.prices.label}</>}>
                  <Input
                    dir="ltr"
                    value={row.en.label}
                    onChange={(e) => patchRow(row.id, (r) => ({ ...r, en: { ...r.en, label: e.target.value } }))}
                  />
                </Field>
                <Field label={t.prices.figure}>
                  <Select value={row.kind} onChange={(e) => patchRow(row.id, (r) => ({ ...r, kind: e.target.value as Kind }))}>
                    {(Object.keys(t.prices.kinds) as Kind[]).map((k) => (
                      <option key={k} value={k}>
                        {t.prices.kinds[k]}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label={t.prices.color}>
                  <Select value={row.tone} onChange={(e) => patchRow(row.id, (r) => ({ ...r, tone: e.target.value as Tone }))}>
                    {(Object.keys(t.prices.tones) as Tone[]).map((k) => (
                      <option key={k} value={k}>
                        {t.prices.tones[k]}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </div>
          </article>
        ))}
      </div>

      <SaveBar
        dirty={dirty}
        saving={saving}
        blocked={hasInvalid ? t.prices.blockedSave : undefined}
        onSave={() => void save()}
        onDiscard={() => setDraft(saved)}
      />
    </div>
  )
}
