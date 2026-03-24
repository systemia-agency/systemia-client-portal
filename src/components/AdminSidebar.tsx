import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, MessageSquare, BookOpen, LogOut, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/clients', label: 'Clients', icon: Users },
  { to: '/admin/demandes', label: 'Demandes SAV', icon: MessageSquare },
  { to: '/admin/ressources', label: 'Ressources', icon: BookOpen },
]

export function AdminSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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
          <p className="text-[11px] text-muted-foreground">Administration</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
          Gestion
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <Shield className="h-4 w-4 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Admin</p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 rounded-md hover:bg-secondary/50 transition-colors">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  )
}
