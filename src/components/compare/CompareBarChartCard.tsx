import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CompareBarDatum, CompareSeriesPlayer } from '../../types/typesCompare'

type CompareBarChartCardProps = {
  barData: CompareBarDatum[]
  players: CompareSeriesPlayer[]
}

export const CompareBarChartCard = ({ barData, players }: CompareBarChartCardProps) => (
  <article className="rounded-2xl border border-white/10 bg-[#111111] p-3">
    <div className="mb-2 px-1">
      <h3 className="text-lg font-bold">Barras comparativas</h3>
      <p className="text-sm text-white/55">Comparación por métrica en escala normalizada de 0 a 100.</p>
    </div>

    <div className="h-107.5 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
          <XAxis dataKey="metric" tick={{ fill: 'rgba(242,242,242,0.86)', fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fill: 'rgba(242,242,242,0.68)', fontSize: 12 }} />
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
            <Bar
              key={player.id}
              name={player.name}
              dataKey={player.id}
              fill={player.color}
              radius={[6, 6, 0, 0]}
              maxBarSize={26}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  </article>
)
