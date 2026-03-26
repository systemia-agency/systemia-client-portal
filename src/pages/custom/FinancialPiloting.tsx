import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useClientData } from '@/hooks/useClientData'
import type { FinancialPilotingData, FinancialMonth, FinancialCharge, ChargeDependsOn } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { Euro, TrendingUp, TrendingDown, Plus, Trash2, Calculator, ShoppingCart, Package } from 'lucide-react'
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line, ComposedChart } from 'recharts'

interface Props {
  pageId: string
}

const dependsOnLabels: Record<ChargeDependsOn, string> = {
  fixe: 'Montant fixe',
  ca: 'Varie selon le CA',
  commandes: 'Varie selon les commandes',
}

export function FinancialPiloting({ pageId }: Props) {
  const { clientData, updateCustomPageData } = useClientData()
  const { isAdmin } = useAuth()
  const rawData = clientData?.customPageData?.[pageId] as FinancialPilotingData | undefined
  const [data, setData] = useState<FinancialPilotingData>(rawData || { months: [] })
  const [selectedMonth, setSelectedMonth] = useState<number>(0)

  // Check if client can edit
  const page = clientData?.customPages?.find(p => p.id === pageId)
  const canEdit = isAdmin || (page?.clientEditable ?? false)

  const save = (updated: FinancialPilotingData) => {
    setData(updated)
    updateCustomPageData(pageId, updated)
  }

  const addMonth = () => {
    const newMonth: FinancialMonth = {
      month: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
      revenue: 0,
      orders: 0,
      charges: [],
    }
    const updated = { ...data, months: [...data.months, newMonth] }
    save(updated)
    setSelectedMonth(updated.months.length - 1)
  }

  const updateMonth = (idx: number, field: keyof FinancialMonth, value: string | number) => {
    const months = [...data.months]
    months[idx] = { ...months[idx], [field]: value }
    save({ ...data, months })
  }

  const addCharge = (monthIdx: number, category: 'fixe' | 'variable') => {
    const months = [...data.months]
    const charge: FinancialCharge = {
      id: `ch-${Date.now()}`,
      label: '',
      amount: 0,
      category,
      dependsOn: category === 'fixe' ? 'fixe' : 'ca',
    }
    months[monthIdx] = { ...months[monthIdx], charges: [...months[monthIdx].charges, charge] }
    save({ ...data, months })
  }

  const updateCharge = (monthIdx: number, chargeIdx: number, field: keyof FinancialCharge, value: string | number) => {
    const months = [...data.months]
    const charges = [...months[monthIdx].charges]
    charges[chargeIdx] = { ...charges[chargeIdx], [field]: value }
    months[monthIdx] = { ...months[monthIdx], charges }
    save({ ...data, months })
  }

  const removeCharge = (monthIdx: number, chargeIdx: number) => {
    const months = [...data.months]
    months[monthIdx] = { ...months[monthIdx], charges: months[monthIdx].charges.filter((_, i) => i !== chargeIdx) }
    save({ ...data, months })
  }

  const removeMonth = (idx: number) => {
    if (!confirm('Supprimer ce mois ?')) return
    const months = data.months.filter((_, i) => i !== idx)
    save({ ...data, months })
    if (selectedMonth >= months.length) setSelectedMonth(Math.max(0, months.length - 1))
  }

  const current = data.months[selectedMonth]

  const totals = useMemo(() => {
    if (!current) return { fixe: 0, variable: 0, total: 0, margin: 0, marginPct: 0 }
    const fixe = current.charges.filter(c => c.category === 'fixe').reduce((s, c) => s + c.amount, 0)
    const variable = current.charges.filter(c => c.category === 'variable').reduce((s, c) => s + c.amount, 0)
    const total = fixe + variable
    const margin = current.revenue - total
    const marginPct = current.revenue > 0 ? (margin / current.revenue) * 100 : 0
    return { fixe, variable, total, margin, marginPct }
  }, [current])

  const chartData = useMemo(() => {
    return data.months.map(m => {
      const totalCharges = m.charges.reduce((s, c) => s + c.amount, 0)
      return {
        month: m.month,
        'Chiffre d\'affaires': m.revenue,
        'Charges': totalCharges,
        'Marge': m.revenue - totalCharges,
      }
    })
  }, [data.months])

  const fmt = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-6 w-6 text-[var(--sys-blue)]" />
            Maîtrise des coûts
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Pilotage financier mois par mois.</p>
        </div>
        {canEdit && (
          <Button variant="gradient" onClick={addMonth}><Plus className="h-4 w-4" />Ajouter un mois</Button>
        )}
      </div>

      {data.months.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Aucune donnée financière. {canEdit ? 'Ajoutez un mois pour commencer.' : ''}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Month selector */}
          <div className="flex gap-2 flex-wrap">
            {data.months.map((m, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMonth(idx)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  selectedMonth === idx
                    ? 'bg-[var(--sys-blue)] text-white border-[var(--sys-blue)]'
                    : 'bg-background border-border text-foreground hover:bg-secondary'
                }`}
              >
                {m.month}
              </button>
            ))}
          </div>

          {current && (
            <>
              {/* KPI Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                <Card className="accent-gradient-top">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Chiffre d'affaires</p>
                    <p className="text-lg font-bold text-foreground">{fmt(current.revenue)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Commandes</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">{current.orders ?? 0}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Charges fixes</p>
                    <p className="text-lg font-bold text-foreground">{fmt(totals.fixe)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Charges variables</p>
                    <p className="text-lg font-bold text-foreground">{fmt(totals.variable)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total charges</p>
                    <p className="text-lg font-bold text-red-600">{fmt(totals.total)}</p>
                  </CardContent>
                </Card>
                <Card className={totals.margin >= 0 ? 'accent-gradient-top' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      <p className="text-xs text-muted-foreground">Marge</p>
                      {totals.margin >= 0 ? <TrendingUp className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
                    </div>
                    <p className={`text-lg font-bold ${totals.margin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {fmt(totals.margin)}
                    </p>
                    <p className={`text-xs ${totals.marginPct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {totals.marginPct.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Month details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2"><Euro className="h-5 w-5" />{current.month}</CardTitle>
                      {canEdit && (
                        <Button variant="ghost" size="sm" onClick={() => removeMonth(selectedMonth)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Intitulé du mois</label>
                      <input
                        value={current.month}
                        onChange={e => updateMonth(selectedMonth, 'month', e.target.value)}
                        disabled={!canEdit}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-60"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Chiffre d'affaires (€)</label>
                        <input
                          type="number"
                          value={current.revenue}
                          onChange={e => updateMonth(selectedMonth, 'revenue', Number(e.target.value))}
                          disabled={!canEdit}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-1.5">
                          <Package className="h-3.5 w-3.5" /> Nombre de commandes
                        </label>
                        <input
                          type="number"
                          value={current.orders ?? 0}
                          onChange={e => updateMonth(selectedMonth, 'orders', Number(e.target.value))}
                          disabled={!canEdit}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Visual gauge */}
                <Card>
                  <CardHeader><CardTitle>Répartition</CardTitle></CardHeader>
                  <CardContent>
                    {current.revenue > 0 ? (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Charges fixes</span>
                            <span className="font-medium">{fmt(totals.fixe)} ({((totals.fixe / current.revenue) * 100).toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-3">
                            <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${Math.min((totals.fixe / current.revenue) * 100, 100)}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Charges variables</span>
                            <span className="font-medium">{fmt(totals.variable)} ({((totals.variable / current.revenue) * 100).toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-3">
                            <div className="bg-amber-500 h-3 rounded-full transition-all" style={{ width: `${Math.min((totals.variable / current.revenue) * 100, 100)}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Marge</span>
                            <span className={`font-medium ${totals.margin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmt(totals.margin)} ({totals.marginPct.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-3">
                            <div className={`h-3 rounded-full transition-all ${totals.margin >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(Math.abs(totals.marginPct), 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">Saisissez un CA pour voir la répartition.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Charges tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fixed charges */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Charges fixes</CardTitle>
                      {canEdit && (
                        <Button variant="outline" size="sm" onClick={() => addCharge(selectedMonth, 'fixe')}>
                          <Plus className="h-4 w-4" />Ajouter
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {current.charges.filter(c => c.category === 'fixe').length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Aucune charge fixe.</p>
                    ) : (
                      <div className="space-y-2">
                        {current.charges.map((charge, idx) => charge.category === 'fixe' && (
                          <div key={charge.id} className="flex items-center gap-2">
                            <input
                              value={charge.label}
                              onChange={e => updateCharge(selectedMonth, idx, 'label', e.target.value)}
                              disabled={!canEdit}
                              className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-60"
                              placeholder="Libellé"
                            />
                            <div className="relative">
                              <input
                                type="number"
                                value={charge.amount}
                                onChange={e => updateCharge(selectedMonth, idx, 'amount', Number(e.target.value))}
                                disabled={!canEdit}
                                className="w-28 h-9 rounded-md border border-input bg-background px-3 pr-7 text-sm text-right disabled:opacity-60"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                            </div>
                            {canEdit && (
                              <Button variant="ghost" size="sm" onClick={() => removeCharge(selectedMonth, idx)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <div className="flex justify-end pt-2 border-t border-border">
                          <span className="text-sm font-semibold">{fmt(totals.fixe)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Variable charges */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Charges variables</CardTitle>
                      {canEdit && (
                        <Button variant="outline" size="sm" onClick={() => addCharge(selectedMonth, 'variable')}>
                          <Plus className="h-4 w-4" />Ajouter
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {current.charges.filter(c => c.category === 'variable').length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Aucune charge variable.</p>
                    ) : (
                      <div className="space-y-2">
                        {current.charges.map((charge, idx) => charge.category === 'variable' && (
                          <div key={charge.id} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <input
                                value={charge.label}
                                onChange={e => updateCharge(selectedMonth, idx, 'label', e.target.value)}
                                disabled={!canEdit}
                                className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm disabled:opacity-60"
                                placeholder="Libellé"
                              />
                              <div className="relative">
                                <input
                                  type="number"
                                  value={charge.amount}
                                  onChange={e => updateCharge(selectedMonth, idx, 'amount', Number(e.target.value))}
                                  disabled={!canEdit}
                                  className="w-28 h-9 rounded-md border border-input bg-background px-3 pr-7 text-sm text-right disabled:opacity-60"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                              </div>
                              <select
                                value={charge.dependsOn || 'ca'}
                                onChange={e => updateCharge(selectedMonth, idx, 'dependsOn', e.target.value)}
                                disabled={!canEdit}
                                className="h-9 rounded-md border border-input bg-background px-2 text-xs disabled:opacity-60 w-auto"
                              >
                                <option value="ca">Selon CA</option>
                                <option value="commandes">Selon commandes</option>
                              </select>
                              {canEdit && (
                                <Button variant="ghost" size="sm" onClick={() => removeCharge(selectedMonth, idx)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground pl-1">
                              {dependsOnLabels[charge.dependsOn || 'ca']}
                            </p>
                          </div>
                        ))}
                        <div className="flex justify-end pt-2 border-t border-border">
                          <span className="text-sm font-semibold">{fmt(totals.variable)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Evolution chart */}
              {data.months.length > 1 && (
                <Card>
                  <CardHeader><CardTitle>Évolution mensuelle</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                          <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                          <Tooltip formatter={(value) => [fmt(Number(value))]} />
                          <Legend />
                          <Bar dataKey="Chiffre d'affaires" fill="var(--sys-blue)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Charges" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          <Line type="monotone" dataKey="Marge" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
