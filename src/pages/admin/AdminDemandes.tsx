import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getAllRequests, updateRequestStatus } from '@/store/resourceStore'
import type { ClientRequest } from '@/types'
import { MessageSquare } from 'lucide-react'

export function AdminDemandes() {
  const [requests, setRequests] = useState<ClientRequest[]>(getAllRequests)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterClient, setFilterClient] = useState<string>('all')

  const refresh = () => setRequests(getAllRequests())

  const handleStatusChange = (id: string, status: ClientRequest['status']) => {
    updateRequestStatus(id, status)
    refresh()
  }

  const clientSlugs = [...new Set(requests.map(r => r.clientSlug))]
  const filtered = requests
    .filter(r => filterStatus === 'all' || r.status === filterStatus)
    .filter(r => filterClient === 'all' || r.clientSlug === filterClient)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const statusLabel: Record<string, string> = { en_cours: 'En cours', en_attente: 'En attente', resolu: 'Résolu' }
  const statusVariant: Record<string, 'warning' | 'secondary' | 'success'> = { en_cours: 'warning', en_attente: 'secondary', resolu: 'success' }
  const priorityVariant: Record<string, 'destructive' | 'warning' | 'outline'> = { Haute: 'destructive', Moyenne: 'warning', Basse: 'outline' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Demandes SAV</h1>
        <p className="text-muted-foreground text-sm mt-1">Toutes les demandes clients de la plateforme.</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="en_cours">En cours</option>
          <option value="resolu">Résolu</option>
        </select>
        <select
          value={filterClient}
          onChange={(e) => setFilterClient(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">Tous les clients</option>
          {clientSlugs.map(slug => (
            <option key={slug} value={slug}>{slug}</option>
          ))}
        </select>
        <Badge variant="outline">{filtered.length} demandes</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" />Demandes</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune demande trouvée.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map(req => (
                <div key={req.id} className="p-4 rounded-lg bg-background border border-border hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">{req.title}</h3>
                        <Badge variant={priorityVariant[req.priority]}>{req.priority}</Badge>
                        <Badge variant="outline">{req.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{req.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Client : <strong>{req.clientSlug}</strong></span>
                        <span>{new Date(req.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <Badge variant={statusVariant[req.status]}>{statusLabel[req.status]}</Badge>
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value as ClientRequest['status'])}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="en_attente">En attente</option>
                        <option value="en_cours">En cours</option>
                        <option value="resolu">Résolu</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
