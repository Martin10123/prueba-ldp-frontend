import { BarChart3, House } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export const Sidebar = () => {
  return (
    <aside
      className="sticky top-0 hidden min-h-screen w-18 shrink-0 border-r border-white/10 bg-black/30 px-2 py-3 md:block"
      aria-label="Navegación lateral"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="mb-4 grid h-10 w-10 place-items-center">
          <img src="/logo.avif" alt="" />
        </div>
      </div>
      <nav className="flex flex-col items-center gap-2">
        <NavLink
          to="/players"
          className={({ isActive }) =>
            `grid h-10 w-10 place-items-center rounded-xl border transition ${
              isActive
                ? 'border-[#00E094]/30 bg-[#00E094]/20 text-[#00E094]'
                : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
            }`
          }
          aria-label="Jugadores"
        >
          <House size={18} />
        </NavLink>
        <NavLink
          to="/compare"
          className={({ isActive }) =>
            `grid h-10 w-10 place-items-center rounded-xl border transition ${
              isActive
                ? 'border-[#00E094]/30 bg-[#00E094]/20 text-[#00E094]'
                : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white'
            }`
          }
          aria-label="Detalles"
        >
          <BarChart3 size={18} />
        </NavLink>
      </nav>
    </aside>
  )
}
