import { useParams, Navigate } from 'react-router-dom'
import { useClientData } from '@/hooks/useClientData'
import { FinancialPiloting } from './FinancialPiloting'
import { LeadsCrm } from './LeadsCrm'

export function CustomPageRouter() {
  const { pageSlug } = useParams<{ pageSlug: string }>()
  const { clientData } = useClientData()

  if (!clientData || !pageSlug) return <Navigate to=".." replace />

  const page = clientData.customPages?.find(p => p.slug === pageSlug)
  if (!page) return <Navigate to=".." replace />

  switch (page.type) {
    case 'financial-piloting':
      return <FinancialPiloting pageId={page.id} />
    case 'leads-crm':
      return <LeadsCrm pageId={page.id} />
    default:
      return <p className="text-muted-foreground">Type de page inconnu.</p>
  }
}
