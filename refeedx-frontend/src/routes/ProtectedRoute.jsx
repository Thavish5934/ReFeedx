import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingState from '../components/common/LoadingState'

/**
 * Wraps a route element. With no `allowedRoles`, just requires login.
 * With `allowedRoles`, also requires the user's role to be in that list -
 * a REQUESTER hitting a DONOR-only page gets bounced home rather than
 * seeing a broken dashboard.
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <LoadingState label="Checking your session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}
