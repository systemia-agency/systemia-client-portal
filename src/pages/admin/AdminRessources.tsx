import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getAllResources, addResource, deleteResource } from '@/store/resourceStore'
import type { Resource } from '@/types'
import { BookOpen, Plus, Trash2, X } from 'lucide-react'

export function AdminRessources() {
  const [resources, setResources] = useState<Resource[]>(getAllResources)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', category: '', type: 'PDF' })

  const refresh = () => setResources(getAllResources())

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    addResource(formData)
    setFormData({ title: '', description: '', category: '', type: 'PDF' })
    setShowForm(false)
    refresh()
  }

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Supprimer la ressource "${title}" ?`)) return
    deleteResource(id)
    refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ressources</h1>
          <p className="text-muted-foreground text-sm mt-1">Ressources partagées avec tous les clients.</p>
        </div>
        <Button variant="gradient" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="h-4 w-4" />Annuler</> : <><Plus className="h-4 w-4" />Nouvelle ressource</>}
        </Button>
      </div>

      {showForm && (
        <Card className="accent-gradient-top">
          <CardHeader><CardTitle>Ajouter une ressource</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Titre</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Guide SEO 2026"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Catégorie</label>
                <input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="SEO, Ads, Social..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Type de fichier</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="PDF">PDF</option>
                  <option value="Guide">Guide</option>
                  <option value="Vidéo">Vidéo</option>
                  <option value="Template">Template</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
                <input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Description courte..."
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" variant="gradient">Ajouter la ressource</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Toutes les ressources</CardTitle>
            <Badge variant="outline">{resources.length} ressources</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucune ressource. Ajoutez-en une pour commencer.</p>
          ) : (
            <div className="space-y-2">
              {resources.map(res => (
                <div key={res.id} className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:shadow-sm transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">{res.title}</h3>
                      <Badge variant="outline">{res.category}</Badge>
                      <Badge variant="secondary">{res.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{res.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(res.id, res.title)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
