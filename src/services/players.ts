import type {
  CreatePlayerInput,
  PlayerListItem,
  PlayerListResponse,
  PlayersQueryFilters,
  UpdatePlayerInput,
} from '../types/player'
import { request } from './http'

const toQueryValue = (value: string | number | undefined) => {
  if (value === undefined) return undefined
  if (typeof value === 'string' && value.trim() === '') return undefined

  return String(value)
}

export async function getPlayers(filters: PlayersQueryFilters = {}) {
  const params = new URLSearchParams()

  const search = toQueryValue(filters.search)
  const position = toQueryValue(filters.position)
  const nationality = toQueryValue(filters.nationality)
  const minAge = toQueryValue(filters.minAge)
  const maxAge = toQueryValue(filters.maxAge)
  const page = toQueryValue(filters.page ?? 1)
  const limit = toQueryValue(filters.limit ?? 10)

  if (search) params.set('search', search)
  if (position) params.set('position', position)
  if (nationality) params.set('nationality', nationality)
  if (minAge) params.set('minAge', minAge)
  if (maxAge) params.set('maxAge', maxAge)
  if (page) params.set('page', page)
  if (limit) params.set('limit', limit)

  const query = params.toString()

  return request<PlayerListResponse>(query ? `/players?${query}` : '/players')
}

export async function createPlayer(input: CreatePlayerInput) {
  return request<PlayerListItem>('/players', {
    method: 'POST',
    body: input,
  })
}

export async function updatePlayer(id: string, input: UpdatePlayerInput) {
  return request<PlayerListItem>(`/players/${id}`, {
    method: 'PATCH',
    body: input,
  })
}

export async function deletePlayer(id: string) {
  return request<unknown>(`/players/${id}`, {
    method: 'DELETE',
  })
}