import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getAllClients } from '@/store/clientStore'
import { getAllRequests, getAllResources } from '@/store/resourceStore'
import { Users, MessageSquare, BookOpen, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AdminDashboard() {
  const clients = getAllClients()
  const requests = getAllRequests()
  const resources = getAllResources()
  const activeRequests = requests.filter(r => r.status !== 'resolu')
  const recentRequests = [...requests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  const statusLabel: Record<string, string> = { en_cours: 'En cours', en_attente: 'En attente', resolu: 'Résolu' }
  const statusVariant: Record<string, 'warning' | 'secondary' | 'success'> = { en_cours: 'warning', en_attente: 'secondary', resolu: 'success' }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="accent-gradient-top">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-violet-50">
                <Users className="h-6 w-6 text-[var(--sys-blue)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                <p className="text-sm text-muted-foreground">Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="accent-gradient-top">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50">
                <MessageSquare className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{activeRequests.length}</p>
                <p className="text-sm text-muted-foreground">Demandes actives</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="accent-gradient-top">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{requests.length}</p>
                <p className="text-sm text-muted-foreground">Total demandes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="accent-gradient-top">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50">
                <BookOpen className="h-6 w-6 text-[var(--sys-violet)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{resources.length}</p>
                <p className="text-sm text-muted-foreground">Ressources</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Dernières demandes</CardTitle>
              <Link to="/admin/demandes" className="text-sm text-[var(--sys-blue)] hover:underline">Voir tout</Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune demande.</p>
            ) : (
              <div className="space-y-2">
                {recentRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{req.title}</p>
                      <p className="text-xs text-muted-foreground">{req.clientSlug} — {new Date(req.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <Badge variant={statusVariant[req.status]}>{statusLabel[req.status]}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Clients</CardTitle>
              <Link to="/admin/clients" className="text-sm text-[var(--sys-blue)] hover:underline">Gérer</Link>
            </div>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun client.</p>
            ) : (
              <div className="space-y-2">
                {clients.map(client => (
                  <Link
                    key={client.id}
                    to={`/admin/clients/${client.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                        {client.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{client.companyName}</p>
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline">/{client.slug}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
