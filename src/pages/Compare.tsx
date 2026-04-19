import { useMemo, useState } from 'react'
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { comparisonMetrics, comparisonRows, normalizeMetricValue, players } from '../data/scoutData'
import type { Player } from '../types/player'

const panelClass = 'rounded-2xl border border-white/10 bg-[#171717] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)]'

const metricKeyMap = {
  Goals: 'goals',
  Assists: 'assists',
  Passes: 'passes',
  Tackles: 'tackles',
  AerialDuels: 'aerialDuels',
  Minutes: 'minutes',
} as const

function toPlayerArray(ids: number[]) {
  const result = ids
    .map((id) => players.find((player) => player.id === id))
    .filter((player): player is Player => Boolean(player))

  if (result.length < 2) return [players[0], players[1]]
  return result
}

export const Compare = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2])
  const [showThird, setShowThird] = useState(false)

  const selectedPlayers = useMemo(() => {
    const ids = showThird ? selectedIds : selectedIds.slice(0, 2)
    return toPlayerArray(ids)
  }, [selectedIds, showThird])

  const firstPlayer = selectedPlayers[0] ?? players[0]
  const secondPlayer = selectedPlayers[1] ?? players[1]
  const thirdPlayer = selectedPlayers[2]

  const radarData = comparisonMetrics.map((metric) => ({
    metric: metric.label,
    [firstPlayer.name]: normalizeMetricValue(metric.key, firstPlayer.stats[metricKeyMap[metric.key as keyof typeof metricKeyMap]]),
    [secondPlayer.name]: normalizeMetricValue(metric.key, secondPlayer.stats[metricKeyMap[metric.key as keyof typeof metricKeyMap]]),
    ...(thirdPlayer
      ? {
          [thirdPlayer.name]: normalizeMetricValue(
            metric.key,
            thirdPlayer.stats[metricKeyMap[metric.key as keyof typeof metricKeyMap]],
          ),
        }
      : {}),
  }))

  return (
    <section className={panelClass}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-lg font-bold">
            <strong>{firstPlayer.name}</strong>
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">vs</span>
            <strong>{secondPlayer.name}</strong>
            {thirdPlayer ? (
              <>
                <span className="text-xs uppercase tracking-[0.2em] text-white/50">vs</span>
                <strong>{thirdPlayer.name}</strong>
              </>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-white/60">Comparación de jugadores lado a lado</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedIds[0]}
            onChange={(event) => setSelectedIds([Number(event.target.value), selectedIds[1], selectedIds[2]])}
            className="rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm"
          >
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
          <select
            value={selectedIds[1]}
            onChange={(event) => setSelectedIds([selectedIds[0], Number(event.target.value), selectedIds[2]])}
            className="rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm"
          >
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
          {showThird ? (
            <select
              value={selectedIds[2] ?? players[2].id}
              onChange={(event) => setSelectedIds([selectedIds[0], selectedIds[1], Number(event.target.value)])}
              className="rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm"
            >
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          ) : null}
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm hover:border-white/20"
            onClick={() => {
              setShowThird((current) => !current)
              if (!selectedIds[2]) {
                setSelectedIds((current) => [current[0], current[1], players[2].id])
              }
            }}
          >
            {showThird ? 'Quitar 3ro' : '+ Agregar 3ro'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-3">
          <div className="h-105 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.12)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(242,242,242,0.8)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: '#111111',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    color: '#F2F2F2',
                  }}
                />
                <Legend />
                <Radar name={firstPlayer.name} dataKey={firstPlayer.name} stroke="#7533FC" fill="#7533FC" fillOpacity={0.18} />
                <Radar
                  name={secondPlayer.name}
                  dataKey={secondPlayer.name}
                  stroke="#0C65D4"
                  fill="#0C65D4"
                  fillOpacity={0.16}
                />
                {thirdPlayer ? (
                  <Radar name={thirdPlayer.name} dataKey={thirdPlayer.name} stroke="#00E094" fill="#00E094" fillOpacity={0.14} />
                ) : null}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111111] p-3">
          <div className={`grid gap-2 pb-3 text-sm ${thirdPlayer ? 'grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]' : 'grid-cols-[1.2fr_repeat(2,minmax(0,1fr))]'} border-b border-white/10`}>
            <span />
            {selectedPlayers.map((player) => (
              <div key={player.id} className="flex items-center gap-2">
                <img alt={player.name} src={player.photo} className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{player.name}</p>
                  <p className="truncate text-xs text-white/60">{player.team}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 grid gap-2">
            {comparisonRows.map((row) => (
              <div
                key={row.label}
                className={`grid items-center gap-2 border-b border-white/5 py-2 text-sm ${thirdPlayer ? 'grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]' : 'grid-cols-[1.2fr_repeat(2,minmax(0,1fr))]'}`}
              >
                <span className="text-white/80">{row.label}</span>
                {selectedPlayers.map((_, valueIndex) => {
                  const value = row.values[valueIndex] ?? 0
                  return (
                    <span key={`${row.label}-${valueIndex}`} className="inline-flex items-center gap-2 text-white">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          valueIndex % 3 === 0 ? 'bg-[#00E094]' : valueIndex % 3 === 1 ? 'bg-[#0C65D4]' : 'bg-[#7533FC]'
                        }`}
                      />
                      {typeof value === 'number' && value < 10 && row.label === 'Expected Assists (xA)'
                        ? value.toFixed(2)
                        : value}
                    </span>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
