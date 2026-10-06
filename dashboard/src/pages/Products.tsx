import { useCallback, useEffect, useState } from 'react'
import { api, ApiError } from '../api'
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
  Textarea,
  useToast,
} from '../components/ui'
import type { Lang, ProductItem, ProductsPayload } from '../types'

interface Side {
  t: string
  d: string
  tag: string
}

interface HeadingSide {
  eyebrow: string
  title: string
  sub: string
}

interface Row {
  id: number
  ar: Side
  en: Side
}

interface State {
  ar: HeadingSide
  en: HeadingSide
  rows: Row[]
}

let uid = 0
const nextId = () => ++uid
const emptySide = (): Side => ({ t: '', d: '', tag: '' })
const sideFrom = (item?: ProductItem): Side => (item ? { t: item.t, d: item.d, tag: item.tag } : emptySide())

function toState(payload: ProductsPayload): State {
  return {
    ar: { eyebrow: payload.ar.eyebrow, title: payload.ar.title, sub: payload.ar.sub },
    en: { eyebrow: payload.en.eyebrow, title: payload.en.title, sub: payload.en.sub },
    rows: payload.ar.items.map((item, i) => ({ id: nextId(), ar: sideFrom(item), en: sideFrom(payload.en.items[i]) })),
  }
}

function toPayload(state: State): ProductsPayload {
  const side = (lang: Lang) => ({
    eyebrow: state[lang].eyebrow.trim(),
    title: state[lang].title.trim(),
    sub: state[lang].sub.trim(),
    items: state.rows.map((row) => ({
      t: row[lang].t.trim(),
      d: row[lang].d.trim(),
      tag: row[lang].tag.trim(),
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

const hasInvalidState = (state: State) => state.rows.some((row) => !row.ar.t.trim() || !row.en.t.trim())

export function Products() {
  const { t, lang } = useI18n()
  const toast = useToast()
  const [saved, setSaved] = useState<State | null>(null)
  const [draft, setDraft] = useState<State | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const state = toState(await api.getProducts())
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
  const hasInvalid = hasInvalidState(draft)

  const patchHeading = (l: Lang, changes: Partial<HeadingSide>) => setDraft({ ...draft, [l]: { ...draft[l], ...changes } })
  const patchSide = (id: number, l: Lang, changes: Partial<Side>) =>
    setDraft({ ...draft, rows: draft.rows.map((row) => (row.id === id ? { ...row, [l]: { ...row[l], ...changes } } : row)) })

  const saveState = async (next: State) => {
    setSaving(true)
    try {
      await api.saveProducts(toPayload(next))
      setSaved(next)
      toast(t.common.saved)
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 401)) toast(t.common.saveError, 'error')
    } finally {
      setSaving(false)
    }
  }

  const save = () => saveState(draft)

  const addProduct = () => {
    setDraft({ ...draft, rows: [...draft.rows, { id: nextId(), ar: emptySide(), en: emptySide() }] })
  }

  const deleteProduct = (id: number) => {
    if (!window.confirm(t.common.confirmDelete)) return
    const next = { ...draft, rows: draft.rows.filter((row) => row.id !== id) }
    setDraft(next)
    if (!hasInvalidState(next)) void saveState(next)
  }

  const column = (row: Row, l: Lang) => {
    const side = row[l]
    const dir = l === 'ar' ? 'rtl' : 'ltr'
    return (
      <div className="space-y-3" dir={dir}>
        <div className="flex items-center gap-2">
          <LangTag code={l} />
          <span className="text-xs font-bold text-ink/55">{l === 'ar' ? t.common.arabic : t.common.english}</span>
        </div>
        <Field label={t.products.name}>
          <Input value={side.t} invalid={!side.t.trim()} onChange={(e) => patchSide(row.id, l, { t: e.target.value })} />
        </Field>
        <Field label={t.products.tag}>
          <Input value={side.tag} onChange={(e) => patchSide(row.id, l, { tag: e.target.value })} />
        </Field>
        <Field label={t.products.description}>
          <Textarea rows={3} value={side.d} onChange={(e) => patchSide(row.id, l, { d: e.target.value })} />
        </Field>
      </div>
    )
  }

  return (
    <div>
      <PageHead
        title={t.products.title}
        sub={t.products.sub}
        actions={
          <Button variant="dark" onClick={addProduct} disabled={saving}>
            <IconPlus className="h-4 w-4" />
            {t.products.add}
          </Button>
        }
      />

      <section className="rounded-3xl bg-white p-5 ring-1 ring-brown-900/10 sm:p-6">
        <h2 className="mb-4 text-lg font-black text-brown-950">{t.products.sectionTitle}</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {(['ar', 'en'] as const).map((l) => (
            <div key={l} className="space-y-3" dir={l === 'ar' ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-2">
                <LangTag code={l} />
                <span className="text-xs font-bold text-ink/55">{l === 'ar' ? t.common.arabic : t.common.english}</span>
              </div>
              <Field label={t.products.eyebrow}>
                <Input value={draft[l].eyebrow} onChange={(e) => patchHeading(l, { eyebrow: e.target.value })} />
              </Field>
              <Field label={t.products.heading}>
                <Input value={draft[l].title} onChange={(e) => patchHeading(l, { title: e.target.value })} />
              </Field>
              <Field label={t.products.intro}>
                <Textarea rows={3} value={draft[l].sub} onChange={(e) => patchHeading(l, { sub: e.target.value })} />
              </Field>
            </div>
          ))}
        </div>
      </section>

      {draft.rows.length === 0 && (
        <div className="mt-6 rounded-3xl border-2 border-dashed border-brown-900/20 py-16 text-center text-sm font-bold text-ink/60">
          {t.products.empty}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {draft.rows.map((row, i) => (
          <article key={row.id} className="overflow-hidden rounded-3xl bg-white ring-1 ring-brown-900/10">
            <header className="flex items-center gap-3 border-b border-brown-900/10 bg-fog/60 px-5 py-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-black text-brown-950">{row[lang].t || t.products.newProduct}</div>
                <div className="truncate text-xs font-bold text-ink/55">{row[lang].tag}</div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <IconButton label={t.common.moveUp} disabled={i === 0} onClick={() => setDraft({ ...draft, rows: move(draft.rows, i, -1) })}>
                  <IconUp className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label={t.common.moveDown}
                  disabled={i === draft.rows.length - 1}
                  onClick={() => setDraft({ ...draft, rows: move(draft.rows, i, 1) })}
                >
                  <IconDown className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label={t.common.delete}
                  className="text-red-700 hover:bg-red-50"
                  disabled={saving}
                  onClick={() => deleteProduct(row.id)}
                >
                  <IconTrash className="h-4 w-4" />
                </IconButton>
              </div>
            </header>
            <div className="grid gap-6 p-5 md:grid-cols-2 md:gap-8">
              {column(row, 'ar')}
              {column(row, 'en')}
            </div>
          </article>
        ))}
      </div>

      <SaveBar
        dirty={dirty}
        saving={saving}
        blocked={hasInvalid ? t.products.blockedSave : undefined}
        onSave={() => void save()}
        onDiscard={() => setDraft(saved)}
      />
    </div>
  )
}
