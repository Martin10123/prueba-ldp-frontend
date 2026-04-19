import { ArrowLeftCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <section className="grid min-h-[70vh] place-items-center">
      <article className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#171717] p-8 text-center shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <p className="text-6xl font-extrabold text-[#00E094]">404</p>
        <h1 className="mt-2 text-2xl font-bold">Página no encontrada</h1>
        <p className="mt-2 text-white/65">La ruta que buscaste no existe en este Scout Panel.</p>
        <Link
          className="mt-6 inline-flex rounded-xl border border-transparent bg-[#00E094] px-4 py-2 text-sm font-bold text-black transition hover:brightness-110"
          to="/"
        >
          <ArrowLeftCircle size={16} className="mr-2" />
          Volver al inicio
        </Link>
      </article>
    </section>
  )
}
