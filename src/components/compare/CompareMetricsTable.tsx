import type { CompareMetricRow, CompareSeriesPlayer } from './types'

type CompareMetricsTableProps = {
  players: CompareSeriesPlayer[]
  rows: CompareMetricRow[]
}

const isBestValue = (targetValue: number, values: number[], higherIsBetter: boolean) => {
  const bestValue = higherIsBetter ? Math.max(...values) : Math.min(...values)
  return Math.abs(targetValue - bestValue) < 1e-9
}

export const CompareMetricsTable = ({ players, rows }: CompareMetricsTableProps) => (
  <article className="rounded-2xl border border-white/10 bg-[#111111] p-3">
    <div className="mb-2 px-1">
      <h3 className="text-lg font-bold">Métricas clave</h3>
      <p className="text-sm text-white/55">Comparación agregada de temporadas para los jugadores seleccionados.</p>
    </div>

    <div className={`grid gap-2 border-b border-white/10 pb-3 text-sm ${players.length === 3 ? 'grid-cols-[1.15fr_repeat(3,minmax(0,1fr))]' : 'grid-cols-[1.15fr_repeat(2,minmax(0,1fr))]'}`}>
      <span />
      {players.map((player) => (
        <div key={player.id} className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/15 bg-[#1f1f1f]">
            {player.photoUrl ? <img src={player.photoUrl} alt={player.name} className="h-full w-full object-cover" /> : null}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{player.name}</p>
            <p className="truncate text-xs text-white/60">{player.teamName}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-2 grid gap-2">
      {rows.map((row) => {
        const values = row.values.map((item) => item.value)
        const higherIsBetter = row.higherIsBetter ?? true

        return (
          <div
            key={row.label}
            className={`grid items-center gap-2 rounded-xl border border-white/6 bg-white/3 px-3 py-2.5 text-sm ${players.length === 3 ? 'grid-cols-[1.15fr_repeat(3,minmax(0,1fr))]' : 'grid-cols-[1.15fr_repeat(2,minmax(0,1fr))]'}`}
          >
            <span className="text-white/85">{row.label}</span>
            {row.values.map((cell) => {
              const player = players.find((item) => item.id === cell.playerId)
              const best = isBestValue(cell.value, values, higherIsBetter)

              return (
                <span
                  key={`${row.label}-${cell.playerId}`}
                  className={`inline-flex items-center gap-2 rounded-lg px-2 py-1 ${best ? 'border border-[#00E094]/35 bg-[#00E094]/10 text-white' : 'border border-transparent text-white/85'}`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: player?.color ?? '#fff' }} />
                  {cell.display}
                </span>
              )
            })}
          </div>
        )
      })}
    </div>
  </article>
)
