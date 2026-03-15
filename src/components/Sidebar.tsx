import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  MessageSquare,
  Sparkles,
  Receipt,
  BookOpen,
  Bot,
  LogOut,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Accueil', icon: LayoutDashboard },
  { to: '/resultats', label: 'Résultats marketing', icon: BarChart3 },
  { to: '/projets', label: 'Projets en cours', icon: FolderKanban },
  { to: '/demandes', label: 'Demandes & support', icon: MessageSquare },
  { to: '/services', label: 'Services & optimisations', icon: Sparkles },
  { to: '/facturation', label: 'Facturation', icon: Receipt },
  { to: '/ressources', label: 'Ressources', icon: BookOpen },
  { to: '/assistant', label: 'Assistant IA', icon: Bot },
]

export function Sidebar() {
  return (
    <aside className="dark w-64 border-r border-border bg-card flex flex-col shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border gap-3">
        <div className="w-9 h-9 rounded-lg btn-gradient flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Systemia</p>
          <p className="text-[11px] text-muted-foreground">Portail Client</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
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
      </nav>

      {/* User */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Mon Entreprise</p>
            <p className="text-[11px] text-muted-foreground truncate">client@exemple.com</p>
          </div>
          <button className="p-1.5 rounded-md hover:bg-secondary/50 transition-colors">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  )
}
