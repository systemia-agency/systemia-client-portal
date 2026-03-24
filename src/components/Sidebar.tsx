import { NavLink, useParams, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BarChart3, FolderKanban, MessageSquare,
  Sparkles, Receipt, BookOpen, Bot, LogOut, User,
  Calculator, Euro, TrendingUp, PieChart, Clipboard,
  type LucideIcon,
} from 'lucide-react'
import type { CustomPage } from '@/types'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useClientData } from '@/hooks/useClientData'

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { slug } = useParams<{ slug: string }>()
  const { user, logout } = useAuth()
  const { clientData } = useClientData()
  const navigate = useNavigate()

  const iconMap: Record<string, LucideIcon> = {
    calculator: Calculator, euro: Euro, 'trending-up': TrendingUp,
    'pie-chart': PieChart, 'bar-chart': BarChart3, clipboard: Clipboard,
  }

  const base = `/client/${slug}`
  const navItems = [
    { to: base, label: 'Accueil', icon: LayoutDashboard, end: true },
    { to: `${base}/resultats`, label: 'Résultats marketing', icon: BarChart3 },
    { to: `${base}/projets`, label: 'Projets en cours', icon: FolderKanban },
    { to: `${base}/demandes`, label: 'Demandes & support', icon: MessageSquare },
    { to: `${base}/services`, label: 'Services & optimisations', icon: Sparkles },
    { to: `${base}/facturation`, label: 'Facturation', icon: Receipt },
    { to: `${base}/ressources`, label: 'Ressources', icon: BookOpen },
    { to: `${base}/assistant`, label: 'Assistant IA', icon: Bot },
  ]

  const customPages: CustomPage[] = clientData?.customPages || []
  const customNavItems = customPages.map(p => ({
    to: `${base}/custom/${p.slug}`,
    label: p.label,
    icon: iconMap[p.icon] || Calculator,
  }))

  const companyName = clientData?.companyName || user?.companyName || 'Client'
  const email = user?.email || ''

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="dark w-64 border-r border-border bg-card flex flex-col shrink-0 h-screen sticky top-0">
      <div className="h-16 flex items-center px-4 border-b border-border gap-3">
        <img src="/logo-systemia.png" alt="Systemia" className="w-9 h-9 rounded-lg object-cover" />
        <div>
          <p className="text-sm font-semibold text-foreground">Systemia</p>
          <p className="text-[11px] text-muted-foreground">Portail Client</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 lg:py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-secondary text-foreground accent-gradient-left font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </div>
        {customNavItems.length > 0 && (
          <>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3 mt-6">
              Outils
            </p>
            <div className="space-y-0.5">
              {customNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 lg:py-2 rounded-md text-sm transition-colors',
                      isActive
                        ? 'bg-secondary text-foreground accent-gradient-left font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </>
        )}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{companyName}</p>
            <p className="text-[11px] text-muted-foreground truncate">{email}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-md hover:bg-secondary/50 transition-colors">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  )
}
