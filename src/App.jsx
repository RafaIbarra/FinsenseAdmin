import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './pages/Login'
import Home from './pages/Home'
import ControlUsuarios from './pages/ControlUsuarios'
import DatosModelos from './pages/DatosModelos'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from '../context/AuthContext'
import Layout from './components/Layout'
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/control-usuario" element={<ControlUsuarios />} />
            <Route path="/datos-modelos" element={<DatosModelos />} />
            
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App