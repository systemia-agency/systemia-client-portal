import type { StoredUser, ClientData, ClientRequest, Resource, FinancialPilotingData } from '@/types'
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

  // Create Boutique MDA client
  const mdaUser: StoredUser = {
    id: 'client-boutique-mda',
    email: 'contact@boutique-mda.be',
    passwordHash: btoa('mda2026'),
    role: 'client',
    slug: 'boutique-mda',
    companyName: 'Boutique MDA',
    createdAt: new Date().toISOString(),
  }

  setItem<StoredUser[]>(USERS_KEY, [adminUser, testUser, mdaUser])

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

  // Seed Boutique MDA with financial piloting custom page
  const mdaFinancialData: FinancialPilotingData = {
    months: [
      {
        month: 'Janvier 2026',
        revenue: 30000,
        charges: [
          { id: 'ch-1', label: 'Loyer', amount: 2000, category: 'fixe' },
          { id: 'ch-2', label: 'Charges salariales', amount: 4000, category: 'fixe' },
          { id: 'ch-3', label: 'Assurances', amount: 450, category: 'fixe' },
          { id: 'ch-4', label: 'Comptable', amount: 350, category: 'fixe' },
          { id: 'ch-5', label: 'Meta Ads', amount: 5000, category: 'variable' },
          { id: 'ch-6', label: 'Fournisseurs marchandise', amount: 8000, category: 'variable' },
          { id: 'ch-7', label: 'Frais d\'expédition', amount: 1200, category: 'variable' },
          { id: 'ch-8', label: 'Emballages', amount: 400, category: 'variable' },
        ],
      },
      {
        month: 'Février 2026',
        revenue: 27500,
        charges: [
          { id: 'ch-9', label: 'Loyer', amount: 2000, category: 'fixe' },
          { id: 'ch-10', label: 'Charges salariales', amount: 4000, category: 'fixe' },
          { id: 'ch-11', label: 'Assurances', amount: 450, category: 'fixe' },
          { id: 'ch-12', label: 'Comptable', amount: 350, category: 'fixe' },
          { id: 'ch-13', label: 'Meta Ads', amount: 4500, category: 'variable' },
          { id: 'ch-14', label: 'Fournisseurs marchandise', amount: 7000, category: 'variable' },
          { id: 'ch-15', label: 'Frais d\'expédition', amount: 1000, category: 'variable' },
          { id: 'ch-16', label: 'Emballages', amount: 350, category: 'variable' },
        ],
      },
      {
        month: 'Mars 2026',
        revenue: 33000,
        charges: [
          { id: 'ch-17', label: 'Loyer', amount: 2000, category: 'fixe' },
          { id: 'ch-18', label: 'Charges salariales', amount: 4000, category: 'fixe' },
          { id: 'ch-19', label: 'Assurances', amount: 450, category: 'fixe' },
          { id: 'ch-20', label: 'Comptable', amount: 350, category: 'fixe' },
          { id: 'ch-21', label: 'Meta Ads', amount: 5500, category: 'variable' },
          { id: 'ch-22', label: 'Fournisseurs marchandise', amount: 9000, category: 'variable' },
          { id: 'ch-23', label: 'Frais d\'expédition', amount: 1400, category: 'variable' },
          { id: 'ch-24', label: 'Emballages', amount: 500, category: 'variable' },
        ],
      },
    ],
  }

  const mdaClientData: ClientData = {
    slug: 'boutique-mda',
    companyName: 'Boutique MDA',
    kpiData: { leadsThisMonth: 0, leadsTrend: '0%', costPerLead: 0, cplTrend: '0%', adSpend: 5000, adSpendTrend: '+10%', activeCampaigns: 2, campaignsTrend: '0%' },
    leadsOverTime: [],
    trafficData: [],
    projects: [],
    activeServices: [{ name: 'Meta Ads - Campagnes e-commerce', status: 'actif' }],
    optimizations: [],
    invoices: [],
    subscription: { plan: 'Performance E-commerce', monthly: 1500, nextBilling: '2026-04-01', startDate: '2026-01-01' },
    customPages: [
      { id: 'financial-mda', slug: 'maitrise-couts', label: 'Maîtrise des coûts', icon: 'calculator', type: 'financial-piloting' },
    ],
    customPageData: {
      'financial-mda': mdaFinancialData,
    },
  }
  setItem('systemia_client_boutique-mda', mdaClientData)

  // Seed shared resources
  const seededResources: Resource[] = resources.map(r => ({ ...r }))
  setItem<Resource[]>(RESOURCES_KEY, seededResources)

  setItem(INIT_KEY, 'true')
}
