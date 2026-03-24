import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useClientData } from '@/hooks/useClientData'
import type { LeadsCrmData, Lead, LeadStatus, LeadSource } from '@/types'
import { Users, Plus, Trash2, X, Search, Phone, Mail, Building2, Euro, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  pageId: string
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; variant: 'secondary' | 'warning' | 'default' | 'success' | 'destructive' | 'outline' }> = {
  nouveau: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700 border-blue-300', variant: 'default' },
  contacte: { label: 'Contacté', color: 'bg-amber-100 text-amber-700 border-amber-300', variant: 'warning' },
  qualifie: { label: 'Qualifié', color: 'bg-violet-100 text-violet-700 border-violet-300', variant: 'secondary' },
  proposition: { label: 'Proposition', color: 'bg-cyan-100 text-cyan-700 border-cyan-300', variant: 'outline' },
  gagne: { label: 'Gagné', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', variant: 'success' },
  perdu: { label: 'Perdu', color: 'bg-red-100 text-red-700 border-red-300', variant: 'destructive' },
}

const STATUSES: LeadStatus[] = ['nouveau', 'contacte', 'qualifie', 'proposition', 'gagne', 'perdu']
const SOURCES: LeadSource[] = ['Meta Ads', 'Google Ads', 'Site web', 'Recommandation', 'Autre']

const fmt = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

export function LeadsCrm({ pageId }: Props) {
  const { clientData, updateCustomPageData } = useClientData()
  const rawData = clientData?.customPageData?.[pageId] as LeadsCrmData | undefined
  const [data, setData] = useState<LeadsCrmData>(rawData || { leads: [] })
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [expandedLead, setExpandedLead] = useState<string | null>(null)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  const save = (updated: LeadsCrmData) => {
    setData(updated)
    updateCustomPageData(pageId, updated)
  }

  const [newLead, setNewLead] = useState<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '', email: '', phone: '', company: '', source: 'Site web', status: 'nouveau', value: 0, notes: '',
  })

  const addLead = (e: React.FormEvent) => {
    e.preventDefault()
    const lead: Lead = {
      ...newLead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    save({ leads: [lead, ...data.leads] })
    setNewLead({ name: '', email: '', phone: '', company: '', source: 'Site web', status: 'nouveau', value: 0, notes: '' })
    setShowForm(false)
  }

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    const leads = data.leads.map(l => l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l)
    save({ leads })
  }

  const updateLead = (updated: Lead) => {
    const leads = data.leads.map(l => l.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : l)
    save({ leads })
    setEditingLead(null)
  }

  const deleteLead = (id: string) => {
    if (!confirm('Supprimer ce lead ?')) return
    save({ leads: data.leads.filter(l => l.id !== id) })
  }

  const filtered = useMemo(() => {
    return data.leads
      .filter(l => filterStatus === 'all' || l.status === filterStatus)
      .filter(l => {
        if (!search) return true
        const s = search.toLowerCase()
        return l.name.toLowerCase().includes(s) || l.email.toLowerCase().includes(s) || l.company.toLowerCase().includes(s) || l.phone.includes(s)
      })
  }, [data.leads, filterStatus, search])

  const stats = useMemo(() => {
    const total = data.leads.length
    const byStatus = STATUSES.reduce((acc, s) => ({ ...acc, [s]: data.leads.filter(l => l.status === s).length }), {} as Record<LeadStatus, number>)
    const totalValue = data.leads.filter(l => l.status === 'gagne').reduce((s, l) => s + l.value, 0)
    const pipelineValue = data.leads.filter(l => !['gagne', 'perdu'].includes(l.status)).reduce((s, l) => s + l.value, 0)
    return { total, byStatus, totalValue, pipelineValue }
  }, [data.leads])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-[var(--sys-blue)]" />
            Vos leads
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gérez et suivez vos prospects.</p>
        </div>
        <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="h-4 w-4" />Annuler</> : <><Plus className="h-4 w-4" />Nouveau lead</>}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
            className={`p-3 rounded-lg border text-center transition-all ${
              filterStatus === s ? STATUS_CONFIG[s].color + ' border-current shadow-sm' : 'bg-background border-border hover:shadow-sm'
            }`}
          >
            <p className="text-xl font-bold">{stats.byStatus[s] || 0}</p>
            <p className="text-xs">{STATUS_CONFIG[s].label}</p>
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="accent-gradient-top">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total leads</p>
            <p className="text-xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Pipeline en cours</p>
            <p className="text-xl font-bold text-foreground">{fmt(stats.pipelineValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Valeur gagnée</p>
            <p className="text-xl font-bold text-emerald-600">{fmt(stats.totalValue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* New lead form */}
      {showForm && (
        <Card className="accent-gradient-top">
          <CardHeader><CardTitle>Ajouter un lead</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={addLead} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Nom complet *</label>
                <input value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Jean Dupont" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                <input type="email" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="jean@exemple.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Téléphone</label>
                <input value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="+32 470 123 456" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Entreprise</label>
                <input value={newLead.company} onChange={e => setNewLead({ ...newLead, company: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Source</label>
                <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value as LeadSource })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Valeur estimée (€)</label>
                <input type="number" value={newLead.value} onChange={e => setNewLead({ ...newLead, value: Number(e.target.value) })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="5000" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-sm font-medium text-foreground block mb-1.5">Notes</label>
                <textarea value={newLead.notes} onChange={e => setNewLead({ ...newLead, notes: e.target.value })} rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" placeholder="Notes sur le prospect..." />
              </div>
              <div>
                <Button type="submit" variant="gradient">Ajouter le lead</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search + filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un lead..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <Badge variant="outline">{filtered.length} lead{filtered.length > 1 ? 's' : ''}</Badge>
      </div>

      {/* Leads list */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">
              {data.leads.length === 0 ? 'Aucun lead. Ajoutez votre premier prospect !' : 'Aucun résultat pour cette recherche.'}
            </p>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map(lead => (
                <div key={lead.id} className="group">
                  {/* Lead row */}
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                    onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{lead.name}</p>
                        {lead.company && <span className="text-xs text-muted-foreground hidden sm:inline">— {lead.company}</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {lead.email && <span className="hidden sm:inline">{lead.email}</span>}
                        <span>{lead.source}</span>
                        {lead.value > 0 && <span className="font-medium text-foreground">{fmt(lead.value)}</span>}
                      </div>
                    </div>
                    <select
                      value={lead.status}
                      onChange={e => { e.stopPropagation(); updateLeadStatus(lead.id, e.target.value as LeadStatus) }}
                      onClick={e => e.stopPropagation()}
                      className={`h-8 rounded-md border px-2 text-xs font-medium ${STATUS_CONFIG[lead.status].color}`}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                    </select>
                    {expandedLead === lead.id ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                  </div>

                  {/* Expanded details */}
                  {expandedLead === lead.id && (
                    <div className="px-4 pb-4 pt-0 border-t border-border bg-secondary/10">
                      {editingLead?.id === lead.id ? (
                        <EditLeadForm lead={editingLead} onSave={updateLead} onCancel={() => setEditingLead(null)} />
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="truncate">{lead.email || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{lead.phone || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{lead.company || '—'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Euro className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span>{lead.value > 0 ? fmt(lead.value) : '—'}</span>
                          </div>
                          {lead.notes && (
                            <div className="sm:col-span-2 lg:col-span-4">
                              <p className="text-sm text-muted-foreground bg-background rounded-md p-3 border border-border">{lead.notes}</p>
                            </div>
                          )}
                          <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Créé le {new Date(lead.createdAt).toLocaleDateString('fr-FR')}</span>
                            <span>•</span>
                            <span>Mis à jour le {new Date(lead.updatedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="sm:col-span-2 lg:col-span-4 flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setEditingLead(lead)}>Modifier</Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteLead(lead.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// --- Inline edit form ---
function EditLeadForm({ lead, onSave, onCancel }: { lead: Lead; onSave: (l: Lead) => void; onCancel: () => void }) {
  const [form, setForm] = useState(lead)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 py-3">
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm" placeholder="Nom" />
      <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm" placeholder="Email" />
      <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm" placeholder="Téléphone" />
      <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm" placeholder="Entreprise" />
      <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value as LeadSource })}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm">
        {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <input type="number" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm" placeholder="Valeur €" />
      <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
        className="sm:col-span-2 lg:col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" placeholder="Notes..." />
      <div className="flex gap-2">
        <Button variant="gradient" size="sm" onClick={() => onSave(form)}>Sauvegarder</Button>
        <Button variant="outline" size="sm" onClick={onCancel}>Annuler</Button>
      </div>
    </div>
  )
}
