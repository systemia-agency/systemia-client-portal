import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useClientData } from '@/hooks/useClientData'
import { CheckCircle, Layout, Target, Search, BarChart3, Unlock } from 'lucide-react'

const iconMap: Record<string, typeof Layout> = { layout: Layout, target: Target, search: Search, 'bar-chart': BarChart3 }

export function Services() {
  const { clientData } = useClientData()
  if (!clientData) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Services & optimisations</h1>
        <p className="text-muted-foreground text-sm mt-1">Vos services actifs et les optimisations disponibles.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Services actifs</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clientData.activeServices.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-foreground">{service.name}</span>
                </div>
                <Badge variant="success">Actif</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Optimisations disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientData.optimizations.map((opt) => {
            const Icon = iconMap[opt.icon] || BarChart3
            return (
              <Card key={opt.id} className="accent-gradient-top">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-violet-50"><Icon className="h-6 w-6 text-[var(--sys-violet)]" /></div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{opt.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                      <Button variant="gradient" size="sm" className="mt-4"><Unlock className="h-3.5 w-3.5" />Débloquer cette optimisation</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
