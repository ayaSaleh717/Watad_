import type { ReactNode } from 'react'

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function FuelIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 20V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15" />
      <path d="M3 20h12" />
      <path d="M6 8h6" />
      <path d="M14 9h2.5a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 0 3 0V8l-2.5-2.5" />
    </svg>
  )
}

function GasIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M10 3h4" />
      <path d="M12 3v2" />
      <rect x="6.5" y="5" width="11" height="16" rx="4" />
      <path d="M6.5 10h11" />
      <path d="M6.5 16h11" />
    </svg>
  )
}

function DerrickIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 3 6 21" />
      <path d="M12 3l6 18" />
      <path d="M8.5 13h7" />
      <path d="M7.3 17.5h9.4" />
      <path d="M10 8.5h4" />
      <path d="M3 21h18" />
    </svg>
  )
}

function MarketIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 6-7" />
      <path d="M16 7h4v4" />
    </svg>
  )
}

export function DivisionIcon({ name, className = '' }: { name: string; className?: string }): ReactNode {
  switch (name) {
    case 'fuels':
      return <FuelIcon className={className} />
    case 'gas':
      return <GasIcon className={className} />
    case 'refining':
      return <DerrickIcon className={className} />
    default:
      return <MarketIcon className={className} />
  }
}

function CalendarIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="m9.5 15 2 2 3.5-4" />
    </svg>
  )
}

function TruckIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M2.5 6.5h11v10h-11z" />
      <path d="M13.5 9.5h4l3 3.5v3.5h-7" />
      <circle cx="7" cy="17.5" r="2" />
      <circle cx="17" cy="17.5" r="2" />
    </svg>
  )
}

function PinIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

function BoltIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z" />
    </svg>
  )
}

export function StatIcon({ name, className = '' }: { name: string; className?: string }): ReactNode {
  switch (name) {
    case 'calendar':
      return <CalendarIcon className={className} />
    case 'truck':
      return <TruckIcon className={className} />
    case 'pin':
      return <PinIcon className={className} />
    default:
      return <BoltIcon className={className} />
  }
}

export function PhoneIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  )
}

export function MailIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export function FacebookIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8" />
    </svg>
  )
}

export function TelegramIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M21 4 3 11l5 2 2 6 3-4 5 4z" />
      <path d="m8 13 9-6" />
    </svg>
  )
}

export function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="m5 12 5 5 9-10" />
    </svg>
  )
}
