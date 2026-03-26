import { useState } from 'react'
import { Outlet, useParams, Navigate, Link } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { DataProvider } from '@/context/DataContext'
import { getClientBySlug } from '@/store/clientStore'
import { useAuth } from '@/hooks/useAuth'
import { Menu, ArrowLeft, Eye } from 'lucide-react'

export function ClientLayout() {
  const { slug } = useParams<{ slug: string }>()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAdmin } = useAuth()

  if (!slug || !getClientBySlug(slug)) {
    return <Navigate to="/login" replace />
  }

  const client = getClientBySlug(slug)

  return (
    <DataProvider slug={slug}>
      {/* Admin preview banner */}
      {isAdmin && (
        <div className="sticky top-0 z-30 h-10 flex items-center justify-between px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="font-medium">Mode aperçu</span>
            <span className="opacity-80">— Vous voyez l'interface de <strong>{client?.companyName}</strong></span>
          </div>
          <Link
            to={`/admin/clients/${slug}`}
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 transition-colors text-xs font-medium"
          >
            <ArrowLeft className="h-3 w-3" />Retour admin
          </Link>
        </div>
      )}

      {/* Mobile top bar */}
      <div className={`lg:hidden sticky ${isAdmin ? 'top-10' : 'top-0'} z-20 h-14 flex items-center px-4 gap-3 bg-card border-b border-border`}>
        <button onClick={() => setSidebarOpen(true)} className="p-1.5 -ml-1.5 rounded-md hover:bg-secondary/50 transition-colors">
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <img src="/logo-systemia.png" alt="Systemia" className="w-7 h-7 rounded-lg object-cover" />
        <span className="text-sm font-semibold text-foreground">Systemia</span>
      </div>

      <div className="flex min-h-screen lg:min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden animate-slide-in">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        <main className="flex-1 systemia-bg overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </DataProvider>
  )
}
