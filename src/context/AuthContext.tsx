import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@/types'
import * as authStore from '@/store/authStore'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isClient: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const session = authStore.getSession()
    if (session.user) setUser(session.user)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const result = authStore.login(email, password)
    if (result.success && result.user) {
      setUser(result.user)
      return { success: true }
    }
    return { success: false, error: result.error }
  }, [])

  const logout = useCallback(() => {
    authStore.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isClient: user?.role === 'client',
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
