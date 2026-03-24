import { useState } from 'react'
import { Outlet, useParams, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { DataProvider } from '@/context/DataContext'
import { getClientBySlug } from '@/store/clientStore'
import { Menu } from 'lucide-react'

export function ClientLayout() {
  const { slug } = useParams<{ slug: string }>()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!slug || !getClientBySlug(slug)) {
    return <Navigate to="/login" replace />
  }

  return (
    <DataProvider slug={slug}>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-20 h-14 flex items-center px-4 gap-3 bg-card border-b border-border">
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
