import { BarChart3, House, LogOut, UserRound } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthActions, useAuthSession } from '../hooks/useAuth'

const baseLink =
  'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition hover:border-white/20 hover:bg-white/5'

export const Topbar = () => {
  const { user } = useAuthSession()
  const { logout } = useAuthActions()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/50 px-4 py-3 backdrop-blur md:px-5">
      <div className="flex items-center gap-2">
        <img
          src="/logo.avif"
          alt="LDP"
          className="h-7 w-auto rounded-md border border-white/10 bg-white/5 p-1 md:hidden"
        />
        <span className="text-sm text-white/90">Panel Scout</span>
        {user ? (
          <span className="hidden items-center gap-2 text-sm text-white/50 md:inline-flex">
            <UserRound size={14} />
            {user.name}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <NavLink
          className={({ isActive }) =>
            `${baseLink} ${isActive ? 'border-[#00E094]/30 bg-[#00E094]/15 text-white' : 'border-white/10 text-white/80'}`
          }
          to="/"
          end
        >
          <House size={16} />
          Inicio
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `${baseLink} ${isActive ? 'border-[#00E094]/30 bg-[#00E094]/15 text-white' : 'border-white/10 text-white/80'}`
          }
          to="/compare"
        >
          <BarChart3 size={16} />
          Detalles
        </NavLink>
        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/auth', { replace: true })
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/5"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
