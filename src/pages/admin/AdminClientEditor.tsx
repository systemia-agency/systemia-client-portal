import { useState, useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getClientBySlug, getClientData, updateClientData } from '@/store/clientStore'
import type { ClientData, Project, Invoice, ActiveService, Optimization, TrafficDataEntry, CustomPage, CustomPageType } from '@/types'
import { ArrowLeft, Save, Plus, Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = ['KPIs', 'Analytics', 'Projets', 'Services', 'Facturation', 'Menus'] as const
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
          <Link to={`/client/${slug}`} target="_blank">
            <Button variant="outline" size="sm">Prévisualiser</Button>
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

// --- Menus Tab ---
const pageTypeLabels: Record<CustomPageType, string> = {
  'financial-piloting': 'Pilotage financier (Maîtrise des coûts)',
  'leads-crm': 'CRM Leads (Gestion de prospects)',
}
const iconOptions: CustomPage['icon'][] = ['calculator', 'euro', 'trending-up', 'pie-chart', 'bar-chart', 'clipboard', 'users']

function MenusTab({ data, setData }: { data: ClientData; setData: (d: ClientData) => void }) {
  const pages = data.customPages || []

  const addPage = () => {
    const newPage: CustomPage = {
      id: `page-${Date.now()}`,
      slug: `page-${Date.now()}`,
      label: '',
      icon: 'calculator',
      type: 'financial-piloting',
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

  const updatePage = (idx: number, field: keyof CustomPage, value: string) => {
    const newPages = [...pages]
    newPages[idx] = { ...newPages[idx], [field]: value }
    // Auto-generate slug from label
    if (field === 'label') {
      newPages[idx].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `page-${Date.now()}`
    }
    setData({ ...data, customPages: newPages })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Menus sur-mesure</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Ajoutez des pages personnalisées à la navigation du client.</p>
          </div>
          <Button variant="outline" onClick={addPage}><Plus className="h-4 w-4" />Ajouter un menu</Button>
        </div>
      </CardHeader>
      <CardContent>
        {pages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Aucun menu sur-mesure. Ce client n'a que les pages standard.</p>
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
                <p className="text-xs text-muted-foreground">URL : /client/{data.slug}/custom/{page.slug}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
