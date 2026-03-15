import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types'

interface Props {
  requiredRole: UserRole
}

export function ProtectedRoute({ requiredRole }: Props) {
  const { user, isAuthenticated } = useAuth()
  const { slug } = useParams()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to={`/client/${user.slug}`} replace />
  }

  if (requiredRole === 'client') {
    // Admin can access any client view
    if (user.role === 'client' && slug && user.slug !== slug) {
      return <Navigate to={`/client/${user.slug}`} replace />
    }
  }

  return <Outlet />
}
