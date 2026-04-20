import { Loader2, Users } from 'lucide-react'
import { CompareMetricsTable } from '../components/compare/CompareMetricsTable'
import { ComparePlayerHighlights } from '../components/compare/ComparePlayerHighlights'
import { ComparePlayerSelector } from '../components/compare/ComparePlayerSelector'
import { CompareRadarChartCard } from '../components/compare/CompareRadarChartCard'
import { useAuthSession } from '../hooks/useAuth'
import { useCompareInsights } from '../hooks/useCompareInsights'
import { useCompareSelection } from '../hooks/useCompareSelection'

const panelClass = 'rounded-2xl border border-white/10 bg-[#171717] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)]'

export const Compare = () => {
  const { token } = useAuthSession()
  const {
    playersQuery,
    selectedIds,
    showThird,
    playerOptions,
    onSelectPlayer,
    onToggleThirdPlayer,
  } = useCompareSelection(Boolean(token))
  const { compareQuery, playerStats, radarData, metricRows, isLoadingCompare } = useCompareInsights(
    selectedIds,
    Boolean(token),
  )

  return (
    <section className="space-y-4">
      <article className={panelClass}>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-white/45">Comparador API</p>
            <h1 className="mt-2 text-2xl font-black md:text-3xl">Comparación entre jugadores</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
              Selecciona 2 o 3 jugadores para ver su rendimiento agregado.
            </p>
          </div>
        </div>

        <div className="mt-4">
          {playersQuery.isLoading && playerOptions.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-white/65">
              <Loader2 size={16} className="animate-spin text-[#00E094]" />
              Cargando jugadores disponibles...
            </div>
          ) : (
            <ComparePlayerSelector
              options={playerOptions}
              selectedIds={selectedIds}
              showThird={showThird}
              loading={playersQuery.isLoading || playersQuery.isFetching}
              onSelect={onSelectPlayer}
              onToggleThird={onToggleThirdPlayer}
            />
          )}
        </div>
      </article>

      {compareQuery.isError ? (
        <article className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          No se pudo obtener la comparación de jugadores.
          <button
            type="button"
            onClick={() => compareQuery.refetch()}
            className="ml-3 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-100 transition hover:bg-red-500/20"
          >
            Reintentar
          </button>
        </article>
      ) : null}

      {isLoadingCompare ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="h-100 animate-pulse rounded-2xl border border-white/10 bg-[#171717]" />
          <div className="h-100 animate-pulse rounded-2xl border border-white/10 bg-[#171717]" />
        </div>
      ) : playerStats.length < 2 ? (
        <article className={panelClass}>
          <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-14 text-center text-sm text-white/60">
            <div>
              <Users size={20} className="mx-auto text-white/55" />
              <p className="mt-2 font-semibold text-white/80">Selecciona al menos 2 jugadores</p>
              <p className="mt-1">Necesitas 2 o 3 jugadores para generar la comparación.</p>
            </div>
          </div>
        </article>
      ) : (
        <>
          <ComparePlayerHighlights players={playerStats} />

          <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <CompareRadarChartCard
              radarData={radarData}
              players={playerStats.map((item) => item.series)}
            />
            <CompareMetricsTable
              players={playerStats.map((item) => item.series)}
              rows={metricRows}
            />
          </section>
        </>
      )}
    </section>
  )
}
