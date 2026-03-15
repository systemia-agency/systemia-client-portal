import { Outlet, useParams, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { DataProvider } from '@/context/DataContext'
import { getClientBySlug } from '@/store/clientStore'

export function ClientLayout() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug || !getClientBySlug(slug)) {
    return <Navigate to="/login" replace />
  }

  return (
    <DataProvider slug={slug}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 systemia-bg overflow-y-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </DataProvider>
  )
}
