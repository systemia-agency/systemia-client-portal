import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { requests } from '@/data/mock'
import { Plus, MessageSquare, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'secondary' | 'default' }> = {
  en_cours: { label: 'En cours', variant: 'warning' },
  en_attente: { label: 'En attente', variant: 'secondary' },
  resolu: { label: 'Résolu', variant: 'success' },
}

const priorityConfig: Record<string, { variant: 'destructive' | 'warning' | 'secondary' }> = {
  Haute: { variant: 'destructive' },
  Moyenne: { variant: 'warning' },
  Basse: { variant: 'secondary' },
}

const requestTypes = ['Modification site', 'Nouvelle campagne', 'Support technique', 'Question'] as const

export function Demandes() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Demandes & support</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Créez et suivez vos demandes.
          </p>
        </div>
        <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Annuler' : 'Nouvelle demande'}
        </Button>
      </div>

      {/* New Request Form */}
      {showForm && (
        <Card className="accent-gradient-top">
          <CardHeader>
            <CardTitle>Nouvelle demande</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Titre</label>
                <input
                  type="text"
                  placeholder="Titre de votre demande"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Type</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {requestTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Décrivez votre demande en détail..."
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Priorité</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="Basse">Basse</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Haute">Haute</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button variant="gradient" className="w-full">
                  Envoyer la demande
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((req) => {
          const status = statusConfig[req.status]
          const priority = priorityConfig[req.priority]
          return (
            <Card key={req.id} className={cn('transition-all')}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-secondary mt-0.5">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{req.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{req.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{req.type}</Badge>
                        <Badge variant={priority.variant}>{req.priority}</Badge>
                        <span className="text-[11px] text-muted-foreground">{new Date(req.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
