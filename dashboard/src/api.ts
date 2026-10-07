import type { CostsPayload, Stats, StationsPayload } from './types'

const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
const TOKEN_KEY = 'watad-admin-token'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

let token: string | null = null
try {
  token = localStorage.getItem(TOKEN_KEY)
} catch {
  /* storage unavailable */
}

let onUnauthorized: () => void = () => {}
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}

export const hasToken = () => token !== null

export function setToken(next: string | null) {
  token = next
  try {
    if (next) localStorage.setItem(TOKEN_KEY, next)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable */
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${base}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    })
  } catch {
    throw new ApiError('network', 0)
  }

  if (response.status === 401 && path !== '/api/admin/login') {
    setToken(null)
    onUnauthorized()
  }

  if (!response.ok) {
    let message = response.statusText
    try {
      message = (await response.json()).error ?? message
    } catch {
      /* no JSON body */
    }
    throw new ApiError(message, response.status)
  }

  return (response.status === 204 ? undefined : await response.json()) as T
}

export const api = {
  login: (password: string) =>
    request<{ token: string }>('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),
  stats: (days: number) => request<Stats>(`/api/admin/stats?days=${days}`),
  getCosts: () => request<CostsPayload>('/api/admin/costs'),
  saveCosts: (data: CostsPayload) => request<{ ok: true }>('/api/admin/costs', { method: 'PUT', body: JSON.stringify(data) }),
  getStations: () => request<StationsPayload>('/api/admin/stations'),
  saveStations: (data: StationsPayload) =>
    request<{ ok: true }>('/api/admin/stations', { method: 'PUT', body: JSON.stringify(data) }),
}
