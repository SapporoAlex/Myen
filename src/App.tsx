import { AppShell } from './components/AppShell'
import { LoginScreen } from './components/Auth/LoginScreen'
import { useAuth } from './hooks/useAuth'
import { repository } from './lib/storage'

/**
 * Local storage and sample data are already private to this browser/session,
 * so only the Supabase backend (shared, hosted) is gated behind a login.
 */
function App() {
  if (repository.backend !== 'supabase') return <AppShell />
  return <SupabaseGate />
}

function SupabaseGate() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
      </div>
    )
  }

  if (!user) return <LoginScreen />

  return <AppShell userEmail={user.email} onSignOut={signOut} />
}

export default App
