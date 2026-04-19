import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ageRanges, filtersSummary, getAgeRange, nationalities, players, positions, summaryStats } from '../data/scoutData'
import type { Position } from '../types/player'

const panelClass = 'rounded-2xl border border-white/10 bg-[#171717] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)]'

export const Home = () => {
  const [query, setQuery] = useState('')
  const [position, setPosition] = useState<Position | 'Todas'>('Todas')
  const [nationality, setNationality] = useState('Todas')
  const [ageRange, setAgeRange] = useState('Todas')
  const [activePlayerId, setActivePlayerId] = useState<number>(1)

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesQuery = player.name.toLowerCase().includes(query.toLowerCase())
      const matchesPosition = position === 'Todas' || player.position === position
      const matchesNationality = nationality === 'Todas' || player.nationality === nationality
      const matchesAge = ageRange === 'Todas' || getAgeRange(player.age) === ageRange

      return matchesQuery && matchesPosition && matchesNationality && matchesAge
    })
  }, [ageRange, nationality, position, query])

  const activePlayer = useMemo(() => {
    return players.find((player) => player.id === activePlayerId) ?? players[0]
  }, [activePlayerId])

  return (
    <>
      <section className="grid gap-4 xl:grid-cols-[1.6fr_repeat(4,minmax(0,1fr))]">
        <div className={panelClass}>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold">Resumen</span>
            <span className="text-sm text-white/60">General</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {filtersSummary.map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="h-9 w-9 rounded-lg bg-linear-to-br from-[#00E094] to-[#0C65D4]" />
                <div>
                  <p className="text-lg font-extrabold leading-none">{item.value}</p>
                  <p className="text-xs text-white/60">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {summaryStats.map((stat) => (
          <article key={stat.label} className={panelClass}>
            <p className="text-sm text-white/60">| {stat.label}</p>
            <p className="mt-5 text-3xl font-extrabold leading-none">{stat.value}</p>
            <p
              className={`mt-6 text-sm font-semibold ${
                stat.tone === 'green' ? 'text-[#00E094]' : stat.tone === 'blue' ? 'text-[#0C65D4]' : stat.tone === 'violet' ? 'text-[#7533FC]' : 'text-white/70'
              }`}
            >
              {stat.delta}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className={panelClass}>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Jugadores</span>
            <span className="text-sm text-white/60">Resultados filtrados</span>
          </div>

          <div className="mt-4 grid gap-2 lg:grid-cols-[1.6fr_repeat(3,minmax(0,1fr))]">
            <input
              aria-label="Buscar jugador"
              className="rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white outline-none focus:border-[#00E094]/40"
              placeholder="Buscar jugador, agente o club"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              value={position}
              onChange={(event) => setPosition(event.target.value as Position | 'Todas')}
              className="rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white outline-none focus:border-[#00E094]/40"
            >
              <option value="Todas">Todas las posiciones</option>
              {positions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={nationality}
              onChange={(event) => setNationality(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white outline-none focus:border-[#00E094]/40"
            >
              {nationalities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={ageRange}
              onChange={(event) => setAgeRange(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white outline-none focus:border-[#00E094]/40"
            >
              <option value="Todas">Todas las edades</option>
              {ageRanges.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-3">
            {filteredPlayers.map((player) => (
              <button
                key={player.id}
                type="button"
                onClick={() => setActivePlayerId(player.id)}
                className={`grid items-center gap-3 rounded-2xl border p-3 text-left transition md:grid-cols-[72px_1fr] ${
                  activePlayerId === player.id
                    ? 'border-[#00E094]/40 bg-[#00E094]/10'
                    : 'border-white/10 bg-[#1d1d1d] hover:border-white/20'
                }`}
              >
                <img alt={player.name} src={player.photo} className="h-18 w-full rounded-xl object-cover md:w-18" />
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm md:text-base">{player.name}</strong>
                    <span className="text-xs text-white/70 md:text-sm">{player.marketValue}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/70">
                    <span className="rounded-full bg-white/10 px-2 py-1">{player.position}</span>
                    <span className="rounded-full bg-white/10 px-2 py-1">{player.age} años</span>
                    <span className="rounded-full bg-white/10 px-2 py-1">{player.nationality}</span>
                  </div>
                  <p className="mt-2 text-xs text-white/60 md:text-sm">{player.summary}</p>
                </div>
              </button>
            ))}
          </div>
        </article>

        <article className={panelClass}>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Detalles del jugador</span>
            <span className="text-sm text-white/60">{activePlayer.team}</span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[112px_1fr]">
            <img alt={activePlayer.name} src={activePlayer.photo} className="h-45 w-full rounded-2xl object-cover md:h-28" />
            <div>
              <h2 className="text-xl font-bold">{activePlayer.name}</h2>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/70">
                <span className="rounded-full bg-white/10 px-2 py-1">{activePlayer.position}</span>
                <span className="rounded-full bg-white/10 px-2 py-1">{activePlayer.age} años</span>
                <span className="rounded-full bg-white/10 px-2 py-1">{activePlayer.league}</span>
              </div>
              <p className="mt-3 text-sm text-white/65">{activePlayer.summary}</p>
            </div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">2026</span>
              <span className="text-white/60">Liga Profesional de Fútbol</span>
            </div>
            <div className="mt-2 h-50 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'G', value: activePlayer.stats.goals },
                    { name: 'A', value: activePlayer.stats.assists },
                    { name: 'P', value: activePlayer.stats.passes },
                    { name: 'T', value: activePlayer.stats.tackles },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="name" tick={{ fill: '#F2F2F2', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#F2F2F2', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#111111',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 16,
                      color: '#F2F2F2',
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    <Cell fill="#00E094" />
                    <Cell fill="#0C65D4" />
                    <Cell fill="#7533FC" />
                    <Cell fill="#8A8A8A" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>
      </section>
    </>
  )
}
