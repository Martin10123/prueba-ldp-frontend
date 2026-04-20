import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { CompareRadarDatum, CompareSeriesPlayer } from './types'

type CompareRadarChartCardProps = {
  radarData: CompareRadarDatum[]
  players: CompareSeriesPlayer[]
}

export const CompareRadarChartCard = ({ radarData, players }: CompareRadarChartCardProps) => (
  <article className="rounded-2xl border border-white/10 bg-[#111111] p-3">
    <div className="mb-2 px-1">
      <h3 className="text-lg font-bold">Radar comparativo</h3>
      <p className="text-sm text-white/55">Valores normalizados en escala de 0 a 100 entre los jugadores seleccionados.</p>
    </div>

    <div className="h-107.5 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData}>
          <PolarGrid stroke="rgba(255,255,255,0.12)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(242,242,242,0.86)', fontSize: 12 }} />
          <Tooltip
            formatter={(value) => {
              const numericValue = typeof value === 'number' ? value : Number(value)
              return Number.isFinite(numericValue) ? `${Math.round(numericValue)}` : '-'
            }}
            contentStyle={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              color: '#F2F2F2',
            }}
          />
          <Legend />
          {players.map((player) => (
            <Radar
              key={player.id}
              name={player.name}
              dataKey={player.id}
              stroke={player.color}
              fill={player.color}
              fillOpacity={0.14}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  </article>
)
