import { useState, useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getClientBySlug, getClientData, updateClientData } from '@/store/clientStore'
import type { ClientData, Project, Invoice, ActiveService, Optimization, TrafficDataEntry, CustomPage, CustomPageType, StandardMenuId, FinancialPilotingData, FinancialCharge, PaymentMethodConfig } from '@/types'
import { ALL_STANDARD_MENUS } from '@/types'
import { ArrowLeft, Save, Plus, Trash2, Check, Eye, HelpCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = ['KPIs', 'Analytics', 'Projets', 'Services', 'Facturation', 'Menus', 'Formules'] as const
type Tab = (typeof tabs)[number]

export function AdminClientEditor() {
  const { slug } = useParams<{ slug: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('KPIs')
  const [data, setData] = useState<ClientData | null>(null)
  const [saved, setSaved] = useState(false)
  const client = slug ? getClientBySlug(slug) : undefined

  useEffect(() => {
    if (slug) {
      setData(getClientData(slug))
    }
  }, [slug])

  if (!slug || !client) return <Navigate to="/admin/clients" replace />
  if (!data) return <p className="text-muted-foreground">Chargement...</p>

  const save = () => {
    updateClientData(slug, data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <Link to="/admin/clients">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" />Retour</Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{client.companyName}</h1>
            <p className="text-muted-foreground text-sm">/{slug} — {client.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/client/${slug}?admin_preview=1`}>
            <Button variant="outline" size="sm"><Eye className="h-4 w-4" />Voir comme le client</Button>
          </Link>
          <Button variant="gradient" onClick={save}>
            {saved ? <><Check className="h-4 w-4" />Sauvegardé</> : <><Save className="h-4 w-4" />Sauvegarder</>}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab
                ? 'border-[var(--sys-blue)] text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'KPIs' && <KpisTab data={data} setData={setData} />}
      {activeTab === 'Analytics' && <AnalyticsTab data={data} setData={setData} />}
      {activeTab === 'Projets' && <ProjetsTab data={data} setData={setData} />}
      {activeTab === 'Services' && <ServicesTab data={data} setData={setData} />}
      {activeTab === 'Facturation' && <FacturationTab data={data} setData={setData} />}
      {activeTab === 'Menus' && <MenusTab data={data} setData={setData} />}
      {activeTab === 'Formules' && <FormulesTab data={data} setData={setData} />}
    </div>
  )
}

// --- Input helper ---
function Field({ label, value, onChange, type = 'text' }: { label: string; value: string | number; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  )
}

// --- KPIs Tab ---
function KpisTab({ data, setData }: { data: ClientData; setData: (d: ClientData) => void }) {
  const k = data.kpiData
  const update = (field: string, value: string) => {
    const numFields = ['leadsThisMonth', 'costPerLead', 'adSpend', 'activeCampaigns']
    const v = numFields.includes(field) ? Number(value) : value
    setData({ ...data, kpiData: { ...k, [field]: v } })
  }

  return (
    <Card>
      <CardHeader><CardTitle>KPIs principaux</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Leads ce mois" value={k.leadsThisMonth} onChange={v => update('leadsThisMonth', v)} type="number" />
          <Field label="Tendance leads" value={k.leadsTrend} onChange={v => update('leadsTrend', v)} />
          <Field label="Coût par lead (€)" value={k.costPerLead} onChange={v => update('costPerLead', v)} type="number" />
          <Field label="Tendance CPL" value={k.cplTrend} onChange={v => update('cplTrend', v)} />
          <Field label="Budget pub (€)" value={k.adSpend} onChange={v => update('adSpend', v)} type="number" />
          <Field label="Tendance budget" value={k.adSpendTrend} onChange={v => update('adSpendTrend', v)} />
          <Field label="Campagnes actives" value={k.activeCampaigns} onChange={v => update('activeCampaigns', v)} type="number" />
          <Field label="Tendance campagnes" value={k.campaignsTrend} onChange={v => update('campaignsTrend', v)} />
        </div>
      </CardContent>
    </Card>
  )
}

// --- Analytics Tab ---
function AnalyticsTab({ data, setData }: { data: ClientData; setData: (d: ClientData) => void }) {
  const addRow = () => {
    setData({ ...data, trafficData: [...data.trafficData, { month: '', trafic: 0, conversions: 0, leads: 0, cpl: 0 }] })
  }
  const removeRow = (idx: number) => {
    setData({ ...data, trafficData: data.trafficData.filter((_, i) => i !== idx) })
  }
  const updateRow = (idx: number, field: keyof TrafficDataEntry, value: string) => {
    const rows = [...data.trafficData]
    if (field === 'month') {
      rows[idx] = { ...rows[idx], month: value }
    } else {
      rows[idx] = { ...rows[idx], [field]: Number(value) }
    }
    setData({ ...data, trafficData: rows })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Données analytiques mensuelles</CardTitle>
          <Button variant="outline" size="sm" onClick={addRow}><Plus className="h-4 w-4" />Ajouter un mois</Button>
        </div>
      </CardHeader>
      <CardContent>
        {data.trafficData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Aucune donnée. Ajoutez un mois pour commencer.</p>
        ) : (
          <div className="overflow-x-auto"><div className="min-w-[600px] space-y-2">
            <div className="grid grid-cols-6 gap-3 px-2 text-xs font-semibold text-muted-foreground uppercase">
              <span>Mois</span><span>Trafic</span><span>Conversions</span><span>Leads</span><span>CPL (€)</span><span></span>
            </div>
            {data.trafficData.map((row, idx) => (
              <div key={idx} className="grid grid-cols-6 gap-3 items-center">
                <input value={row.month} onChange={e => updateRow(idx, 'month', e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm" placeholder="Jan" />
                <input type="number" value={row.trafic} onChange={e => updateRow(idx, 'trafic', e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm" />
                <input type="number" value={row.conversions} onChange={e => updateRow(idx, 'conversions', e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm" />
                <input type="number" value={row.leads} onChange={e => updateRow(idx, 'leads', e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm" />
                <input type="number" value={row.cpl} onChange={e => updateRow(idx, 'cpl', e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm" />
                <Button variant="ghost" size="sm" onClick={() => removeRow(idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            ))}
          </div></div>
        )}
      </CardContent>
    </Card>
  )
}

// --- Projets Tab ---
function ProjetsTab({ data, setData }: { data: ClientData; setData: (d: ClientData) => void }) {
  const addProject = () => {
    const p: Project = { id: `proj-${Date.now()}`, name: '', description: '', status: 'en_cours', progress: 0 }
    setData({ ...data, projects: [...data.projects, p] })
  }
  const removeProject = (idx: number) => {
    setData({ ...data, projects: data.projects.filter((_, i) => i !== idx) })
  }
  const updateProject = (idx: number, field: keyof Project, value: string | number) => {
    const projects = [...data.projects]
    projects[idx] = { ...projects[idx], [field]: value }
    setData({ ...data, projects })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Projets</CardTitle>
          <Button variant="outline" size="sm" onClick={addProject}><Plus className="h-4 w-4" />Ajouter</Button>
        </div>
      </CardHeader>
      <CardContent>
        {data.projects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Aucun projet.</p>
        ) : (
          <div className="space-y-4">
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className="p-4 rounded-lg border border-border bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Projet #{idx + 1}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => removeProject(idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field label="Nom" value={proj.name} onChange={v => updateProject(idx, 'name', v)} />
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Statut</label>
                    <select
                      value={proj.status}
                      onChange={e => updateProject(idx, 'status', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="en_cours">En cours</option>
                      <option value="termine">Terminé</option>
                      <option value="en_attente">En attente</option>
                    </select>
                  </div>
                  <Field label="Progression (%)" value={proj.progress} onChange={v => updateProject(idx, 'progress', Number(v))} type="number" />
                </div>
                <Field label="Description" value={proj.description} onChange={v => updateProject(idx, 'description', v)} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// --- Services Tab ---
function ServicesTab({ data, setData }: { data: ClientData; setData: (d: ClientData) => void }) {
  const addService = () => {
    setData({ ...data, activeServices: [...data.activeServices, { name: '', status: 'actif' }] })
  }
  const removeService = (idx: number) => {
    setData({ ...data, activeServices: data.activeServices.filter((_, i) => i !== idx) })
  }
  const updateService = (idx: number, field: keyof ActiveService, value: string) => {
    const services = [...data.activeServices]
    services[idx] = { ...services[idx], [field]: value } as ActiveService
    setData({ ...data, activeServices: services })
  }

  const addOpt = () => {
    const o: Optimization = { id: `opt-${Date.now()}`, name: '', description: '', icon: 'bar-chart' }
    setData({ ...data, optimizations: [...data.optimizations, o] })
  }
  const removeOpt = (idx: number) => {
    setData({ ...data, optimizations: data.optimizations.filter((_, i) => i !== idx) })
  }
  const updateOpt = (idx: number, field: keyof Optimization, value: string) => {
    const opts = [...data.optimizations]
    opts[idx] = { ...opts[idx], [field]: value } as Optimization
    setData({ ...data, optimizations: opts })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Services actifs</CardTitle>
            <Button variant="outline" size="sm" onClick={addService}><Plus className="h-4 w-4" />Ajouter</Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.activeServices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucun service.</p>
          ) : (
            <div className="space-y-2">
              {data.activeServices.map((svc, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    value={svc.name}
                    onChange={e => updateService(idx, 'name', e.target.value)}
                    className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm"
                    placeholder="Nom du service"
                  />
                  <select
                    value={svc.status}
                    onChange={e => updateService(idx, 'status', e.target.value)}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                  <Button variant="ghost" size="sm" onClick={() => removeService(idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Optimisations disponibles</CardTitle>
            <Button variant="outline" size="sm" onClick={addOpt}><Plus className="h-4 w-4" />Ajouter</Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.optimizations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune optimisation.</p>
          ) : (
            <div className="space-y-3">
              {data.optimizations.map((opt, idx) => (
                <div key={opt.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input value={opt.name} onChange={e => updateOpt(idx, 'name', e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm" placeholder="Nom" />
                    <input value={opt.description} onChange={e => updateOpt(idx, 'description', e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm md:col-span-2" placeholder="Description" />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeOpt(idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// --- Facturation Tab ---
function FacturationTab({ data, setData }: { data: ClientData; setData: (d: ClientData) => void }) {
  const sub = data.subscription

  const addInvoice = () => {
    const inv: Invoice = { id: `inv-${Date.now()}`, date: new Date().toISOString().split('T')[0], amount: 0, status: 'en_attente', description: '' }
    setData({ ...data, invoices: [...data.invoices, inv] })
  }
  const removeInvoice = (idx: number) => {
    setData({ ...data, invoices: data.invoices.filter((_, i) => i !== idx) })
  }
  const updateInvoice = (idx: number, field: keyof Invoice, value: string | number) => {
    const invoices = [...data.invoices]
    invoices[idx] = { ...invoices[idx], [field]: value } as Invoice
    setData({ ...data, invoices })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Abonnement</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Field label="Plan" value={sub.plan} onChange={v => setData({ ...data, subscription: { ...sub, plan: v } })} />
            <Field label="Mensualité (€)" value={sub.monthly} onChange={v => setData({ ...data, subscription: { ...sub, monthly: Number(v) } })} type="number" />
            <Field label="Prochain paiement" value={sub.nextBilling} onChange={v => setData({ ...data, subscription: { ...sub, nextBilling: v } })} type="date" />
            <Field label="Date de début" value={sub.startDate} onChange={v => setData({ ...data, subscription: { ...sub, startDate: v } })} type="date" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Factures</CardTitle>
            <Button variant="outline" size="sm" onClick={addInvoice}><Plus className="h-4 w-4" />Ajouter</Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune facture.</p>
          ) : (
            <div className="overflow-x-auto"><div className="min-w-[600px] space-y-2">
              <div className="grid grid-cols-6 gap-3 px-2 text-xs font-semibold text-muted-foreground uppercase">
                <span>Référence</span><span>Date</span><span>Description</span><span>Montant (€)</span><span>Statut</span><span></span>
              </div>
              {data.invoices.map((inv, idx) => (
                <div key={inv.id} className="grid grid-cols-6 gap-3 items-center">
                  <input value={inv.id} onChange={e => updateInvoice(idx, 'id', e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm" />
                  <input type="date" value={inv.date} onChange={e => updateInvoice(idx, 'date', e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm" />
                  <input value={inv.description} onChange={e => updateInvoice(idx, 'description', e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm" placeholder="Description" />
                  <input type="number" value={inv.amount} onChange={e => updateInvoice(idx, 'amount', Number(e.target.value))} className="h-9 rounded-md border border-input bg-background px-2 text-sm" />
                  <select value={inv.status} onChange={e => updateInvoice(idx, 'status', e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
                    <option value="payee">Payée</option>
                    <option value="en_attente">En attente</option>
                    <option value="en_retard">En retard</option>
                  </select>
                  <Button variant="ghost" size="sm" onClick={() => removeInvoice(idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              ))}
            </div></div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// --- Formules Tab ---
function FormulesTab({ data, setData }: { data: ClientData; setData: (d: ClientData) => void }) {
  const [showHelp, setShowHelp] = useState(false)
  const financialPages = (data.customPages || []).filter(p => p.type === 'financial-piloting')

  if (financialPages.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Aucune page de pilotage financier configurée.</p>
          <p className="text-sm text-muted-foreground mt-1">Ajoutez un menu sur-mesure de type &quot;Pilotage financier&quot; dans l&apos;onglet Menus.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Help toggle */}
      <div className="flex justify-end">
        <Button variant={showHelp ? 'default' : 'outline'} size="sm" onClick={() => setShowHelp(!showHelp)}>
          <HelpCircle className="h-4 w-4" />{showHelp ? 'Masquer l\'aide' : 'Comment écrire les formules ?'}
        </Button>
      </div>

      {showHelp && (
        <Card className="accent-gradient-top border-blue-200 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Guide des formules</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowHelp(false)}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">1. Manuel (pas de formule)</h4>
              <p className="text-muted-foreground">Le montant est saisi à la main. Le client peut le modifier si &quot;éditable&quot; est coché.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">2. Pourcentage du CA</h4>
              <p className="text-muted-foreground">Le montant = <code className="bg-white px-1 rounded">CA × taux</code>. Ex : taux 0.40 = 40% du CA.</p>
              <p className="text-muted-foreground">Utile pour : <strong>achat marchandise</strong> (si markup connu), commissions, redevances.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">3. Coût par commande</h4>
              <p className="text-muted-foreground">Le montant = <code className="bg-white px-1 rounded">coût unitaire × nb commandes</code>. Ex : 4.20€/commande.</p>
              <p className="text-muted-foreground">Utile pour : <strong>expédition, emballages, préparation</strong>, frais logistiques.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">4. Frais de transaction pondérés</h4>
              <p className="text-muted-foreground">Calcul automatique basé sur le mix de paiement configuré ci-dessous.</p>
              <p className="text-muted-foreground">Pour chaque moyen de paiement : <code className="bg-white px-1 rounded">(CA × part%) × commission% + (commandes × part%) × frais fixe/tx</code></p>
              <p className="text-muted-foreground">Utile pour : <strong>Shopify Payments, Klarna, PayPal, Stripe</strong>, etc.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <p className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-2">Exemple MDA — Mars 2026</p>
              <p className="text-xs text-muted-foreground">CA = 33 000€, 280 commandes</p>
              <p className="text-xs text-muted-foreground">Achat marchandise (40% CA) → <strong>13 200€</strong></p>
              <p className="text-xs text-muted-foreground">Expédition (4.20€/cmd) → <strong>1 176€</strong></p>
              <p className="text-xs text-muted-foreground">Frais tx (mix pondéré) → <strong>829€</strong></p>
            </div>
          </CardContent>
        </Card>
      )}

      {financialPages.map(page => {
        const fpData = (data.customPageData?.[page.id] || { months: [] }) as FinancialPilotingData
        return <FinancialFormulasEditor key={page.id} page={page} fpData={fpData} data={data} setData={setData} />
      })}
    </div>
  )
}

function FinancialFormulasEditor({ page, fpData, data, setData }: {
  page: CustomPage
  fpData: FinancialPilotingData
  data: ClientData
  setData: (d: ClientData) => void
}) {
  const updateFpData = (updates: Partial<FinancialPilotingData>) => {
    const newFp = { ...fpData, ...updates }
    setData({ ...data, customPageData: { ...(data.customPageData || {}), [page.id]: newFp } })
  }

  // Get all unique charges across months (by label)
  const allCharges: FinancialCharge[] = fpData.months.length > 0 ? fpData.months[0].charges : []
  const paymentMix = fpData.paymentMix || []

  const updateChargeFormula = (chargeId: string, formulaType: string, params: Record<string, number>) => {
    const newMonths = fpData.months.map(m => ({
      ...m,
      charges: m.charges.map(c => {
        if (c.id.replace(/^[a-z]+-/, '') !== chargeId.replace(/^[a-z]+-/, '')) {
          // Match by suffix (e.g. "-6" for achat marchandise across all months)
          const cSuffix = c.id.split('-').slice(1).join('-')
          const targetSuffix = chargeId.split('-').slice(1).join('-')
          if (cSuffix !== targetSuffix) return c
        }
        if (formulaType === 'manual') {
          const { formula: _, ...rest } = c
          return rest
        }
        if (formulaType === 'percentage_of_ca') {
          return { ...c, formula: { type: 'percentage_of_ca' as const, rate: params.rate ?? 0 }, dependsOn: 'ca' as const }
        }
        if (formulaType === 'per_order') {
          return { ...c, formula: { type: 'per_order' as const, unitCost: params.unitCost ?? 0 }, dependsOn: 'commandes' as const }
        }
        if (formulaType === 'blended_transaction_fees') {
          return { ...c, formula: { type: 'blended_transaction_fees' as const }, dependsOn: 'ca' as const }
        }
        return c
      })
    }))
    updateFpData({ months: newMonths })
  }

  // Payment mix editor
  const updatePaymentMix = (idx: number, field: keyof PaymentMethodConfig, value: string | number) => {
    const newMix = [...paymentMix]
    newMix[idx] = { ...newMix[idx], [field]: typeof value === 'string' && field !== 'name' ? Number(value) : value }
    updateFpData({ paymentMix: newMix })
  }
  const addPaymentMethod = () => {
    updateFpData({ paymentMix: [...paymentMix, { name: '', sharePercent: 0, feePercent: 0, fixedFeePerTx: 0 }] })
  }
  const removePaymentMethod = (idx: number) => {
    updateFpData({ paymentMix: paymentMix.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{page.label}</h3>

      {/* Charges with formulas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Charges & formules</CardTitle>
        </CardHeader>
        <CardContent>
          {allCharges.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune charge. Ajoutez des données via la page client.</p>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 px-2 text-xs font-semibold text-muted-foreground uppercase">
                <span className="col-span-3">Charge</span>
                <span className="col-span-1">Type</span>
                <span className="col-span-3">Formule</span>
                <span className="col-span-3">Paramètre</span>
                <span className="col-span-2">Aperçu</span>
              </div>
              {allCharges.map(charge => {
                const formulaType = charge.formula?.type || 'manual'
                const rate = charge.formula?.type === 'percentage_of_ca' ? charge.formula.rate : 0
                const unitCost = charge.formula?.type === 'per_order' ? charge.formula.unitCost : 0

                // Preview calculation with first month
                const m0 = fpData.months[0]
                let preview = charge.amount
                if (charge.formula?.type === 'percentage_of_ca' && m0) preview = m0.revenue * (charge.formula.rate)
                if (charge.formula?.type === 'per_order' && m0) preview = (m0.orders || 0) * charge.formula.unitCost
                if (charge.formula?.type === 'blended_transaction_fees' && m0) {
                  preview = 0
                  for (const pm of paymentMix) {
                    preview += m0.revenue * (pm.sharePercent / 100) * (pm.feePercent / 100) + (m0.orders || 0) * (pm.sharePercent / 100) * pm.fixedFeePerTx
                  }
                }

                return (
                  <div key={charge.id} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-border/50 last:border-0">
                    <span className="col-span-3 text-sm font-medium truncate">{charge.label}</span>
                    <span className="col-span-1">
                      <Badge variant={charge.category === 'fixe' ? 'outline' : 'secondary'} className="text-[10px]">
                        {charge.category === 'fixe' ? 'Fixe' : 'Var.'}
                      </Badge>
                    </span>
                    <div className="col-span-3">
                      <select
                        value={formulaType}
                        onChange={e => updateChargeFormula(charge.id, e.target.value, { rate, unitCost })}
                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="manual">Manuel</option>
                        <option value="percentage_of_ca">% du CA</option>
                        <option value="per_order">Coût/commande</option>
                        <option value="blended_transaction_fees">Frais tx pondérés</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      {formulaType === 'percentage_of_ca' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.01"
                            value={rate}
                            onChange={e => updateChargeFormula(charge.id, 'percentage_of_ca', { rate: Number(e.target.value) })}
                            className="w-20 h-8 rounded-md border border-input bg-background px-2 text-xs text-right"
                          />
                          <span className="text-xs text-muted-foreground">× CA</span>
                        </div>
                      )}
                      {formulaType === 'per_order' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.01"
                            value={unitCost}
                            onChange={e => updateChargeFormula(charge.id, 'per_order', { unitCost: Number(e.target.value) })}
                            className="w-20 h-8 rounded-md border border-input bg-background px-2 text-xs text-right"
                          />
                          <span className="text-xs text-muted-foreground">€/cmd</span>
                        </div>
                      )}
                      {formulaType === 'blended_transaction_fees' && (
                        <span className="text-[10px] text-blue-600">Voir mix ci-dessous</span>
                      )}
                      {formulaType === 'manual' && (
                        <span className="text-xs text-muted-foreground">Saisie libre</span>
                      )}
                    </div>
                    <div className="col-span-2 text-right">
                      <span className={`text-sm font-medium ${formulaType !== 'manual' ? 'text-blue-600' : 'text-foreground'}`}>
                        {Math.round(preview).toLocaleString('fr-FR')}€
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Mix editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Mix de paiement</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Répartition des moyens de paiement pour le calcul des frais de transaction pondérés.</p>
            </div>
            <Button variant="outline" size="sm" onClick={addPaymentMethod}><Plus className="h-4 w-4" />Ajouter</Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMix.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucun moyen de paiement configuré.</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 px-1 text-xs font-semibold text-muted-foreground uppercase">
                <span className="col-span-4">Moyen de paiement</span>
                <span className="col-span-2">Part du CA (%)</span>
                <span className="col-span-2">Commission (%)</span>
                <span className="col-span-2">Fixe/tx (€)</span>
                <span className="col-span-2"></span>
              </div>
              {paymentMix.map((pm, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input value={pm.name} onChange={e => updatePaymentMix(idx, 'name', e.target.value)} className="col-span-4 h-9 rounded-md border border-input bg-background px-2 text-sm" placeholder="Shopify Payments" />
                  <input type="number" step="0.1" value={pm.sharePercent} onChange={e => updatePaymentMix(idx, 'sharePercent', e.target.value)} className="col-span-2 h-9 rounded-md border border-input bg-background px-2 text-sm text-right" />
                  <input type="number" step="0.01" value={pm.feePercent} onChange={e => updatePaymentMix(idx, 'feePercent', e.target.value)} className="col-span-2 h-9 rounded-md border border-input bg-background px-2 text-sm text-right" />
                  <input type="number" step="0.01" value={pm.fixedFeePerTx} onChange={e => updatePaymentMix(idx, 'fixedFeePerTx', e.target.value)} className="col-span-2 h-9 rounded-md border border-input bg-background px-2 text-sm text-right" />
                  <div className="col-span-2 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => removePaymentMethod(idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </div>
              ))}
              {paymentMix.length > 0 && (
                <div className="flex justify-end pt-2 border-t border-border">
                  <span className={`text-xs ${Math.abs(paymentMix.reduce((s, p) => s + p.sharePercent, 0) - 100) < 0.5 ? 'text-emerald-600' : 'text-red-500'}`}>
                    Total parts : {paymentMix.reduce((s, p) => s + p.sharePercent, 0).toFixed(1)}%
                    {Math.abs(paymentMix.reduce((s, p) => s + p.sharePercent, 0) - 100) >= 0.5 && ' ⚠️ doit faire 100%'}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Markup multiplier */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coefficient de marge (markup)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Prix de vente HTVA =</span>
            <input
              type="number"
              step="0.1"
              value={fpData.markupMultiplier || 2.5}
              onChange={e => updateFpData({ markupMultiplier: Number(e.target.value) })}
              className="w-20 h-9 rounded-md border border-input bg-background px-2 text-sm text-right"
            />
            <span className="text-sm text-muted-foreground">× prix d'achat</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Avec un coefficient de {fpData.markupMultiplier || 2.5}, le coût d'achat = CA / {fpData.markupMultiplier || 2.5} = {((1 / (fpData.markupMultiplier || 2.5)) * 100).toFixed(1)}% du CA.</p>
        </CardContent>
      </Card>
    </div>
  )
}

// --- Menus Tab ---
const pageTypeLabels: Record<CustomPageType, string> = {
  'financial-piloting': 'Pilotage financier (Maîtrise des coûts)',
  'leads-crm': 'CRM Leads (Gestion de prospects)',
}
const iconOptions: CustomPage['icon'][] = ['calculator', 'euro', 'trending-up', 'pie-chart', 'bar-chart', 'clipboard', 'users']

function MenusTab({ data, setData }: { data: ClientData; setData: (d: ClientData) => void }) {
  const pages = data.customPages || []
  const visibleMenus = data.visibleMenus // undefined = all shown

  // Toggle standard menu visibility
  const toggleStandardMenu = (menuId: StandardMenuId) => {
    const current = visibleMenus || ALL_STANDARD_MENUS.map(m => m.id)
    const updated = current.includes(menuId)
      ? current.filter(id => id !== menuId)
      : [...current, menuId]
    setData({ ...data, visibleMenus: updated })
  }

  const showAllStandard = () => {
    setData({ ...data, visibleMenus: undefined })
  }

  const hideAllStandard = () => {
    setData({ ...data, visibleMenus: [] })
  }

  const addPage = () => {
    const newPage: CustomPage = {
      id: `page-${Date.now()}`,
      slug: `page-${Date.now()}`,
      label: '',
      icon: 'calculator',
      type: 'financial-piloting',
      clientEditable: false,
    }
    setData({ ...data, customPages: [...pages, newPage] })
  }

  const removePage = (idx: number) => {
    if (!confirm('Supprimer ce menu et ses données ?')) return
    const page = pages[idx]
    const newPages = pages.filter((_, i) => i !== idx)
    const newPageData = { ...(data.customPageData || {}) }
    delete newPageData[page.id]
    setData({ ...data, customPages: newPages, customPageData: newPageData })
  }

  const updatePage = (idx: number, field: keyof CustomPage, value: string | boolean) => {
    const newPages = [...pages]
    newPages[idx] = { ...newPages[idx], [field]: value } as CustomPage
    if (field === 'label' && typeof value === 'string') {
      newPages[idx].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `page-${Date.now()}`
    }
    setData({ ...data, customPages: newPages })
  }

  const activeStandard = visibleMenus || ALL_STANDARD_MENUS.map(m => m.id)

  return (
    <div className="space-y-6">
      {/* Standard menus visibility */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menus standard</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Choisissez quels menus afficher pour ce client.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={showAllStandard}>Tout afficher</Button>
              <Button variant="outline" size="sm" onClick={hideAllStandard}>Tout masquer</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ALL_STANDARD_MENUS.map(menu => {
              const active = activeStandard.includes(menu.id)
              return (
                <button
                  key={menu.id}
                  onClick={() => toggleStandardMenu(menu.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    active
                      ? 'border-[var(--sys-blue)] bg-blue-50 text-foreground'
                      : 'border-border bg-background text-muted-foreground opacity-60'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 ${
                    active ? 'border-[var(--sys-blue)] bg-[var(--sys-blue)]' : 'border-border'
                  }`}>
                    {active && <Check className="h-3 w-3 text-white" />}
                  </div>
                  {menu.label}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom menus */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menus sur-mesure</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Pages personnalisées pour ce client.</p>
            </div>
            <Button variant="outline" onClick={addPage}><Plus className="h-4 w-4" />Ajouter un menu</Button>
          </div>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucun menu sur-mesure.</p>
          ) : (
            <div className="space-y-4">
              {pages.map((page, idx) => (
                <div key={page.id} className="p-4 rounded-lg border border-border bg-background space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Menu #{idx + 1}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => removePage(idx)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-foreground block mb-1.5">Nom du menu</label>
                      <input
                        value={page.label}
                        onChange={e => updatePage(idx, 'label', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        placeholder="Maîtrise des coûts"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Type de page</label>
                      <select
                        value={page.type}
                        onChange={e => updatePage(idx, 'type', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {Object.entries(pageTypeLabels).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Icône</label>
                      <select
                        value={page.icon}
                        onChange={e => updatePage(idx, 'icon', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {iconOptions.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={page.clientEditable || false}
                        onChange={e => updatePage(idx, 'clientEditable', e.target.checked)}
                        className="w-4 h-4 rounded border-input accent-[var(--sys-blue)]"
                      />
                      <span className="text-sm text-foreground">Le client peut modifier les données</span>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">URL : /client/{data.slug}/custom/{page.slug}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
