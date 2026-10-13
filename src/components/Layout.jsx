import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Navbar />

      {/* Reserva el espacio ocupado por el navbar fijo. */}
      <div className="h-[65px] shrink-0" aria-hidden="true" />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout
