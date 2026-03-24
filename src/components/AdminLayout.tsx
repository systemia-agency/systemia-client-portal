import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { Menu } from 'lucide-react'

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-20 h-14 flex items-center px-4 gap-3 bg-card border-b border-border">
        <button onClick={() => setSidebarOpen(true)} className="p-1.5 -ml-1.5 rounded-md hover:bg-secondary/50 transition-colors">
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <img src="/logo-systemia.png" alt="Systemia" className="w-7 h-7 rounded-lg object-cover" />
        <span className="text-sm font-semibold text-foreground">Systemia</span>
      </div>

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-50 lg:hidden animate-slide-in">
              <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}

        <main className="flex-1 systemia-bg overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}
