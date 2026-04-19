import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/auth'
import { Auth } from './pages/Auth'
import { AppLayout } from './components/AppLayout'
import { Home } from './pages/Home'
import { Compare } from './pages/Compare'
import { NotFound } from './pages/NotFound'

const LoadingSession = () => (
  <div className="grid min-h-screen place-items-center bg-[#0f0f0f] text-[#f2f2f2]">
    <div className="rounded-2xl border border-white/10 bg-[#171717] px-5 py-4 text-sm text-white/70">
    Cargando sesión...
    </div>
  </div>
)

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const hydrated = useAuthStore((state) => state.hydrated)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  if (!hydrated) {
    return <LoadingSession />
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/auth" />
  }

  return <>{children}</>
}

const GuestOnly = ({ children }: { children: ReactNode }) => {
  const hydrated = useAuthStore((state) => state.hydrated)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  if (!hydrated) {
    return <LoadingSession />
  }

  if (isAuthenticated) {
    return <Navigate replace to="/" />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <GuestOnly>
              <Auth />
            </GuestOnly>
          }
        />

        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Home />} />
          <Route path="compare" element={<Compare />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
