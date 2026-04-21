import { useMemo } from 'react'
import { buildCompareViewModel } from '../helpers/compare'
import { usePlayersCompareQuery } from './usePlayersCompareQuery'

export const useCompareInsights = (selectedIds: string[], enabled: boolean) => {
  const compareQuery = usePlayersCompareQuery(selectedIds, enabled)

  const { playerStats, radarData, metricRows, barData } = useMemo(
    () => buildCompareViewModel(selectedIds, compareQuery.data),
    [compareQuery.data, selectedIds],
  )

  const isLoadingCompare = compareQuery.isLoading && playerStats.length === 0

  return {
    compareQuery,
    playerStats,
    radarData,
    metricRows,
    barData,
    isLoadingCompare,
  }
}
