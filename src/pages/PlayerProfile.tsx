import { ArrowLeft, Calendar, Flag, ShieldCheck, Shirt, Sparkles, Trophy, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useAuthSession } from '../hooks/useAuth'
import { usePlayerQuery } from '../hooks/usePlayerQuery'
import { usePlayerStatsQuery } from '../hooks/usePlayerStatsQuery'
import { getPositionLabel } from '../utils/playerPosition'

const panelClass = 'rounded-3xl border border-white/10 bg-[#141414] shadow-[0_18px_50px_rgba(0,0,0,0.45)]'
const softPanelClass = 'rounded-2xl border border-white/10 bg-[#111111] shadow-[0_14px_35px_rgba(0,0,0,0.35)]'
const tabClass =
  'inline-flex items-center rounded-xl border px-4 py-2 text-sm font-semibold transition duration-200'

const tabs = ['Resumen'] as const

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))

const getAge = (birthDate: string) => {
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return null

  const ageDate = new Date(Date.now() - birth.getTime())
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

const formatMinutes = (minutes: number) => {
  if (!Number.isFinite(minutes)) return '0'
  return new Intl.NumberFormat('es-CO').format(minutes)
}

export const PlayerProfile = () => {
  const { playerId } = useParams<{ playerId: string }>()
  const { token } = useAuthSession()

  const playerQuery = usePlayerQuery(playerId, Boolean(token))
  const statsQuery = usePlayerStatsQuery(playerId, Boolean(token))

  const player = playerQuery.data
  const stats = statsQuery.data ?? []
  const age = player ? getAge(player.birthDate) : null
  const firstStat = stats[0]

  const totalMatches = stats.reduce((sum, item) => sum + item.matchesPlayed, 0)
  const totalGoals = stats.reduce((sum, item) => sum + item.goals, 0)
  const totalAssists = stats.reduce((sum, item) => sum + item.assists, 0)
  const totalMinutes = stats.reduce((sum, item) => sum + item.minutesPlayed, 0)
  const totalCards = stats.reduce((sum, item) => sum + item.yellowCards + item.redCards, 0)
  const activeSeason = stats[0]?.season

  const isLoading = playerQuery.isLoading || statsQuery.isLoading
  const isError = playerQuery.isError || statsQuery.isError

  if (!playerId) {
    return (
      <section className={panelClass}>
        <div className="p-5">
          <p className="text-sm text-white/70">No se encontró el jugador solicitado.</p>
          <Link to="/players" className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10">
            <ArrowLeft size={16} />
            Volver al listado
          </Link>
        </div>
      </section>
    )
  }

  if (isLoading && !player) {
    return (
      <section className="grid gap-4">
        <div className={`${panelClass} overflow-hidden`}>
          <div className="relative min-h-55 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,224,148,0.14),transparent_28%),radial-gradient(circle_at_right,rgba(12,101,212,0.18),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.03)_40%,transparent_80%)]" />
            <div className="relative grid gap-4 p-5 lg:grid-cols-[1.15fr_0.85fr] lg:p-6">
              <div className="grid gap-4 md:grid-cols-[144px_1fr] md:items-center">
                <div className="h-36 w-36 animate-pulse rounded-[28px] bg-white/10" />
                <div className="grid gap-3">
                  <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                  <div className="h-10 w-3/5 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
                    <div className="h-8 w-24 animate-pulse rounded-full bg-white/10" />
                    <div className="h-8 w-28 animate-pulse rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
              <div className="grid gap-3 rounded-[28px] border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
                <div className="h-5 w-28 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (isError || !player) {
    return (
      <section className={panelClass}>
        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black">Perfil del jugador</h1>
              <p className="mt-1 text-sm text-white/60">No fue posible cargar la información del jugador.</p>
            </div>
            <Link
              to="/players"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              Volver
            </Link>
          </div>
          <button
            type="button"
            onClick={() => {
              void playerQuery.refetch()
              void statsQuery.refetch()
            }}
            className="mt-4 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/10"
          >
            Reintentar
          </button>
        </div>
      </section>
    )
  }

  const initials = player.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <section className="space-y-4 pb-4">
      <div className={`${panelClass} overflow-hidden`}>
        <div className="relative min-h-65 overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,224,148,0.16),transparent_28%),radial-gradient(circle_at_right,rgba(12,101,212,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_42%,transparent_82%)]" />
          <div className="relative grid gap-4 p-5 lg:grid-cols-[1.1fr_0.9fr] lg:p-6">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/55">
                <Sparkles size={14} className="text-[#00E094]" />
                Perfil del jugador
              </div>

              <div className="grid gap-4 md:grid-cols-[148px_1fr] md:items-center">
                <div className="relative h-36 w-36 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                  {player.photoUrl ? (
                    <img src={player.photoUrl} alt={player.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_top,rgba(0,224,148,0.22),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] text-5xl font-black text-white/80">
                      {initials || <Users size={40} />}
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 grid h-6 w-6 place-items-center rounded-full border border-black/20 bg-[#00E094] text-[11px] font-black text-black shadow-lg">
                    ✓
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-white/70">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
                      <Flag size={13} />
                      {player.nationality}
                    </span>
                    <span className="rounded-full bg-white/5 px-2.5 py-1">{getPositionLabel(player.position)}</span>
                    <span className="rounded-full bg-white/5 px-2.5 py-1">{age ? `${age} años` : 'Edad N/D'}</span>
                  </div>

                  <h1 className="mt-3 text-4xl font-black leading-none tracking-tight text-white md:text-5xl">
                    {player.name}
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 md:text-[15px]">
                    {player.currentTeamName ?? 'Sin equipo'} ·{' '}
                    {player.isActive ? 'Profesional activo' : 'Jugador inactivo'} · ID {player.id}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Link
                      to="/players"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-white/20 hover:bg-white/10"
                    >
                      <ArrowLeft size={16} />
                      Volver
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-[28px] border border-white/10 bg-black/25 p-4 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white">{player.currentTeamName ?? 'Sin equipo'}</p>
                  <p className="mt-1 text-sm text-white/60">{activeSeason?.name ?? 'Temporada actual'}</p>
                </div>
                <div className="rounded-full border border-[#00E094]/30 bg-[#00E094]/15 px-3 py-1 text-sm font-semibold text-[#00E094]">
                  Active
                </div>
              </div>

              <div className="mt-5 grid grid-cols-[1fr_auto] gap-2 text-sm text-white/70">
                <span className="inline-flex items-center gap-2 text-white/50"><Calendar size={14} />Fecha de nacimiento</span>
                <span>{formatDate(player.birthDate)}</span>
                <span className="inline-flex items-center gap-2 text-white/50"><ShieldCheck size={14} /> Posición</span>
                <span>{getPositionLabel(player.position)}</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Partidos</p>
                  <p className="mt-2 text-2xl font-black text-white">{totalMatches}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">Goals</p>
                  <p className="mt-2 text-2xl font-black text-white">{totalGoals}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className={`${panelClass} p-3`}>
        <div className="flex flex-wrap gap-2 overflow-x-auto">
          {tabs.map((tab, index) => {
            const active = index === 0
            return (
              <button
                key={tab}
                type="button"
                className={`${tabClass} ${active ? 'border-[#00E094]/35 bg-[#00E094]/12 text-white shadow-[0_0_0_1px_rgba(0,224,148,0.2)]' : 'border-transparent bg-transparent text-white/70 hover:border-white/10 hover:bg-white/5 hover:text-white'}`}
              >
                {tab}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="grid gap-4">
          <section className={`${softPanelClass} p-4`}>
            <div className="flex items-center gap-2 border-l-2 border-[#00E094] pl-3 text-lg font-bold">
              Resumen del perfil
            </div>
            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="text-sm text-white/55">Posición</p>
                  <p className="mt-1 text-base font-semibold text-white">{getPositionLabel(player.position)}</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#00E094]/15 text-[#00E094]">
                  <ShieldCheck size={18} />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="text-sm text-white/55">Nacionalidad</p>
                  <p className="mt-1 text-base font-semibold text-white">{player.nationality}</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white/75">
                  <Flag size={18} />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="text-sm text-white/55">Club</p>
                  <p className="mt-1 text-base font-semibold text-white">{player.currentTeamName ?? 'Sin equipo'}</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white/75">
                  <Shirt size={18} />
                </div>
              </div>
            </div>
          </section>

          <section className={`${softPanelClass} p-4`}>
            <div className="flex items-center gap-2 border-l-2 border-white/20 pl-3 text-lg font-bold">
              Información del jugador
            </div>
            <div className="mt-4 grid gap-3 text-sm text-white/70">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-white/55">Fecha de nacimiento</span>
                <span>{formatDate(player.birthDate)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-white/55">Tarjetas</span>
                <span>{totalCards}</span>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-4">
          <section className={`${softPanelClass} p-4`}>
              <div className="flex items-center justify-between gap-3">
                <div className="border-l-2 border-white/20 pl-3 text-lg font-bold">Rendimiento</div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#101010]">
              <div className="grid grid-cols-[1.3fr_repeat(4,minmax(0,1fr))] border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/40">
                <span>Competencia</span>
                <span className="text-center">M.P</span>
                <span className="text-center">Min.</span>
                <span className="text-center">G</span>
                <span className="text-center">As</span>
              </div>

              {stats.length > 0 ? (
                stats.slice(0, 2).map((item) => (
                  <div key={item.id} className="grid grid-cols-[1.3fr_repeat(4,minmax(0,1fr))] items-center border-b border-white/5 px-4 py-3 text-sm text-white/80 last:border-b-0">
                    <div>
                      <p className="font-semibold text-white">{item.team.name}</p>
                      <p className="mt-1 text-xs text-white/45">{item.season.name}</p>
                    </div>
                    <span className="text-center">{item.matchesPlayed}</span>
                    <span className="text-center">{item.minutesPlayed}</span>
                    <span className="text-center">{item.goals}</span>
                    <span className="text-center">{item.assists}</span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-sm text-white/55">No stats available.</div>
              )}

              <div className="grid grid-cols-[1.3fr_repeat(4,minmax(0,1fr))] items-center bg-white/3 px-4 py-3 text-sm font-semibold text-white">
                <span>Total</span>
                <span className="text-center">{totalMatches}</span>
                <span className="text-center">{formatMinutes(totalMinutes)}</span>
                <span className="text-center">{totalGoals}</span>
                <span className="text-center">{totalAssists}</span>
              </div>
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-2">
            <section className={`${softPanelClass} p-4`}>
              <div className="flex items-center justify-between gap-3">
                <div className="border-l-2 border-[#00E094] pl-3 text-lg font-bold">Estadísticas</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { label: 'Partidos', value: totalMatches, accent: 'border-[#00E094]/25 bg-[#00E094]/10 text-[#00E094]' },
                  { label: 'Goles', value: totalGoals, accent: 'border-[#0C65D4]/25 bg-[#0C65D4]/10 text-[#65A3FF]' },
                  { label: 'Asistencias', value: totalAssists, accent: 'border-white/10 bg-white/5 text-white' },
                  { label: 'Minutos', value: formatMinutes(totalMinutes), accent: 'border-white/10 bg-white/5 text-white' },
                ].map((item) => (
                  <div key={item.label} className={`rounded-2xl border p-4 ${item.accent}`}>
                    <p className="text-xs uppercase tracking-[0.18em] opacity-70">{item.label}</p>
                    <p className="mt-3 text-3xl font-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${softPanelClass} p-4`}>
              <div className="flex items-center justify-between gap-3">
                <div className="border-l-2 border-white/20 pl-3 text-lg font-bold">Carrera</div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#101010] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">Equipo actual</p>
                    <p className="mt-2 text-lg font-bold text-white">{player.currentTeamName ?? 'Sin equipo'}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/45">
                      Ultima temporada: {firstStat?.season.name ?? 'N/A'}
                    </p>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-[#00E094]/15 text-[#00E094]">
                    <Trophy size={18} />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-white/70">
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <span className="text-white/50">Temporada</span>
                    <span>{activeSeason?.name ?? 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <span className="text-white/50">Equipo</span>
                    <span>{player.currentTeamName ?? 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <span className="text-white/50">Tarjetas</span>
                    <span>{totalCards}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <span className="text-white/50">Minutos</span>
                    <span>{formatMinutes(totalMinutes)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}