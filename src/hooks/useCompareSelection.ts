import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePlayersQuery } from './usePlayersQuery'
import {
  applySelectedId,
  comparePickerFilters,
  normalizeSelectedIds,
  parseIdsParam,
  sameIds,
} from '../helpers/compare'

export const useCompareSelection = (enabled: boolean) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<string[]>(() => parseIdsParam(searchParams.get('ids')))
  const [showThird, setShowThird] = useState(() => selectedIds.length === 3)

  const playersQuery = usePlayersQuery(comparePickerFilters, enabled)
  const availablePlayers = useMemo(() => playersQuery.data?.items ?? [], [playersQuery.data?.items])

  const playerOptions = useMemo(() => availablePlayers, [availablePlayers])

  useEffect(() => {
    if (availablePlayers.length === 0) return

    const targetCount = showThird ? 3 : 2

    setSelectedIds((current) => {
      const normalized = normalizeSelectedIds(current, availablePlayers, targetCount)
      return sameIds(current, normalized) ? current : normalized
    })
  }, [availablePlayers, showThird])

  useEffect(() => {
    const idsParam = selectedIds.join(',')
    if (idsParam.length === 0) return
    if ((searchParams.get('ids') ?? '') === idsParam) return

    setSearchParams({ ids: idsParam }, { replace: true })
  }, [searchParams, selectedIds, setSearchParams])

  const onSelectPlayer = useCallback(
    (index: number, playerId: string) => {
      if (!playerId) return

      setSelectedIds((current) => {
        const targetCount = showThird ? 3 : 2
        return applySelectedId(current, index, playerId, availablePlayers, targetCount)
      })
    },
    [availablePlayers, showThird],
  )

  const onToggleThirdPlayer = useCallback(() => {
    setShowThird((current) => !current)
    setSelectedIds((current) => current.slice(0, 2))
  }, [])

  return {
    playersQuery,
    selectedIds,
    showThird,
    playerOptions,
    onSelectPlayer,
    onToggleThirdPlayer,
  }
}
