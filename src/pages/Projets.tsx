import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useClientData } from '@/hooks/useClientData'
import { FolderKanban } from 'lucide-react'

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'secondary' }> = {
  en_cours: { label: 'En cours', variant: 'success' },
  termine: { label: 'Terminé', variant: 'secondary' },
  en_attente: { label: 'En attente client', variant: 'warning' },
}

export function Projets() {
  const { clientData } = useClientData()
  if (!clientData) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Projets en cours</h1>
        <p className="text-muted-foreground text-sm mt-1">Suivez l'avancement de vos projets.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clientData.projects.map((project) => {
          const config = statusConfig[project.status]
          return (
            <Card key={project.id} className="accent-gradient-top">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <FolderKanban className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{project.description}</p>
                    </div>
                  </div>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Progression</span>
                    <span className="text-xs font-semibold text-foreground">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-[var(--sys-blue)] to-[var(--sys-violet)] transition-all duration-500" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
