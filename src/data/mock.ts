// Mock data for the client portal

export const kpiData = {
  leadsThisMonth: 47,
  leadsTrend: '+12%',
  costPerLead: 18.50,
  cplTrend: '-8%',
  adSpend: 2340,
  adSpendTrend: '+5%',
  activeCampaigns: 4,
  campaignsTrend: '0%',
}

export const leadsOverTime = [
  { month: 'Oct', leads: 28 },
  { month: 'Nov', leads: 35 },
  { month: 'Dec', leads: 31 },
  { month: 'Jan', leads: 42 },
  { month: 'Fev', leads: 38 },
  { month: 'Mar', leads: 47 },
]

export const trafficData = [
  { month: 'Oct', trafic: 1200, conversions: 45, leads: 28, cpl: 22 },
  { month: 'Nov', trafic: 1450, conversions: 58, leads: 35, cpl: 20 },
  { month: 'Dec', trafic: 1300, conversions: 52, leads: 31, cpl: 21 },
  { month: 'Jan', trafic: 1680, conversions: 67, leads: 42, cpl: 19 },
  { month: 'Fev', trafic: 1520, conversions: 61, leads: 38, cpl: 20 },
  { month: 'Mar', trafic: 1890, conversions: 74, leads: 47, cpl: 18.5 },
]

export const projects = [
  {
    id: '1',
    name: 'Refonte Landing Page',
    status: 'en_cours' as const,
    progress: 65,
    description: 'Refonte complète de la landing page principale pour améliorer le taux de conversion.',
  },
  {
    id: '2',
    name: 'Campagne Google Ads Q1',
    status: 'en_cours' as const,
    progress: 80,
    description: 'Lancement et optimisation des campagnes Search pour le premier trimestre.',
  },
  {
    id: '3',
    name: 'Audit SEO Technique',
    status: 'termine' as const,
    progress: 100,
    description: 'Audit technique complet du site pour identifier les opportunités SEO.',
  },
  {
    id: '4',
    name: 'Création Vidéo Publicitaire',
    status: 'en_attente' as const,
    progress: 20,
    description: 'Production d\'une vidéo promotionnelle pour les campagnes Meta Ads.',
  },
]

export const requests = [
  {
    id: '1',
    title: 'Modification bannière homepage',
    type: 'Modification site' as const,
    priority: 'Moyenne' as const,
    status: 'en_cours' as const,
    date: '2026-03-12',
    description: 'Changer le texte et l\'image de la bannière principale.',
  },
  {
    id: '2',
    title: 'Nouvelle campagne promo printemps',
    type: 'Nouvelle campagne' as const,
    priority: 'Haute' as const,
    status: 'en_attente' as const,
    date: '2026-03-10',
    description: 'Lancer une campagne promotionnelle pour la collection printemps.',
  },
  {
    id: '3',
    title: 'Bug formulaire de contact',
    type: 'Support technique' as const,
    priority: 'Haute' as const,
    status: 'resolu' as const,
    date: '2026-03-05',
    description: 'Le formulaire de contact ne fonctionne plus sur mobile.',
  },
  {
    id: '4',
    title: 'Question sur les statistiques',
    type: 'Question' as const,
    priority: 'Basse' as const,
    status: 'resolu' as const,
    date: '2026-03-01',
    description: 'Comment lire le rapport de conversions ?',
  },
]

export const activeServices = [
  { name: 'Google Ads - Search', status: 'actif' as const },
  { name: 'Meta Ads - Campagnes', status: 'actif' as const },
  { name: 'Landing Page - Maintenance', status: 'actif' as const },
  { name: 'Reporting mensuel', status: 'actif' as const },
]

export const optimizations = [
  {
    id: '1',
    name: 'Audit Landing Page',
    description: 'Analyse complète de votre landing page avec recommandations UX et conversion.',
    icon: 'layout' as const,
  },
  {
    id: '2',
    name: 'Optimisation Campagne',
    description: 'Revue et optimisation de vos campagnes publicitaires pour maximiser le ROI.',
    icon: 'target' as const,
  },
  {
    id: '3',
    name: 'Audit SEO',
    description: 'Audit technique et sémantique de votre site pour améliorer votre référencement.',
    icon: 'search' as const,
  },
  {
    id: '4',
    name: 'Analyse Conversion',
    description: 'Étude approfondie de votre tunnel de conversion avec recommandations.',
    icon: 'bar-chart' as const,
  },
]

export const invoices = [
  { id: 'INV-2026-003', date: '2026-03-01', amount: 1950, status: 'payee' as const, description: 'Abonnement Mars 2026' },
  { id: 'INV-2026-002', date: '2026-02-01', amount: 1950, status: 'payee' as const, description: 'Abonnement Février 2026' },
  { id: 'INV-2026-001', date: '2026-01-01', amount: 1950, status: 'payee' as const, description: 'Abonnement Janvier 2026' },
  { id: 'INV-2025-012', date: '2025-12-01', amount: 1750, status: 'payee' as const, description: 'Abonnement Décembre 2025' },
  { id: 'INV-2025-011', date: '2025-11-01', amount: 1750, status: 'payee' as const, description: 'Abonnement Novembre 2025' },
]

export const subscription = {
  plan: 'Google Ads Élite',
  monthly: 1950,
  nextBilling: '2026-04-01',
  startDate: '2025-06-01',
}

export const resources = [
  {
    id: '1',
    title: 'Guide Google Ads',
    description: 'Comprendre les fondamentaux de Google Ads et optimiser vos campagnes.',
    category: 'Google Ads',
    type: 'PDF',
  },
  {
    id: '2',
    title: 'Comprendre vos statistiques',
    description: 'Guide pour lire et interpréter vos rapports de performance.',
    category: 'Reporting',
    type: 'PDF',
  },
  {
    id: '3',
    title: 'Guide Conversion',
    description: 'Les meilleures pratiques pour améliorer votre taux de conversion.',
    category: 'Conversion',
    type: 'PDF',
  },
  {
    id: '4',
    title: 'Guide Landing Page',
    description: 'Comment créer une landing page performante qui convertit.',
    category: 'Landing Page',
    type: 'PDF',
  },
]
