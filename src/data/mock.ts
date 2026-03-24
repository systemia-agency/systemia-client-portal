// Mock data for the client portal — Demo showcase

export const kpiData = {
  leadsThisMonth: 127,
  leadsTrend: '+23%',
  costPerLead: 12.40,
  cplTrend: '-18%',
  adSpend: 4850,
  adSpendTrend: '+8%',
  activeCampaigns: 7,
  campaignsTrend: '+2',
}

export const leadsOverTime = [
  { month: 'Oct', leads: 52 },
  { month: 'Nov', leads: 68 },
  { month: 'Dec', leads: 61 },
  { month: 'Jan', leads: 89 },
  { month: 'Fev', leads: 103 },
  { month: 'Mar', leads: 127 },
]

export const trafficData = [
  { month: 'Oct', trafic: 3200, conversions: 128, leads: 52, cpl: 19.20 },
  { month: 'Nov', trafic: 4100, conversions: 172, leads: 68, cpl: 16.80 },
  { month: 'Dec', trafic: 3800, conversions: 155, leads: 61, cpl: 17.50 },
  { month: 'Jan', trafic: 5200, conversions: 218, leads: 89, cpl: 14.60 },
  { month: 'Fev', trafic: 5800, conversions: 247, leads: 103, cpl: 13.20 },
  { month: 'Mar', trafic: 6400, conversions: 289, leads: 127, cpl: 12.40 },
]

export const projects = [
  {
    id: '1',
    name: 'Refonte Landing Page',
    status: 'termine' as const,
    progress: 100,
    description: 'Refonte complète de la landing page principale — taux de conversion passé de 2.1% à 4.5%.',
  },
  {
    id: '2',
    name: 'Campagne Google Ads Q1',
    status: 'en_cours' as const,
    progress: 85,
    description: 'Campagnes Search & Performance Max optimisées avec un ROAS de 6.2x.',
  },
  {
    id: '3',
    name: 'Campagne Meta Ads — Acquisition',
    status: 'en_cours' as const,
    progress: 72,
    description: 'Campagnes Facebook & Instagram ciblées. CPL en baisse de 35% depuis le lancement.',
  },
  {
    id: '4',
    name: 'Création Vidéo Publicitaire',
    status: 'en_cours' as const,
    progress: 45,
    description: 'Production de 3 vidéos UGC et 2 vidéos motion design pour Meta Ads.',
  },
  {
    id: '5',
    name: 'Audit SEO Technique',
    status: 'termine' as const,
    progress: 100,
    description: 'Audit complet réalisé — 47 optimisations identifiées, 38 déjà implémentées.',
  },
  {
    id: '6',
    name: 'Tunnel de vente automatisé',
    status: 'en_cours' as const,
    progress: 60,
    description: 'Mise en place d\'un funnel complet : landing page → formulaire → séquence email → RDV.',
  },
  {
    id: '7',
    name: 'Stratégie de contenu LinkedIn',
    status: 'en_attente' as const,
    progress: 10,
    description: 'Planification du calendrier éditorial LinkedIn pour le Q2 2026.',
  },
]

export const requests = [
  {
    id: '1',
    title: 'Modification bannière homepage',
    type: 'Modification site' as const,
    priority: 'Moyenne' as const,
    status: 'resolu' as const,
    date: '2026-03-18',
    description: 'Mise à jour du texte et de l\'image de la bannière principale — livré en 24h.',
  },
  {
    id: '2',
    title: 'Nouvelle campagne promo printemps',
    type: 'Nouvelle campagne' as const,
    priority: 'Haute' as const,
    status: 'en_cours' as const,
    date: '2026-03-15',
    description: 'Lancement d\'une campagne promotionnelle saisonnière sur Meta Ads + Google.',
  },
  {
    id: '3',
    title: 'Ajout page témoignages clients',
    type: 'Modification site' as const,
    priority: 'Moyenne' as const,
    status: 'en_cours' as const,
    date: '2026-03-12',
    description: 'Création d\'une page dédiée aux avis et témoignages clients avec intégration vidéo.',
  },
  {
    id: '4',
    title: 'Bug formulaire de contact mobile',
    type: 'Support technique' as const,
    priority: 'Haute' as const,
    status: 'resolu' as const,
    date: '2026-03-08',
    description: 'Le formulaire ne s\'affichait pas correctement sur iOS — corrigé.',
  },
  {
    id: '5',
    title: 'Intégration CRM HubSpot',
    type: 'Support technique' as const,
    priority: 'Haute' as const,
    status: 'en_attente' as const,
    date: '2026-03-20',
    description: 'Connexion automatique des leads du formulaire vers HubSpot CRM.',
  },
  {
    id: '6',
    title: 'Question sur le rapport de mars',
    type: 'Question' as const,
    priority: 'Basse' as const,
    status: 'resolu' as const,
    date: '2026-03-05',
    description: 'Comment lire les métriques de conversion du rapport mensuel ?',
  },
]

export const activeServices = [
  { name: 'Google Ads — Search & PMax', status: 'actif' as const },
  { name: 'Meta Ads — Acquisition & Retargeting', status: 'actif' as const },
  { name: 'Landing Page — Création & Optimisation', status: 'actif' as const },
  { name: 'Reporting mensuel détaillé', status: 'actif' as const },
  { name: 'SEO — Suivi & Optimisation', status: 'actif' as const },
  { name: 'Production créative (vidéo & design)', status: 'actif' as const },
  { name: 'Consulting stratégique mensuel', status: 'actif' as const },
]

export const optimizations = [
  {
    id: '1',
    name: 'A/B Testing Landing Page',
    description: 'Test de 3 variantes de votre page d\'atterrissage pour maximiser le taux de conversion.',
    icon: 'layout' as const,
  },
  {
    id: '2',
    name: 'Audiences Lookalike avancées',
    description: 'Création d\'audiences similaires basées sur vos meilleurs clients pour élargir votre reach qualifié.',
    icon: 'target' as const,
  },
  {
    id: '3',
    name: 'Stratégie SEO Local',
    description: 'Optimisation de votre présence locale (Google Business Profile, citations, avis).',
    icon: 'search' as const,
  },
  {
    id: '4',
    name: 'Attribution multi-touch',
    description: 'Mise en place d\'un modèle d\'attribution avancé pour mesurer l\'impact réel de chaque canal.',
    icon: 'bar-chart' as const,
  },
]

export const invoices = [
  { id: 'INV-2026-003', date: '2026-03-01', amount: 2950, status: 'payee' as const, description: 'Pack Performance — Mars 2026' },
  { id: 'INV-2026-002', date: '2026-02-01', amount: 2950, status: 'payee' as const, description: 'Pack Performance — Février 2026' },
  { id: 'INV-2026-001', date: '2026-01-01', amount: 2950, status: 'payee' as const, description: 'Pack Performance — Janvier 2026' },
  { id: 'INV-2025-012', date: '2025-12-01', amount: 2450, status: 'payee' as const, description: 'Pack Growth — Décembre 2025' },
  { id: 'INV-2025-011', date: '2025-11-01', amount: 2450, status: 'payee' as const, description: 'Pack Growth — Novembre 2025' },
  { id: 'INV-2025-010', date: '2025-10-01', amount: 2450, status: 'payee' as const, description: 'Pack Growth — Octobre 2025' },
  { id: 'INV-2025-009', date: '2025-09-01', amount: 1950, status: 'payee' as const, description: 'Pack Starter — Septembre 2025' },
  { id: 'INV-2025-008', date: '2025-08-01', amount: 1950, status: 'payee' as const, description: 'Pack Starter — Août 2025' },
]

export const subscription = {
  plan: 'Performance Acquisition 360°',
  monthly: 2950,
  nextBilling: '2026-04-01',
  startDate: '2025-08-01',
}

export const resources = [
  {
    id: '1',
    title: 'Guide Google Ads — Bonnes pratiques 2026',
    description: 'Les stratégies avancées pour maximiser votre ROI sur Google Ads cette année.',
    category: 'Google Ads',
    type: 'PDF',
  },
  {
    id: '2',
    title: 'Comprendre vos rapports de performance',
    description: 'Guide pas à pas pour lire et interpréter vos KPIs et prendre les bonnes décisions.',
    category: 'Reporting',
    type: 'Guide',
  },
  {
    id: '3',
    title: 'Optimiser votre taux de conversion',
    description: 'Les 12 leviers prouvés pour améliorer votre taux de conversion de 30% en moyenne.',
    category: 'Conversion',
    type: 'PDF',
  },
  {
    id: '4',
    title: 'Créer une Landing Page qui convertit',
    description: 'Anatomie d\'une landing page à haut taux de conversion avec exemples concrets.',
    category: 'Landing Page',
    type: 'Guide',
  },
  {
    id: '5',
    title: 'Meta Ads — Les formats qui performent',
    description: 'Analyse des meilleurs formats publicitaires sur Facebook et Instagram en 2026.',
    category: 'Meta Ads',
    type: 'Vidéo',
  },
  {
    id: '6',
    title: 'Checklist SEO — 50 points essentiels',
    description: 'La checklist complète pour auditer et optimiser votre référencement naturel.',
    category: 'SEO',
    type: 'Template',
  },
]
