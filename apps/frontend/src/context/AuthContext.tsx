import type { ReactNode } from 'react'
import { useMockSession } from '@/lib/mock-auth'
import { AuthContext } from './auth-state'

// Mock session store backs app-wide auth state. No backend, no framework:
// the session is frontend-local `{ id, username }` mirrored to localStorage.
export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading, signOut } = useMockSession()

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
