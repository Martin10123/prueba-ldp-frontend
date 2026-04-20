import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { PlayersQueryFilters } from '../types/player'
import { getPlayers } from '../services/players'

export const usePlayersQuery = (filters: PlayersQueryFilters, enabled: boolean) =>
  useQuery({
    queryKey: ['players', filters],
    queryFn: () => getPlayers(filters),
    placeholderData: keepPreviousData,
    enabled,
  })