import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FilterX, Loader2, Search, UserRound } from 'lucide-react'
import { useAuthSession } from '../hooks/useAuth'
import { getPlayers } from '../services/players'
import type { ApiPlayerPosition, PlayerListItem, PlayersQueryFilters } from '../types/player'

const panelClass = 'min-w-0 rounded-2xl border border-white/10 bg-[#171717] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)]'

const POSITION_OPTIONS: Array<{ value: ApiPlayerPosition; label: string }> = [
  { value: 'GK', label: 'GK - Arquero' },
  { value: 'CB', label: 'CB - Central' },
  { value: 'RB', label: 'RB - Lateral derecho' },
  { value: 'LB', label: 'LB - Lateral izquierdo' },
  { value: 'CDM', label: 'CDM - Mediocentro defensivo' },
  { value: 'CM', label: 'CM - Mediocentro' },
  { value: 'CAM', label: 'CAM - Mediocentro ofensivo' },
  { value: 'RW', label: 'RW - Extremo derecho' },
  { value: 'LW', label: 'LW - Extremo izquierdo' },
  { value: 'ST', label: 'ST - Delantero' },
]

const POSITION_LABEL_BY_CODE: Record<ApiPlayerPosition, string> = {
  GK: 'Arquero',
  CB: 'Defensor central',
  RB: 'Lateral derecho',
  LB: 'Lateral izquierdo',
  CDM: 'Mediocentro defensivo',
  CM: 'Mediocentro',
  CAM: 'Mediocentro ofensivo',
  RW: 'Extremo derecho',
  LW: 'Extremo izquierdo',
  ST: 'Delantero',
}

const LIMIT_OPTIONS = [10, 20, 50] as const

const getAge = (birthDate: string) => {
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return null

  const ageDate = new Date(Date.now() - birth.getTime())
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))

const parseNumberInput = (value: string) => {
  if (value.trim() === '') return undefined

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const PlayerCard = ({ player }: { player: PlayerListItem }) => {
  const age = getAge(player.birthDate)
  const positionLabel = POSITION_LABEL_BY_CODE[player.position] ?? player.position
  const initials = player.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111] transition hover:border-white/20 hover:bg-[#141414]">
      <div className="grid gap-4 p-4 sm:grid-cols-[112px_1fr]">
        <div className="relative h-36 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-28">
          {player.photoUrl ? (
            <img alt={player.name} src={player.photoUrl} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-linear-to-br from-[#00E094]/20 to-[#0C65D4]/20 text-2xl font-black text-white/80">
              {initials || <UserRound size={28} />}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold">{player.name}</h3>
              <p className="mt-1 text-sm text-white/60">{positionLabel}</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80">
              {player.position}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
            <span className="rounded-full bg-white/10 px-2 py-1">{player.nationality || 'Sin nacionalidad'}</span>
            <span className="rounded-full bg-white/10 px-2 py-1">{age ? `${age} años` : 'Edad no disponible'}</span>
            <span className="rounded-full bg-white/10 px-2 py-1">Club: {player.currentTeamName}</span>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-white/65">
            <p>
              <span className="text-white/45">Nacimiento: </span>
              {formatDate(player.birthDate)}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

export const Home = () => {
  const { token } = useAuthSession()
  const [search, setSearch] = useState('')
  const [position, setPosition] = useState<ApiPlayerPosition | 'ALL'>('ALL')
  const [nationality, setNationality] = useState('')
  const [minAge, setMinAge] = useState('')
  const [maxAge, setMaxAge] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState<(typeof LIMIT_OPTIONS)[number]>(10)

  const deferredSearch = useDeferredValue(search.trim())

  useEffect(() => {
    setPage(1)
  }, [deferredSearch, position, nationality, minAge, maxAge, limit])

  const filters = useMemo<PlayersQueryFilters>(
    () => ({
      search: deferredSearch || undefined,
      position: position === 'ALL' ? undefined : position,
      nationality: nationality.trim() || undefined,
      minAge: parseNumberInput(minAge),
      maxAge: parseNumberInput(maxAge),
      page,
      limit,
    }),
    [deferredSearch, limit, maxAge, minAge, nationality, page, position],
  )

  const playersQuery = useQuery({
    queryKey: ['players', token, filters],
    queryFn: () => getPlayers(filters),
    placeholderData: keepPreviousData,
    enabled: Boolean(token),
  })

  const players = playersQuery.data?.items ?? []
  const meta = playersQuery.data?.meta
  const totalPages = meta?.totalPages ?? 0
  const isInitialLoading = playersQuery.isLoading && !playersQuery.data

  const clearFilters = () => {
    setSearch('')
    setPosition('ALL')
    setNationality('')
    setMinAge('')
    setMaxAge('')
    setPage(1)
    setLimit(10)
  }

  return (
    <section className="space-y-4">
      <div className={panelClass}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-white/45">Players API</p>
            <h1 className="mt-2 text-2xl font-black md:text-3xl">Listado de jugadores</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
              Filtros por nombre, posición, nacionalidad y edad.
            </p>
          </div>

          <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/70 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Total</p>
              <p className="mt-1 text-lg font-bold text-white">{meta?.total ?? 0}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Página</p>
              <p className="mt-1 text-lg font-bold text-white">{meta?.page ?? 1}/{totalPages || 1}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">Tamaño</p>
              <p className="mt-1 text-lg font-bold text-white">{meta?.limit ?? limit}</p>
            </div>
          </div>
        </div>
      </div>

      <article className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold">Filtros</h2>
            <p className="text-sm text-white/55">El cambio de filtros resetea la paginación y reutiliza el cache de React Query.</p>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
          >
            <FilterX size={16} />
            Limpiar
          </button>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_repeat(5,minmax(0,1fr))]">
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">Buscar</span>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
              <input
                aria-label="Buscar jugador"
                className="w-full rounded-xl border border-white/10 bg-[#111111] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition focus:border-[#00E094]/40"
                placeholder="Nombre del jugador"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">Posición</span>
            <select
              value={position}
              onChange={(event) => setPosition(event.target.value as ApiPlayerPosition | 'ALL')}
              className="w-full rounded-xl border border-white/10 bg-[#111111] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/40"
            >
              <option value="ALL">Todas</option>
              {POSITION_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">Nacionalidad</span>
            <input
              aria-label="Filtrar por nacionalidad"
              className="w-full rounded-xl border border-white/10 bg-[#111111] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/40"
              placeholder="Ej. Argentina"
              value={nationality}
              onChange={(event) => setNationality(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">Edad mín.</span>
            <input
              aria-label="Edad mínima"
              type="number"
              min={0}
              className="w-full rounded-xl border border-white/10 bg-[#111111] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/40"
              placeholder="18"
              value={minAge}
              onChange={(event) => setMinAge(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">Edad máx.</span>
            <input
              aria-label="Edad máxima"
              type="number"
              min={0}
              className="w-full rounded-xl border border-white/10 bg-[#111111] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/40"
              placeholder="35"
              value={maxAge}
              onChange={(event) => setMaxAge(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">Por página</span>
            <select
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value) as (typeof LIMIT_OPTIONS)[number])}
              className="w-full rounded-xl border border-white/10 bg-[#111111] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#00E094]/40"
            >
              {LIMIT_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </article>

      <section className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-bold">Resultados</h2>
            <p className="text-sm text-white/55">
              {meta ? `${meta.total} jugador${meta.total === 1 ? '' : 'es'} encontrados` : 'Ejecuta una búsqueda para ver resultados'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/60">
            {playersQuery.isFetching ? <Loader2 size={16} className="animate-spin text-[#00E094]" /> : null}
          </div>
        </div>

        <div className="mt-4 min-h-40">
          {isInitialLoading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-42 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
              ))}
            </div>
          ) : playersQuery.isError ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              No se pudo cargar el listado de jugadores.
              <button
                type="button"
                onClick={() => playersQuery.refetch()}
                className="ml-3 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-100 transition hover:bg-red-500/20"
              >
                Reintentar
              </button>
            </div>
          ) : players.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-14 text-center text-sm text-white/60">
              <div>
                <p className="font-semibold text-white/80">No hay coincidencias</p>
                <p className="mt-1">Prueba limpiar filtros o ajustar la búsqueda.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="text-sm text-white/60">
            {meta
              && `Página ${meta.page} de ${meta.totalPages}. Mostrando ${players.length} de ${meta.total} jugador${meta.total === 1 ? '' : 'es'}.`}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!meta?.hasPrev || playersQuery.isFetching}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="min-w-16 rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-center text-sm text-white/70">
              {page}
            </span>
            <button
              type="button"
              disabled={!meta?.hasNext || playersQuery.isFetching}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>
    </section>
  )
}