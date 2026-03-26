import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/components/LoginPage'
import { ClientLayout } from '@/components/ClientLayout'
import { AdminLayout } from '@/components/AdminLayout'
import { Accueil } from '@/pages/Accueil'
import { Resultats } from '@/pages/Resultats'
import { Projets } from '@/pages/Projets'
import { Demandes } from '@/pages/Demandes'
import { Services } from '@/pages/Services'
import { Facturation } from '@/pages/Facturation'
import { Ressources } from '@/pages/Ressources'
import { Assistant } from '@/pages/Assistant'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminClients } from '@/pages/admin/AdminClients'
import { AdminClientEditor } from '@/pages/admin/AdminClientEditor'
import { AdminDemandes } from '@/pages/admin/AdminDemandes'
import { AdminRessources } from '@/pages/admin/AdminRessources'
import { CustomPageRouter } from '@/pages/custom/CustomPageRouter'
import { useClientData } from '@/hooks/useClientData'

function ClientIndex() {
  const { clientData } = useClientData()
  const visibleMenus = clientData?.visibleMenus
  // If accueil is hidden, redirect to first available page
  if (visibleMenus && !visibleMenus.includes('accueil')) {
    const customPages = clientData?.customPages || []
    if (customPages.length > 0) {
      return <Navigate to={`custom/${customPages[0].slug}`} replace />
    }
    // fallback to first visible standard menu
    const routeMap: Record<string, string> = { resultats: 'resultats', projets: 'projets', demandes: 'demandes', services: 'services', facturation: 'facturation', ressources: 'ressources', assistant: 'assistant' }
    for (const m of visibleMenus) {
      if (routeMap[m]) return <Navigate to={routeMap[m]} replace />
    }
  }
  return <Accueil />
}

function RootRedirect() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return <Navigate to={`/client/${user.slug}`} replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Client routes */}
          <Route element={<ProtectedRoute requiredRole="client" />}>
            <Route path="/client/:slug" element={<ClientLayout />}>
              <Route index element={<ClientIndex />} />
              <Route path="resultats" element={<Resultats />} />
              <Route path="projets" element={<Projets />} />
              <Route path="demandes" element={<Demandes />} />
              <Route path="services" element={<Services />} />
              <Route path="facturation" element={<Facturation />} />
              <Route path="ressources" element={<Ressources />} />
              <Route path="assistant" element={<Assistant />} />
              <Route path="custom/:pageSlug" element={<CustomPageRouter />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="clients/:slug" element={<AdminClientEditor />} />
              <Route path="demandes" element={<AdminDemandes />} />
              <Route path="ressources" element={<AdminRessources />} />
            </Route>
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
