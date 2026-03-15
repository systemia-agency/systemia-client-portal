import type { StoredUser, ClientData, ClientRequest, Resource } from '@/types'
import { getItem, setItem } from './localStorage'
import {
  kpiData, leadsOverTime, trafficData, projects,
  activeServices, optimizations, invoices, subscription, resources, requests,
} from '@/data/mock'

const INIT_KEY = 'systemia_initialized'
const USERS_KEY = 'systemia_users'
const REQUESTS_KEY = 'systemia_requests'
const RESOURCES_KEY = 'systemia_resources'

export function seedData(): void {
  if (getItem<string | null>(INIT_KEY, null) === 'true') return

  // Create admin user
  const adminUser: StoredUser = {
    id: 'admin-1',
    email: 'admin@systemia.be',
    passwordHash: btoa('Systemia2026!'),
    role: 'admin',
    slug: 'admin',
    companyName: 'Systemia',
    createdAt: new Date().toISOString(),
  }

  // Create test client user
  const testUser: StoredUser = {
    id: 'client-test',
    email: 'client@test.com',
    passwordHash: btoa('test2026'),
    role: 'client',
    slug: 'test',
    companyName: 'Mon Entreprise',
    createdAt: new Date().toISOString(),
  }

  setItem<StoredUser[]>(USERS_KEY, [adminUser, testUser])

  // Seed test client data
  const testClientData: ClientData = {
    slug: 'test',
    companyName: 'Mon Entreprise',
    kpiData,
    leadsOverTime,
    trafficData,
    projects,
    activeServices: activeServices.map(s => ({ ...s, status: s.status as 'actif' | 'inactif' })),
    optimizations,
    invoices: invoices.map(i => ({ ...i, status: i.status as 'payee' | 'en_attente' | 'en_retard' })),
    subscription,
  }
  setItem(`systemia_client_test`, testClientData)

  // Seed requests with clientSlug
  const seededRequests: ClientRequest[] = requests.map(r => ({
    ...r,
    clientSlug: 'test',
    status: r.status as ClientRequest['status'],
    type: r.type as ClientRequest['type'],
    priority: r.priority as ClientRequest['priority'],
  }))
  setItem<ClientRequest[]>(REQUESTS_KEY, seededRequests)

  // Seed shared resources
  const seededResources: Resource[] = resources.map(r => ({ ...r }))
  setItem<Resource[]>(RESOURCES_KEY, seededResources)

  setItem(INIT_KEY, 'true')
}
