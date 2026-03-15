import type { StoredUser, ClientData, KpiData, ClientRequest } from '@/types'
import { getItem, setItem, removeItem } from './localStorage'

const USERS_KEY = 'systemia_users'
const clientKey = (slug: string) => `systemia_client_${slug}`

// --- Users ---

export function getAllClients(): StoredUser[] {
  return getItem<StoredUser[]>(USERS_KEY, []).filter(u => u.role === 'client')
}

export function getClientBySlug(slug: string): StoredUser | undefined {
  return getItem<StoredUser[]>(USERS_KEY, []).find(u => u.slug === slug && u.role === 'client')
}

export function createClient(data: { email: string; password: string; companyName: string; slug: string }): StoredUser {
  const users = getItem<StoredUser[]>(USERS_KEY, [])

  if (users.some(u => u.slug === data.slug)) throw new Error('Ce slug existe déjà.')
  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) throw new Error('Cet email existe déjà.')
  if (['admin', 'login'].includes(data.slug)) throw new Error('Slug réservé.')

  const newUser: StoredUser = {
    id: `client-${Date.now()}`,
    email: data.email,
    passwordHash: btoa(data.password),
    role: 'client',
    slug: data.slug,
    companyName: data.companyName,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  setItem(USERS_KEY, users)

  // Create empty client data
  const emptyData: ClientData = {
    slug: data.slug,
    companyName: data.companyName,
    kpiData: { leadsThisMonth: 0, leadsTrend: '0%', costPerLead: 0, cplTrend: '0%', adSpend: 0, adSpendTrend: '0%', activeCampaigns: 0, campaignsTrend: '0%' },
    leadsOverTime: [],
    trafficData: [],
    projects: [],
    activeServices: [],
    optimizations: [],
    invoices: [],
    subscription: { plan: '', monthly: 0, nextBilling: '', startDate: '' },
  }
  setItem(clientKey(data.slug), emptyData)

  return newUser
}

export function updateClientUser(slug: string, updates: Partial<Pick<StoredUser, 'email' | 'companyName'>>): void {
  const users = getItem<StoredUser[]>(USERS_KEY, [])
  const idx = users.findIndex(u => u.slug === slug && u.role === 'client')
  if (idx === -1) return
  Object.assign(users[idx], updates)
  setItem(USERS_KEY, users)
}

export function deleteClient(slug: string): void {
  const users = getItem<StoredUser[]>(USERS_KEY, []).filter(u => !(u.slug === slug && u.role === 'client'))
  setItem(USERS_KEY, users)
  removeItem(clientKey(slug))
  // Remove client requests
  const REQUESTS_KEY = 'systemia_requests'
  const requests = getItem<ClientRequest[]>(REQUESTS_KEY, []).filter(r => r.clientSlug !== slug)
  setItem(REQUESTS_KEY, requests)
}

// --- Client Data ---

export function getClientData(slug: string): ClientData | null {
  return getItem<ClientData | null>(clientKey(slug), null)
}

export function updateClientData(slug: string, data: Partial<ClientData>): void {
  const current = getClientData(slug)
  if (!current) return
  setItem(clientKey(slug), { ...current, ...data })
}

export function updateClientKpis(slug: string, kpis: KpiData): void {
  updateClientData(slug, { kpiData: kpis })
}
