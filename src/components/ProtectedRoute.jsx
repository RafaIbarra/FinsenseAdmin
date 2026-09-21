import { Navigate } from 'react-router'

import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
  const { status } = useAuth()

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute