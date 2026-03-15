import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useClientData } from '@/hooks/useClientData'
import { cn } from '@/lib/utils'

const periods = ['7 jours', '30 jours', '90 jours', 'Personnalisé'] as const

export function Resultats() {
  const [activePeriod, setActivePeriod] = useState<string>('30 jours')
  const { clientData } = useClientData()
  if (!clientData) return null

  const { trafficData } = clientData
  const tooltipStyle = { backgroundColor: 'white', border: '1px solid hsl(220 16% 90%)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,.08)', fontSize: '13px' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Résultats marketing</h1>
          <p className="text-muted-foreground text-sm mt-1">Suivez vos performances en temps réel.</p>
        </div>
        <div className="flex items-center gap-2">
          {periods.map((period) => (
            <Button key={period} variant={activePeriod === period ? 'default' : 'outline'} size="sm" onClick={() => setActivePeriod(period)} className={cn(activePeriod === period && 'shadow-sm')}>
              {period}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Trafic</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trafficData}>
                <defs><linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--sys-blue)" stopOpacity={0.15} /><stop offset="100%" stopColor="var(--sys-blue)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220 10% 42%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(220 10% 42%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="trafic" stroke="var(--sys-blue)" strokeWidth={2} fill="url(#trafficGrad)" name="Trafic" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Conversions</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220 10% 42%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(220 10% 42%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="conversions" fill="var(--sys-violet)" radius={[4, 4, 0, 0]} name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Leads</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trafficData}>
                <defs><linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--sys-green)" stopOpacity={0.15} /><stop offset="100%" stopColor="var(--sys-green)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220 10% 42%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(220 10% 42%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="leads" stroke="var(--sys-green)" strokeWidth={2} fill="url(#leadsGrad)" name="Leads" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Coût par lead</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 16% 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220 10% 42%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(220 10% 42%)' }} axisLine={false} tickLine={false} unit="€" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}€`, 'CPL']} />
                <Line type="monotone" dataKey="cpl" stroke="var(--sys-violet)" strokeWidth={2} dot={{ fill: 'var(--sys-violet)', r: 4 }} name="CPL" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
