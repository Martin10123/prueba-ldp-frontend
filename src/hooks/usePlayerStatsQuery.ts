import { useQuery } from '@tanstack/react-query'
import { getPlayerStats } from '../services/players'

export const usePlayerStatsQuery = (playerId: string | undefined, enabled: boolean) =>
  useQuery({
    queryKey: ['players', playerId, 'stats'],
    queryFn: () => getPlayerStats(playerId ?? ''),
    enabled: Boolean(playerId) && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })