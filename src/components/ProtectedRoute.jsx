import { Navigate } from 'react-router'

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated')

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute