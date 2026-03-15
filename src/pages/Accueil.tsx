import { TrendingUp, TrendingDown, Users, DollarSign, Megaphone, Target } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useClientData } from '@/hooks/useClientData'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'secondary' }> = {
  en_cours: { label: 'En cours', variant: 'success' },
  termine: { label: 'Terminé', variant: 'secondary' },
  en_attente: { label: 'En attente client', variant: 'warning' },
}

export function Accueil() {
  const { clientData } = useClientData()
  if (!clientData) return null

  const { kpiData, leadsOverTime, projects } = clientData

  const kpis = [
    { label: 'Leads générés ce mois', value: kpiData.leadsThisMonth, trend: kpiData.leadsTrend, icon: Users, color: 'text-[var(--sys-blue)]', bg: 'bg-blue-50' },
    { label: 'Coût par lead', value: `${kpiData.costPerLead.toFixed(2)}€`, trend: kpiData.cplTrend, icon: Target, color: 'text-[var(--sys-violet)]', bg: 'bg-violet-50' },
    { label: 'Budget dépensé', value: `${kpiData.adSpend.toLocaleString('fr-FR')}€`, trend: kpiData.adSpendTrend, icon: DollarSign, color: 'text-[var(--sys-green)]', bg: 'bg-emerald-50' },
    { label: 'Campagnes actives', value: kpiData.activeCampaigns, trend: kpiData.campaignsTrend, icon: Megaphone, color: 'text-amber-500', bg: 'bg-amber-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bonjour, {clientData.companyName}</h1>
        <p className="text-muted-foreground text-sm mt-1">Voici un aperçu de vos performances marketing.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const isPositive = kpi.trend.startsWith('+')
          const isNeutral = kpi.trend === '0%'
          return (
            <Card key={kpi.label} className="accent-gradient-top">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('p-2 rounded-lg', kpi.bg)}>
                    <kpi.icon className={cn('h-5 w-5', kpi.color)} />
                  </div>
                  {!isNeutral && (
                    <span className={cn('flex items-center gap-1 text-xs font-medium', isPositive ? 'text-emerald-600' : 'text-red-500')}>
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {kpi.trend}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Évolution des leads</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={leadsOverTime}>
                <defs>
                  <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--sys-blue)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--sys-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220 10% 42%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(220 10% 42%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid hsl(220 16% 90%)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,.08)', fontSize: '13px' }} />
                <Area type="monotone" dataKey="leads" stroke="var(--sys-blue)" strokeWidth={2} fill="url(#leadGradient)" name="Leads" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Projets en cours</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => {
                const config = statusConfig[project.status]
                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{project.name}</p>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-[var(--sys-blue)] to-[var(--sys-violet)]" style={{ width: `${project.progress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">{project.progress}%</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
