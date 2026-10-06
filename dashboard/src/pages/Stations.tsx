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
import type { Lang, Station, StationsPayload } from '../types'

interface Side {
  name: string
  area: string
  status: string
  d: string
  pointsText: string
}
interface Row {
  id: number
  ar: Side
  en: Side
}

let uid = 0
const nextId = () => ++uid
const emptySide = (): Side => ({ name: '', area: '', status: '', d: '', pointsText: '' })

const sideFrom = (s?: Station): Side =>
  s ? { name: s.name, area: s.area, status: s.status, d: s.d, pointsText: s.points.join('\n') } : emptySide()

function toRows(p: StationsPayload): Row[] {
  return p.ar.locations.map((s, i) => ({ id: nextId(), ar: sideFrom(s), en: sideFrom(p.en.locations[i]) }))
}

function toPayload(rows: Row[]): StationsPayload {
  const side = (l: Lang) => ({
    locations: rows.map<Station>((r) => ({
      name: r[l].name.trim(),
      area: r[l].area.trim(),
      status: r[l].status.trim(),
      d: r[l].d.trim(),
      points: r[l].pointsText
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean),
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

const hasInvalidRows = (rows: Row[]) => rows.some((r) => !r.ar.name.trim() || !r.en.name.trim())

export function Stations() {
  const { t, lang } = useI18n()
  const toast = useToast()
  const [saved, setSaved] = useState<Row[] | null>(null)
  const [draft, setDraft] = useState<Row[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const rows = toRows(await api.getStations())
      setSaved(rows)
      setDraft(rows)
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
  const hasInvalid = hasInvalidRows(draft)

  const patchSide = (id: number, l: Lang, changes: Partial<Side>) =>
    setDraft(draft.map((r) => (r.id === id ? { ...r, [l]: { ...r[l], ...changes } } : r)))

  const saveRows = async (next: Row[]) => {
    setSaving(true)
    try {
      await api.saveStations(toPayload(next))
      setSaved(next)
      toast(t.common.saved)
    } catch (err) {
      if (!(err instanceof ApiError && err.status === 401)) toast(t.common.saveError, 'error')
    } finally {
      setSaving(false)
    }
  }

  const save = () => saveRows(draft)

  const addStation = () => {
    setDraft([...draft, { id: nextId(), ar: emptySide(), en: emptySide() }])
  }

  const deleteStation = (id: number) => {
    if (!window.confirm(t.common.confirmDelete)) return
    const next = draft.filter((row) => row.id !== id)
    setDraft(next)
    if (!hasInvalidRows(next)) void saveRows(next)
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
        <Field label={t.stations.name}>
          <Input value={side.name} invalid={!side.name.trim()} onChange={(e) => patchSide(row.id, l, { name: e.target.value })} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t.stations.area}>
            <Input value={side.area} onChange={(e) => patchSide(row.id, l, { area: e.target.value })} />
          </Field>
          <Field label={t.stations.status}>
            <Input value={side.status} onChange={(e) => patchSide(row.id, l, { status: e.target.value })} />
          </Field>
        </div>
        <Field label={t.stations.description}>
          <Textarea rows={3} value={side.d} onChange={(e) => patchSide(row.id, l, { d: e.target.value })} />
        </Field>
        <Field label={t.stations.services}>
          <Textarea rows={3} value={side.pointsText} onChange={(e) => patchSide(row.id, l, { pointsText: e.target.value })} />
        </Field>
      </div>
    )
  }

  return (
    <div>
      <PageHead
        title={t.stations.title}
        sub={t.stations.sub}
        actions={
          <Button variant="dark" onClick={addStation} disabled={saving}>
            <IconPlus className="h-4 w-4" />
            {t.stations.add}
          </Button>
        }
      />

      {draft.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-brown-900/20 py-16 text-center text-sm font-bold text-ink/60">
          {t.stations.empty}
        </div>
      )}

      <div className="space-y-4">
        {draft.map((row, i) => (
          <article key={row.id} className="overflow-hidden rounded-3xl bg-white ring-1 ring-brown-900/10">
            <header className="flex items-center gap-3 border-b border-brown-900/10 bg-fog/60 px-5 py-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-black text-brown-950">{row[lang].name || t.stations.newStation}</div>
                <div className="truncate text-xs font-bold text-ink/55">{row[lang].area}</div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <IconButton label={t.common.moveUp} disabled={i === 0} onClick={() => setDraft(move(draft, i, -1))}>
                  <IconUp className="h-4 w-4" />
                </IconButton>
                <IconButton label={t.common.moveDown} disabled={i === draft.length - 1} onClick={() => setDraft(move(draft, i, 1))}>
                  <IconDown className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label={t.common.delete}
                  className="text-red-700 hover:bg-red-50"
                  disabled={saving}
                  onClick={() => deleteStation(row.id)}
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
        blocked={hasInvalid ? t.stations.blockedSave : undefined}
        onSave={() => void save()}
        onDiscard={() => setDraft(saved)}
      />
    </div>
  )
}
