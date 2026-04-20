import { useQuery } from '@tanstack/react-query'
import { getPlayersOptions } from '../services/players'

export const usePlayersOptionsQuery = (enabled: boolean) =>
  useQuery({
    queryKey: ['players', 'options'],
    queryFn: getPlayersOptions,
    enabled,
    staleTime: 5 * 60 * 1000,
  })
