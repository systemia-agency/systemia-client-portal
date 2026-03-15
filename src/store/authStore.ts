import type { User, StoredUser } from '@/types'
import { getItem, setItem, removeItem } from './localStorage'

const USERS_KEY = 'systemia_users'
const AUTH_KEY = 'systemia_auth'

function createToken(user: User): string {
  return btoa(JSON.stringify({
    userId: user.id,
    role: user.role,
    slug: user.slug,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  }))
}

function decodeToken(token: string): { userId: string; role: string; slug: string; exp: number } | null {
  try {
    return JSON.parse(atob(token))
  } catch {
    return null
  }
}

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const users = getItem<StoredUser[]>(USERS_KEY, [])
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase())

  if (!found) return { success: false, error: 'Email ou mot de passe incorrect.' }
  if (found.passwordHash !== btoa(password)) return { success: false, error: 'Email ou mot de passe incorrect.' }

  const user: User = {
    id: found.id,
    email: found.email,
    role: found.role,
    slug: found.slug,
    companyName: found.companyName,
  }

  const token = createToken(user)
  setItem(AUTH_KEY, { user, token })

  return { success: true, user }
}

export function logout(): void {
  removeItem(AUTH_KEY)
}

export function getSession(): { user: User | null; token: string | null } {
  const session = getItem<{ user: User; token: string } | null>(AUTH_KEY, null)
  if (!session) return { user: null, token: null }

  const decoded = decodeToken(session.token)
  if (!decoded || decoded.exp < Date.now()) {
    removeItem(AUTH_KEY)
    return { user: null, token: null }
  }

  return session
}
