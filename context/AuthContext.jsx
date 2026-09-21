import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import request from '../Api/request'
import { onSessionExpired } from '../Api/authEvents'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // 'loading' | 'authenticated' | 'unauthenticated'
  const [dataUser, setDataUser] = useState(null)

  // Al cargar la app: pregunta al backend si la cookie sigue siendo válida
  const checkSession = useCallback(async () => {
    const response = await request({ endpoint: 'sessions/control-sesion', notifyOnSessionExpired: false })

    if (response.isSuccessful) {
      const { UserName, nombre, apellido, fecha_registro } = response.data

      setDataUser({ UserName, nombre, apellido, fecha_registro })
      setStatus('authenticated')
    } else {
      setDataUser(null)
      setStatus('unauthenticated')
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  // Escucha cualquier 401/403 que ocurra en cualquier request de la app
  useEffect(() => {
    const unsubscribe = onSessionExpired(() => {
      setDataUser(null)
      setStatus('unauthenticated')
      navigate('/login', {
        replace: true,
        state: { message: 'Tu sesión expiró. Por favor, inicia sesión nuevamente.' },
      })
    })

    return unsubscribe
  }, [navigate])

  const login = (userData) => {
    setDataUser(userData)
    setStatus('authenticated')
  }

  const logout = async () => {
    await request({ endpoint: 'sessions/logout', method: 'POST', notifyOnSessionExpired: false })
    setDataUser(null)
    setStatus('unauthenticated')
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ status, dataUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}