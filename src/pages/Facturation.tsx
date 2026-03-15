import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { invoices, subscription } from '@/data/mock'
import { Download, CreditCard, Calendar, Receipt } from 'lucide-react'

export function Facturation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Facturation</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gérez vos factures et votre abonnement.
        </p>
      </div>

      {/* Subscription Card */}
      <Card className="accent-gradient-top">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-violet-50">
                <CreditCard className="h-6 w-6 text-[var(--sys-violet)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{subscription.plan}</h3>
                <p className="text-sm text-muted-foreground">Abonnement actif</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{subscription.monthly.toLocaleString('fr-FR')}€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Prochain paiement : {new Date(subscription.nextBilling).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Historique des factures</CardTitle>
            <Badge variant="outline">{invoices.length} factures</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Référence</span>
              <span>Date</span>
              <span>Description</span>
              <span>Montant</span>
              <span className="text-right">Action</span>
            </div>
            {/* Rows */}
            {invoices.map((invoice) => (
              <div key={invoice.id} className="grid grid-cols-5 gap-4 items-center px-4 py-3 rounded-lg bg-background border border-border hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{invoice.id}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(invoice.date).toLocaleDateString('fr-FR')}
                </span>
                <span className="text-sm text-foreground">{invoice.description}</span>
                <span className="text-sm font-semibold text-foreground">{invoice.amount.toLocaleString('fr-FR')}€</span>
                <div className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
