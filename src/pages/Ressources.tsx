import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useClientData } from '@/hooks/useClientData'
import { FileText, Download } from 'lucide-react'

export function Ressources() {
  const { resources } = useClientData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ressources</h1>
        <p className="text-muted-foreground text-sm mt-1">Guides et ressources pour comprendre et optimiser vos performances.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => (
          <Card key={resource.id} className="accent-gradient-top">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-violet-50"><FileText className="h-6 w-6 text-[var(--sys-blue)]" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{resource.title}</h3>
                    <Badge variant="outline">{resource.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                  <Button variant="outline" size="sm" className="mt-3"><Download className="h-3.5 w-3.5" />Télécharger le {resource.type}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
