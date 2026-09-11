import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'

type Mode = 'sign-in' | 'sign-up' | 'reset'

const TITLES: Record<Mode, string> = {
  'sign-in': 'Sign in to your account.',
  'sign-up': 'Create an account.',
  reset: 'Reset your password.',
}

const SUBMIT_LABELS: Record<Mode, string> = {
  'sign-in': 'Sign in',
  'sign-up': 'Create account',
  reset: 'Send reset link',
}

export function LoginScreen() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [mode, setMode] = useState<Mode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function switchMode(next: Mode) {
    setMode(next)
    setError(null)
    setMessage(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)
    try {
      if (mode === 'reset') {
        const result = await resetPassword(email)
        if (result.error) setError(result.error)
        else setMessage('Check your email for a password reset link.')
      } else if (mode === 'sign-up') {
        const result = await signUp(email, password)
        if (result.error) setError(result.error)
        else setMessage('Account created — check your email to confirm it, then sign in.')
      } else {
        const result = await signIn(email, password)
        if (result.error) setError(result.error)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}
      >
        <h1 className="text-lg font-bold">Myen</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          {TITLES[mode]}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border px-2 py-1.5"
              style={{ borderColor: 'var(--border)', background: 'var(--page-plane)', color: 'var(--text-primary)' }}
              autoFocus
            />
          </label>

          {mode !== 'reset' && (
            <label className="flex flex-col gap-1 text-sm">
              <span style={{ color: 'var(--text-secondary)' }}>Password</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md border px-2 py-1.5"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--page-plane)',
                  color: 'var(--text-primary)',
                }}
              />
            </label>
          )}

          {error && (
            <p className="text-xs" style={{ color: 'var(--danger)' }}>
              {error}
            </p>
          )}
          {message && (
            <p className="text-xs" style={{ color: 'var(--success)' }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-lg px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            style={{ background: 'var(--cat-main)' }}
          >
            {submitting ? 'Please wait…' : SUBMIT_LABELS[mode]}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
          {mode === 'sign-in' ? (
            <>
              <button onClick={() => switchMode('sign-up')}>Create an account</button>
              <button onClick={() => switchMode('reset')}>Forgot password?</button>
            </>
          ) : (
            <button onClick={() => switchMode('sign-in')}>Back to sign in</button>
          )}
        </div>
      </div>
    </div>
  )
}
