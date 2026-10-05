import { useState, type FormEvent } from 'react'
import { api, ApiError, setToken } from '../api'
import { Button, Field, Input } from '../components/ui'
import { useI18n } from '../i18n'

export function Login({ onLoggedIn }: { onLoggedIn: () => void }) {
  const { t, toggle } = useI18n()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!password || busy) return
    setBusy(true)
    setError('')
    try {
      const { token } = await api.login(password)
      setToken(token)
      onLoggedIn()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setError(t.login.wrong)
      else if (err instanceof ApiError && err.status === 429) setError(t.login.tooMany)
      else setError(t.login.network)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1.1fr]">
      <div className="flex items-center gap-5 bg-brown-950 px-6 py-8 text-white lg:flex-col lg:justify-center lg:gap-8 lg:px-12">
        <img src="/logo-mark.svg" alt="" className="h-16 w-auto lg:h-44" />
        <div className="lg:text-center">
          <div className="text-2xl font-black text-gold-400 lg:text-4xl">{t.brand.name}</div>
          <div className="mt-1 text-sm font-bold text-white/60 lg:text-base">{t.brand.sub}</div>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-6 py-12">
        <button
          type="button"
          onClick={toggle}
          className="absolute end-5 top-5 rounded-lg px-3 py-1.5 text-sm font-black text-brown-800 ring-1 ring-brown-900/15 hover:bg-brown-900/5"
        >
          {t.nav.otherLang}
        </button>

        <form onSubmit={submit} className="w-full max-w-sm">
          <h1 className="text-3xl font-black text-brown-950">{t.login.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">{t.login.sub}</p>

          <Field label={t.login.password} className="mt-8" error={error}>
            <Input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              invalid={!!error}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              dir="ltr"
            />
          </Field>

          <Button type="submit" variant="primary" className="mt-5 w-full py-3" disabled={!password || busy}>
            {busy ? t.login.submitting : t.login.submit}
          </Button>
        </form>
      </div>
    </div>
  )
}
