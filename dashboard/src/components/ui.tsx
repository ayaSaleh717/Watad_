import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { useI18n } from '../i18n'

/* ---------- icons ---------- */
type IconProps = { className?: string }
const base = (className = 'h-5 w-5') => ({
  className,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

export const IconChart = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
)
export const IconTag = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
    <circle cx="7.5" cy="7.5" r="1.2" />
  </svg>
)
export const IconPin = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)
export const IconOut = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
)
export const IconPlus = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
export const IconTrash = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />
  </svg>
)
export const IconUp = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m6 15 6-6 6 6" />
  </svg>
)
export const IconDown = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)
export const IconRefresh = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12A9 9 0 0 1 18.5 5.8L21 8M3 21v-5h5M21 3v5h-5" />
  </svg>
)
export const IconExternal = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
)
export const IconCheck = ({ className }: IconProps) => (
  <svg {...base(className)}>
    <path d="m5 12 5 5 9-10" />
  </svg>
)

/* ---------- form controls ---------- */
const controlCls =
  'w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-brown-950 placeholder:text-ink/35 transition focus:outline-none focus:ring-4 disabled:opacity-50'
const okCls = 'border-brown-900/15 focus:border-gold-500 focus:ring-gold-500/25'
const badCls = 'border-red-500 focus:border-red-500 focus:ring-red-500/20'

export function Input({
  invalid,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input {...props} aria-invalid={invalid || undefined} className={`${controlCls} ${invalid ? badCls : okCls} ${className}`} />
}

export function Textarea({
  invalid,
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      className={`${controlCls} ${invalid ? badCls : okCls} resize-y leading-relaxed ${className}`}
    />
  )
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${controlCls} ${okCls} ${className}`}>
      {children}
    </select>
  )
}

export function Field({
  label,
  children,
  error,
  className = '',
}: {
  label: ReactNode
  children: ReactNode
  error?: string
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-bold text-brown-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-bold text-red-700">{error}</span>}
    </label>
  )
}

/** Small pill marking which site language a field belongs to. */
export function LangTag({ code }: { code: 'ar' | 'en' }) {
  return (
    <span
      className={`inline-grid h-5 min-w-7 place-items-center rounded-md px-1.5 text-[11px] font-black ${
        code === 'ar' ? 'bg-brown-900 text-gold-300' : 'bg-gold-500/20 text-gold-700'
      }`}
    >
      {code === 'ar' ? 'ع' : 'EN'}
    </span>
  )
}

/* ---------- buttons ---------- */
type Variant = 'primary' | 'ghost' | 'danger' | 'dark'
const variants: Record<Variant, string> = {
  primary: 'bg-gold-500 text-brown-950 hover:bg-gold-400 disabled:hover:bg-gold-500',
  dark: 'bg-brown-900 text-gold-300 hover:bg-brown-800',
  ghost: 'bg-white text-brown-800 ring-1 ring-brown-900/15 hover:bg-brown-900/5',
  danger: 'bg-white text-red-700 ring-1 ring-red-700/25 hover:bg-red-50',
}

export function Button({
  variant = 'ghost',
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
    />
  )
}

export function IconButton({
  label,
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type={type}
      title={label}
      aria-label={label}
      {...props}
      className={`grid h-9 w-9 place-items-center rounded-lg text-brown-700 ring-1 ring-brown-900/10 transition hover:bg-brown-900/5 disabled:cursor-not-allowed disabled:opacity-30 ${className}`}
    />
  )
}

/* ---------- toasts ---------- */
type ToastTone = 'ok' | 'error'
const ToastCtx = createContext<(message: string, tone?: ToastTone) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string; tone: ToastTone } | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback((message: string, tone: ToastTone = 'ok') => {
    window.clearTimeout(timer.current)
    setToast({ id: Date.now(), message, tone })
    timer.current = window.setTimeout(() => setToast(null), 3500)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {toast && (
          <div
            key={toast.id}
            className={`toast-in flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-black shadow-xl ${
              toast.tone === 'ok' ? 'bg-brown-950 text-gold-300' : 'bg-red-700 text-white'
            }`}
          >
            {toast.tone === 'ok' && <IconCheck className="h-4 w-4" />}
            {toast.message}
          </div>
        )}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- page chrome ---------- */
export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black text-brown-950">{title}</h1>
        {sub && <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink/65">{sub}</p>}
      </div>
      {actions}
    </header>
  )
}

export function LoadState({
  loading,
  error,
  onRetry,
}: {
  loading: boolean
  error: boolean
  onRetry: () => void
}) {
  const { t } = useI18n()
  if (loading) return <p className="py-16 text-center text-sm font-bold text-ink/55">{t.common.loading}</p>
  if (error)
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-bold text-red-700">{t.common.loadError}</p>
        <Button className="mt-4" onClick={onRetry}>
          {t.common.retry}
        </Button>
      </div>
    )
  return null
}

/** Sticky bar shown on editor pages: tells you if anything is unsaved and lets you save or discard. */
export function SaveBar({
  dirty,
  saving,
  blocked,
  onSave,
  onDiscard,
}: {
  dirty: boolean
  saving: boolean
  blocked?: string
  onSave: () => void
  onDiscard: () => void
}) {
  const { t } = useI18n()

  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  return (
    <div className="sticky bottom-0 z-30 -mx-4 mt-8 border-t border-brown-900/10 bg-fog/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <p className={`text-sm font-bold ${blocked && dirty ? 'text-red-700' : dirty ? 'text-brown-900' : 'text-ink/50'}`}>
          {dirty ? (
            <>
              <span className="me-2 inline-block h-2 w-2 rounded-full bg-gold-500 align-middle" />
              {blocked || t.common.unsaved}
            </>
          ) : (
            t.common.allSaved
          )}
        </p>
        <div className="flex gap-2">
          <Button onClick={onDiscard} disabled={!dirty || saving}>
            {t.common.discard}
          </Button>
          <Button variant="primary" onClick={onSave} disabled={!dirty || saving || !!blocked}>
            {saving ? t.common.saving : t.common.save}
          </Button>
        </div>
      </div>
    </div>
  )
}
