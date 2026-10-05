import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { api } from '../api'
import { Button, IconRefresh, LoadState, PageHead } from '../components/ui'
import { fill, useI18n } from '../i18n'
import type { Stats } from '../types'

const RANGES = [7, 30, 90]

function niceMax(max: number) {
  if (max <= 4) return 4
  const raw = max / 4
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag
  return Math.ceil(step * 4)
}

function VisitsChart({ series }: { series: Stats['series'] }) {
  const { t, num, shortDate } = useI18n()
  const [hover, setHover] = useState<number | null>(null)
  const ref = useRef<SVGSVGElement>(null)

  const W = 760
  const H = 280
  const L = 44
  const R = 12
  const T = 16
  const B = 30
  const innerW = W - L - R
  const max = Math.max(...series.map((s) => s.views), 0)
  const top = niceMax(max)
  const x = (i: number) => (series.length <= 1 ? L + innerW / 2 : L + (i * innerW) / (series.length - 1))
  const y = (v: number) => T + (1 - v / top) * (H - T - B)
  const line = (key: 'views' | 'visitors') =>
    series.map((s, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(s[key]).toFixed(1)}`).join(' ')
  const area = `${line('views')} L${x(series.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`
  const ticks = [0, 1, 2, 3, 4].map((i) => (top * i) / 4)

  const labelCount = Math.min(series.length, 6)
  const labelIdx = Array.from(
    new Set(Array.from({ length: labelCount }, (_, i) => Math.round((i * (series.length - 1)) / Math.max(labelCount - 1, 1)))),
  )

  const onMove = (e: PointerEvent<SVGRectElement>) => {
    const svg = ref.current
    if (!svg || series.length === 0) return
    const rect = svg.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const step = innerW / Math.max(series.length - 1, 1)
    setHover(Math.min(Math.max(Math.round((px - L) / step), 0), series.length - 1))
  }

  const point = hover === null ? null : series[hover]

  return (
    <div dir="ltr" className="relative">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={t.overview.chartTitle}>
        <defs>
          <linearGradient id="viewsArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbb40b" stopOpacity=".35" />
            <stop offset="1" stopColor="#fbb40b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={L} x2={W - R} y1={y(tick)} y2={y(tick)} stroke="#1c1206" strokeOpacity={tick === 0 ? 0.25 : 0.08} />
            <text x={L - 8} y={y(tick) + 4} textAnchor="end" className="fill-ink/55 text-[11px] font-bold">
              {num(tick)}
            </text>
          </g>
        ))}

        {max > 0 && <path d={area} fill="url(#viewsArea)" />}
        <path d={line('views')} fill="none" stroke="#d79a0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={line('visitors')}
          fill="none"
          stroke="#1c1206"
          strokeWidth="2.5"
          strokeDasharray="1 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {labelIdx.map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-ink/60 text-[11px] font-bold">
            {shortDate(series[i].date)}
          </text>
        ))}

        {hover !== null && point && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={T} y2={y(0)} stroke="#1c1206" strokeOpacity=".25" />
            <circle cx={x(hover)} cy={y(point.views)} r="5" fill="#fbb40b" stroke="#1c1206" strokeWidth="2" />
            <circle cx={x(hover)} cy={y(point.visitors)} r="4" fill="#1c1206" />
          </g>
        )}

        <rect x={L} y={T} width={innerW} height={H - T - B} fill="transparent" onPointerMove={onMove} onPointerLeave={() => setHover(null)} />
      </svg>

      {max === 0 && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center pb-8 text-sm font-bold text-ink/55">
          {t.overview.emptyChart}
        </div>
      )}

      {hover !== null && point && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-36 rounded-xl bg-brown-950 px-3 py-2 text-xs text-white shadow-xl"
          style={{ left: `clamp(4.5rem, ${(x(hover) / W) * 100}%, calc(100% - 4.5rem))`, transform: 'translateX(-50%)' }}
        >
          <div className="mb-1 font-black text-gold-300">{shortDate(point.date)}</div>
          <div className="flex justify-between gap-4">
            <span className="text-white/70">{t.overview.series.views}</span>
            <span className="tabular font-black">{num(point.views)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/70">{t.overview.series.visitors}</span>
            <span className="tabular font-black">{num(point.visitors)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function BarList({ items, total }: { items: { name: string; count: number }[]; total: number }) {
  const { t, num } = useI18n()
  if (items.length === 0 || total === 0) return <p className="py-6 text-sm font-bold text-ink/50">{t.common.noData}</p>

  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const pct = Math.round((item.count / total) * 100)
        return (
          <li key={item.name}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-bold text-brown-900" dir="auto">
                {item.name}
              </span>
              <span className="tabular shrink-0 font-black text-brown-950">
                {num(item.count)} <span className="text-xs font-bold text-ink/50">{pct}%</span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-brown-900/8">
              <div className="h-full rounded-full bg-gold-500" style={{ width: `${Math.max(pct, 2)}%` }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function Overview({ active }: { active: boolean }) {
  const { t, num } = useI18n()
  const [days, setDays] = useState(30)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    try {
      setStats(await api.stats(days))
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    if (!active) return
    void load()
    const id = window.setInterval(() => {
      if (!document.hidden) void load()
    }, 30_000)
    return () => window.clearInterval(id)
  }, [active, load])

  const state = <LoadState loading={loading && !stats} error={error && !stats} onRetry={() => void load()} />

  const langTotal = stats ? stats.langs.ar + stats.langs.en : 0
  const pathTotal = stats ? stats.paths.reduce((s, p) => s + p.count, 0) : 0
  const refTotal = stats ? stats.referrers.reduce((s, p) => s + p.count, 0) : 0

  return (
    <div>
      <PageHead
        title={t.overview.title}
        sub={t.overview.sub}
        actions={
          <Button onClick={() => void load()}>
            <IconRefresh className="h-4 w-4" />
            {t.overview.refresh}
          </Button>
        }
      />

      {state}

      {stats && (
        <>
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="rounded-3xl bg-brown-950 p-6 text-white md:col-span-2 lg:col-span-1">
              <div className="text-sm font-bold text-white/65">{t.overview.visitors}</div>
              <div className="tabular mt-3 text-6xl font-black leading-none text-gold-400">{num(stats.totals.uniqueVisitors)}</div>
              <div className="mt-4 text-xs font-bold text-white/55">{t.overview.visitorsNote}</div>
            </div>

            <Stat label={t.overview.totalViews} value={num(stats.totals.totalViews)} note={t.overview.totalViewsNote} />
            <Stat
              label={t.overview.last7}
              value={num(stats.totals.last7Views)}
              note={fill(t.overview.visitorsCount, { n: num(stats.totals.last7Visitors) })}
            />
            <Stat
              label={t.overview.today}
              value={num(stats.totals.todayViews)}
              note={fill(t.overview.visitorsCount, { n: num(stats.totals.todayVisitors) })}
            />
          </section>

          <section className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-brown-900/10 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-brown-950">{t.overview.chartTitle}</h2>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs font-bold text-ink/65">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1 w-5 rounded-full bg-gold-600" />
                    {t.overview.series.views}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1 w-5 rounded-full border-t-[3px] border-dotted border-brown-900" />
                    {t.overview.series.visitors}
                  </span>
                </div>
              </div>
              <div className="flex rounded-xl bg-fog p-1 ring-1 ring-brown-900/10" role="group">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setDays(r)}
                    aria-pressed={days === r}
                    className={`rounded-lg px-3 py-1.5 text-sm font-black transition ${
                      days === r ? 'bg-brown-950 text-gold-300' : 'text-brown-800 hover:bg-brown-900/5'
                    }`}
                  >
                    {t.overview.range[r]}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <VisitsChart series={stats.series} />
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-3">
            <Panel title={t.overview.language}>
              <BarList
                total={langTotal}
                items={[
                  { name: 'العربية', count: stats.langs.ar },
                  { name: 'English', count: stats.langs.en },
                ]}
              />
            </Panel>
            <Panel title={t.overview.topPages}>
              <BarList
                total={pathTotal}
                items={stats.paths.map((p) => ({ name: t.overview.pages[p.name] ?? p.name, count: p.count }))}
              />
            </Panel>
            <Panel title={t.overview.sources}>
              <BarList
                total={refTotal}
                items={stats.referrers.map((r) => ({ name: r.name === 'direct' ? t.overview.direct : r.name, count: r.count }))}
              />
            </Panel>
          </section>
        </>
      )}
    </div>
  )
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-brown-900/10">
      <div className="text-sm font-bold text-ink/65">{label}</div>
      <div className="tabular mt-3 text-4xl font-black leading-none text-brown-950">{value}</div>
      <div className="mt-4 text-xs font-bold text-ink/50">{note}</div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-5 ring-1 ring-brown-900/10 sm:p-6">
      <h2 className="mb-5 text-lg font-black text-brown-950">{title}</h2>
      {children}
    </div>
  )
}
