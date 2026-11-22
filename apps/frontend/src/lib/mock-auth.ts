import { useCallback, useEffect, useState } from 'react'
import type { User } from '@/types/auth'

const STORAGE_KEY = 'cms.mockSession'

interface StoredSession {
  id: string
  username: string
}

// Mock session lives only in the browser. Any non-empty credentials sign in;
// no password is ever persisted and no backend is ever called.
function readStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredSession
    if (typeof parsed?.id !== 'string' || typeof parsed?.username !== 'string') {
      return null
    }
    if (parsed.username.trim() === '') return null
    return parsed
  } catch {
    return null
  }
}

function writeStoredSession(session: StoredSession | null) {
  try {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Storage unavailable (private mode, etc.) — session just won't persist.
  }
}

export function getMockSession(): User | null {
  const stored = readStoredSession()
  if (!stored) return null
  return { id: stored.id, username: stored.username }
}

export function signIn(username: string): User {
  const session: StoredSession = {
    id: 'mock-user',
    username: username.trim(),
  }
  writeStoredSession(session)
  return { ...session }
}

export function signOut() {
  writeStoredSession(null)
}

export function useMockSession() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getMockSession())
    setLoading(false)
  }, [])

  const handleSignIn = useCallback((username: string) => {
    const next = signIn(username)
    setUser(next)
    return next
  }, [])

  const handleSignOut = useCallback(async () => {
    signOut()
    setUser(null)
  }, [])

  return {
    user,
    isAuthenticated: user !== null,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  }
}
