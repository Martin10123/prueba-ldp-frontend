import { useQuery } from '@tanstack/react-query'
import { getPlayersCompare } from '../services/players'

export const usePlayersCompareQuery = (ids: string[], enabled: boolean) => {
  const normalizedIds = Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean))).slice(0, 3)

  return useQuery({
    queryKey: ['players', 'compare', normalizedIds],
    queryFn: () => getPlayersCompare(normalizedIds),
    enabled: enabled && normalizedIds.length >= 2,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
