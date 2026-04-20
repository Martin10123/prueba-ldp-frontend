import { useQuery } from '@tanstack/react-query'
import { getPlayerById } from '../services/players'

export const usePlayerQuery = (playerId: string | undefined, enabled: boolean) =>
  useQuery({
    queryKey: ['players', playerId],
    queryFn: () => getPlayerById(playerId ?? ''),
    enabled: Boolean(playerId) && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  })