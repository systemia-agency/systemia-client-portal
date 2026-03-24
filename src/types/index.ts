export type UserRole = 'admin' | 'client'

export interface User {
  id: string
  email: string
  role: UserRole
  slug: string
  companyName: string
}

export interface StoredUser {
  id: string
  email: string
  passwordHash: string
  role: UserRole
  slug: string
  companyName: string
  createdAt: string
}

export interface KpiData {
  leadsThisMonth: number
  leadsTrend: string
  costPerLead: number
  cplTrend: string
  adSpend: number
  adSpendTrend: string
  activeCampaigns: number
  campaignsTrend: string
}

export interface LeadsOverTimeEntry {
  month: string
  leads: number
}

export interface TrafficDataEntry {
  month: string
  trafic: number
  conversions: number
  leads: number
  cpl: number
}

export type ProjectStatus = 'en_cours' | 'termine' | 'en_attente'

export interface Project {
  id: string
  name: string
  status: ProjectStatus
  progress: number
  description: string
}

export type RequestPriority = 'Haute' | 'Moyenne' | 'Basse'
export type RequestType = 'Modification site' | 'Nouvelle campagne' | 'Support technique' | 'Question'
export type RequestStatus = 'en_cours' | 'en_attente' | 'resolu'

export interface ClientRequest {
  id: string
  clientSlug: string
  title: string
  type: RequestType
  priority: RequestPriority
  status: RequestStatus
  date: string
  description: string
}

export interface ActiveService {
  name: string
  status: 'actif' | 'inactif'
}

export interface Optimization {
  id: string
  name: string
  description: string
  icon: 'layout' | 'target' | 'search' | 'bar-chart'
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: 'payee' | 'en_attente' | 'en_retard'
  description: string
}

export interface Subscription {
  plan: string
  monthly: number
  nextBilling: string
  startDate: string
}

export interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: string
}

// --- Custom Pages ---

export type CustomPageType = 'financial-piloting' | 'leads-crm'

export interface CustomPage {
  id: string
  slug: string
  label: string
  icon: 'calculator' | 'euro' | 'trending-up' | 'pie-chart' | 'bar-chart' | 'clipboard' | 'users'
  type: CustomPageType
}

// Leads CRM data
export type LeadStatus = 'nouveau' | 'contacte' | 'qualifie' | 'proposition' | 'gagne' | 'perdu'
export type LeadSource = 'Meta Ads' | 'Google Ads' | 'Site web' | 'Recommandation' | 'Autre'

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  source: LeadSource
  status: LeadStatus
  value: number
  notes: string
  createdAt: string
  updatedAt: string
}

export interface LeadsCrmData {
  leads: Lead[]
}

// Financial Piloting data
export interface FinancialCharge {
  id: string
  label: string
  amount: number
  category: 'fixe' | 'variable'
}

export interface FinancialMonth {
  month: string
  revenue: number
  charges: FinancialCharge[]
}

export interface FinancialPilotingData {
  months: FinancialMonth[]
}

export interface ClientData {
  slug: string
  companyName: string
  kpiData: KpiData
  leadsOverTime: LeadsOverTimeEntry[]
  trafficData: TrafficDataEntry[]
  projects: Project[]
  activeServices: ActiveService[]
  optimizations: Optimization[]
  invoices: Invoice[]
  subscription: Subscription
  customPages?: CustomPage[]
  customPageData?: Record<string, unknown>
}
