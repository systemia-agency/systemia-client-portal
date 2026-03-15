import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getAllClients, createClient, deleteClient } from '@/store/clientStore'
import type { StoredUser } from '@/types'
import { Plus, Trash2, ExternalLink, X } from 'lucide-react'

export function AdminClients() {
  const [clients, setClients] = useState<StoredUser[]>(getAllClients)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ companyName: '', email: '', password: '', slug: '' })
  const [error, setError] = useState('')

  const refreshClients = () => setClients(getAllClients())

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      createClient(formData)
      setFormData({ companyName: '', email: '', password: '', slug: '' })
      setShowForm(false)
      refreshClients()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur.')
    }
  }

  const handleDelete = (slug: string, name: string) => {
    if (!confirm(`Supprimer le client "${name}" et toutes ses données ?`)) return
    deleteClient(slug)
    refreshClients()
  }

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">Gérez les comptes clients de la plateforme.</p>
        </div>
        <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="h-4 w-4" />Annuler</> : <><Plus className="h-4 w-4" />Nouveau client</>}
        </Button>
      </div>

      {showForm && (
        <Card className="accent-gradient-top">
          <CardHeader><CardTitle>Créer un client</CardTitle></CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
            )}
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Nom de l'entreprise</label>
                <input
                  value={formData.companyName}
                  onChange={(e) => {
                    setFormData({ ...formData, companyName: e.target.value, slug: autoSlug(e.target.value) })
                  }}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Slug (URL)</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/client/</span>
                  <input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="acme-corp"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="contact@acme.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Mot de passe</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Min. 6 caractères"
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" variant="gradient">Créer le client</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tous les clients</CardTitle>
            <Badge variant="outline">{clients.length} clients</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucun client. Créez-en un pour commencer.</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Entreprise</span><span>Email</span><span>Slug</span><span>Créé le</span><span className="text-right">Actions</span>
              </div>
              {clients.map(client => (
                <div key={client.id} className="grid grid-cols-5 gap-4 items-center px-4 py-3 rounded-lg bg-background border border-border hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {client.companyName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground truncate">{client.companyName}</span>
                  </div>
                  <span className="text-sm text-muted-foreground truncate">{client.email}</span>
                  <Badge variant="outline">/{client.slug}</Badge>
                  <span className="text-sm text-muted-foreground">{new Date(client.createdAt).toLocaleDateString('fr-FR')}</span>
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/admin/clients/${client.slug}`}>
                      <Button variant="ghost" size="sm"><ExternalLink className="h-4 w-4" />Éditer</Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(client.slug, client.companyName)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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
