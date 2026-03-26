import type { StoredUser, ClientData, ClientRequest, Resource, FinancialPilotingData } from '@/types'
import { getItem, setItem } from './localStorage'
import {
  kpiData, leadsOverTime, trafficData, projects,
  activeServices, optimizations, invoices, subscription, resources, requests,
} from '@/data/mock'

const INIT_KEY = 'systemia_initialized'
const SEED_VERSION = '5'
const USERS_KEY = 'systemia_users'
const REQUESTS_KEY = 'systemia_requests'
const RESOURCES_KEY = 'systemia_resources'

export function seedData(): void {
  if (getItem<string | null>(INIT_KEY, null) === SEED_VERSION) return

  // Clear old data on version change
  Object.keys(localStorage).filter(k => k.startsWith('systemia_')).forEach(k => localStorage.removeItem(k))

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
    email: 'admin@boutiquemda.com',
    passwordHash: btoa('Caprisun1'),
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
    customPages: [
      { id: 'leads-test', slug: 'leads', label: 'Vos leads', icon: 'users', type: 'leads-crm' },
    ],
    customPageData: {
      'leads-test': {
        leads: [
          { id: 'lead-1', name: 'Marie Lambert', email: 'marie@lambert-fils.be', phone: '+32 470 123 456', company: 'Lambert & Fils', source: 'Meta Ads', status: 'gagne', value: 18500, notes: 'Contrat signé — Pack Performance 12 mois. Cliente ravie du premier mois.', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-02-20T14:30:00Z' },
          { id: 'lead-2', name: 'Thomas Renard', email: 'thomas@renard-consulting.be', phone: '+32 499 876 543', company: 'Renard Consulting', source: 'Google Ads', status: 'proposition', value: 24000, notes: 'Proposition envoyée pour gestion complète Google + Meta. RDV closing jeudi.', createdAt: '2026-03-05T09:00:00Z', updatedAt: '2026-03-22T11:00:00Z' },
          { id: 'lead-3', name: 'Sophie Dumont', email: 'sophie@dumont-archi.be', phone: '+32 475 222 333', company: 'Dumont Architecture', source: 'Site web', status: 'qualifie', value: 8500, notes: 'Cabinet d\'architectes — intéressée par acquisition de leads via Google.', createdAt: '2026-03-18T16:45:00Z', updatedAt: '2026-03-21T10:00:00Z' },
          { id: 'lead-4', name: 'Pierre Mercier', email: 'p.mercier@mercier-immo.be', phone: '+32 486 555 111', company: 'Mercier Immobilier', source: 'Recommandation', status: 'gagne', value: 36000, notes: 'Contrat premium 24 mois signé. Meilleur client du trimestre.', createdAt: '2026-01-10T08:00:00Z', updatedAt: '2026-02-01T10:00:00Z' },
          { id: 'lead-5', name: 'Isabelle Fontaine', email: 'isabelle@fontaine-design.com', phone: '+32 472 333 444', company: 'Fontaine Design', source: 'Meta Ads', status: 'contacte', value: 5500, notes: 'Appel découverte réalisé — très intéressée, attend le devis.', createdAt: '2026-03-19T13:00:00Z', updatedAt: '2026-03-23T09:30:00Z' },
          { id: 'lead-6', name: 'Antoine Dubois', email: 'a.dubois@dubois-traiteur.be', phone: '+32 468 777 888', company: 'Dubois Traiteur', source: 'Google Ads', status: 'gagne', value: 14400, notes: 'Signé pour 12 mois — Google Ads + Landing Page.', createdAt: '2026-02-08T11:00:00Z', updatedAt: '2026-02-28T16:00:00Z' },
          { id: 'lead-7', name: 'Nathalie Petit', email: 'nathalie@petit-beaute.be', phone: '+32 474 111 222', company: 'Petit Beauté', source: 'Meta Ads', status: 'qualifie', value: 7200, notes: 'Salon de beauté — veut augmenter sa visibilité locale. Budget ok.', createdAt: '2026-03-12T14:00:00Z', updatedAt: '2026-03-20T17:00:00Z' },
          { id: 'lead-8', name: 'Marc Leroy', email: 'marc@leroy-avocat.be', phone: '+32 479 444 555', company: 'Cabinet Leroy', source: 'Google Ads', status: 'proposition', value: 15000, notes: 'Avocat spécialisé droit des affaires. Proposition Google Ads envoyée.', createdAt: '2026-03-14T10:30:00Z', updatedAt: '2026-03-22T14:00:00Z' },
          { id: 'lead-9', name: 'Laura Van den Berg', email: 'laura@vdb-coaching.be', phone: '+32 471 666 777', company: 'VDB Coaching', source: 'Site web', status: 'nouveau', value: 0, notes: 'A rempli le formulaire de contact — à rappeler.', createdAt: '2026-03-23T08:15:00Z', updatedAt: '2026-03-23T08:15:00Z' },
          { id: 'lead-10', name: 'Julien Maes', email: 'julien@maes-auto.be', phone: '+32 478 888 999', company: 'Maes Automobiles', source: 'Recommandation', status: 'contacte', value: 12000, notes: 'Recommandé par Pierre Mercier. Garage premium, gros potentiel.', createdAt: '2026-03-20T09:00:00Z', updatedAt: '2026-03-23T11:00:00Z' },
          { id: 'lead-11', name: 'Catherine Wouters', email: 'c.wouters@wouters-pharma.be', phone: '+32 476 333 222', company: 'Pharmacie Wouters', source: 'Meta Ads', status: 'perdu', value: 4800, notes: 'A choisi un concurrent — budget trop serré pour notre offre.', createdAt: '2026-02-20T15:00:00Z', updatedAt: '2026-03-10T12:00:00Z' },
          { id: 'lead-12', name: 'François Martin', email: 'f.martin@martin-construct.be', phone: '+32 477 555 666', company: 'Martin Construction', source: 'Google Ads', status: 'gagne', value: 21600, notes: 'Signé ! Pack complet 18 mois — Google + Meta + Landing Page.', createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-03-05T09:00:00Z' },
          { id: 'lead-13', name: 'Emma Claes', email: 'emma@claes-events.be', phone: '+32 473 444 111', company: 'Claes Events', source: 'Meta Ads', status: 'nouveau', value: 0, notes: 'Organisatrice d\'événements — demande info via Instagram.', createdAt: '2026-03-23T14:30:00Z', updatedAt: '2026-03-23T14:30:00Z' },
          { id: 'lead-14', name: 'David Henrard', email: 'david@henrard-tech.be', phone: '+32 475 999 000', company: 'Henrard Technologies', source: 'Recommandation', status: 'qualifie', value: 28000, notes: 'Entreprise IT B2B. Gros budget, veut dominer Google sur son marché.', createdAt: '2026-03-08T11:30:00Z', updatedAt: '2026-03-21T16:00:00Z' },
        ],
      },
    },
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

  // Seed Boutique MDA with financial piloting custom page (Shopify e-commerce)
  const mdaFinancialData: FinancialPilotingData = {
    months: [
      {
        month: 'Janvier 2026',
        revenue: 30000,
        orders: 245,
        charges: [
          { id: 'ch-1', label: 'Loyer entrepôt', amount: 2000, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-2', label: 'Charges salariales', amount: 4000, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-3', label: 'Assurances', amount: 450, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-4', label: 'Comptable', amount: 350, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-4b', label: 'Abonnement Shopify', amount: 79, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-4c', label: 'Apps & outils SaaS', amount: 180, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-5', label: 'Meta Ads', amount: 5000, category: 'variable', dependsOn: 'ca' },
          { id: 'ch-5b', label: 'Google Ads', amount: 1500, category: 'variable', dependsOn: 'ca' },
          { id: 'ch-6', label: 'Achat marchandise', amount: 8000, category: 'variable', dependsOn: 'ca' },
          { id: 'ch-7', label: 'Frais d\'expédition', amount: 1200, category: 'variable', dependsOn: 'commandes' },
          { id: 'ch-8', label: 'Emballages', amount: 400, category: 'variable', dependsOn: 'commandes' },
          { id: 'ch-8b', label: 'Préparateur de commande', amount: 1800, category: 'variable', dependsOn: 'commandes' },
          { id: 'ch-8c', label: 'Frais Stripe/paiement', amount: 540, category: 'variable', dependsOn: 'ca' },
        ],
      },
      {
        month: 'Février 2026',
        revenue: 27500,
        orders: 210,
        charges: [
          { id: 'ch-9', label: 'Loyer entrepôt', amount: 2000, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-10', label: 'Charges salariales', amount: 4000, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-11', label: 'Assurances', amount: 450, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-12', label: 'Comptable', amount: 350, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-12b', label: 'Abonnement Shopify', amount: 79, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-12c', label: 'Apps & outils SaaS', amount: 180, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-13', label: 'Meta Ads', amount: 4500, category: 'variable', dependsOn: 'ca' },
          { id: 'ch-13b', label: 'Google Ads', amount: 1200, category: 'variable', dependsOn: 'ca' },
          { id: 'ch-14', label: 'Achat marchandise', amount: 7000, category: 'variable', dependsOn: 'ca' },
          { id: 'ch-15', label: 'Frais d\'expédition', amount: 1000, category: 'variable', dependsOn: 'commandes' },
          { id: 'ch-16', label: 'Emballages', amount: 350, category: 'variable', dependsOn: 'commandes' },
          { id: 'ch-16b', label: 'Préparateur de commande', amount: 1550, category: 'variable', dependsOn: 'commandes' },
          { id: 'ch-16c', label: 'Frais Stripe/paiement', amount: 495, category: 'variable', dependsOn: 'ca' },
        ],
      },
      {
        month: 'Mars 2026',
        revenue: 33000,
        orders: 280,
        charges: [
          { id: 'ch-17', label: 'Loyer entrepôt', amount: 2000, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-18', label: 'Charges salariales', amount: 4000, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-19', label: 'Assurances', amount: 450, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-20', label: 'Comptable', amount: 350, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-20b', label: 'Abonnement Shopify', amount: 79, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-20c', label: 'Apps & outils SaaS', amount: 195, category: 'fixe', dependsOn: 'fixe' },
          { id: 'ch-21', label: 'Meta Ads', amount: 5500, category: 'variable', dependsOn: 'ca' },
          { id: 'ch-21b', label: 'Google Ads', amount: 1800, category: 'variable', dependsOn: 'ca' },
          { id: 'ch-22', label: 'Achat marchandise', amount: 9000, category: 'variable', dependsOn: 'ca' },
          { id: 'ch-23', label: 'Frais d\'expédition', amount: 1400, category: 'variable', dependsOn: 'commandes' },
          { id: 'ch-24', label: 'Emballages', amount: 500, category: 'variable', dependsOn: 'commandes' },
          { id: 'ch-24b', label: 'Préparateur de commande', amount: 2100, category: 'variable', dependsOn: 'commandes' },
          { id: 'ch-24c', label: 'Frais Stripe/paiement', amount: 594, category: 'variable', dependsOn: 'ca' },
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
    visibleMenus: [], // NO standard menus — only custom
    customPages: [
      { id: 'financial-mda', slug: 'maitrise-couts', label: 'Maîtrise des coûts', icon: 'calculator', type: 'financial-piloting', clientEditable: true },
    ],
    customPageData: {
      'financial-mda': mdaFinancialData,
    },
  }
  setItem('systemia_client_boutique-mda', mdaClientData)

  // Seed shared resources
  const seededResources: Resource[] = resources.map(r => ({ ...r }))
  setItem<Resource[]>(RESOURCES_KEY, seededResources)

  setItem(INIT_KEY, SEED_VERSION)
}
