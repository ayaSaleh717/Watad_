export const LOGO_MARK_SRC = '/logo-mark.svg'

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <img className={className} src={LOGO_MARK_SRC} alt="Watad Petroleum" decoding="async" />
  )
}

/** Mark + bilingual wordmark lockup. */
export function Logo({
  className = '',
  markClass = 'h-10',
  dark = false,
}: {
  className?: string
  markClass?: string
  dark?: boolean
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} dir="ltr">
      <LogoMark className={`${markClass} w-auto shrink-0`} />
      <span className="flex flex-col leading-none">
        <span dir="rtl" className={`text-[1.35em] font-black ${dark ? 'text-brown-900' : 'text-white'}`}>
          وتد للبترول
        </span>
        <span
          className={`mt-1 text-[0.5em] font-semibold tracking-[0.35em] ${dark ? 'text-ink/70' : 'text-white/70'}`}
        >
          WATAD PETROLEUM
        </span>
      </span>
    </span>
  )
}
