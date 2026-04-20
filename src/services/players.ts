import type {
  CreatePlayerInput,
  PlayerComparisonResponse,
  PlayerDetail,
  PlayerListItem,
  PlayerListResponse,
  PlayerOptions,
  PlayerStatsResponse,
  PlayersQueryFilters,
  UpdatePlayerInput,
} from '../types/player'
import { request } from './http'

const toQueryValue = (value: string | number | undefined) => {
  if (value === undefined) return undefined
  if (typeof value === 'string' && value.trim() === '') return undefined

  return String(value)
}

const parseStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const parseTeams = (value: unknown) => {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null

      const id = 'id' in item && (typeof item.id === 'string' || typeof item.id === 'number')
        ? String(item.id)
        : null
      const name = 'name' in item && typeof item.name === 'string'
        ? item.name
        : 'nombre' in item && typeof item.nombre === 'string'
          ? item.nombre
          : null

      if (!id || !name) return null
      return { id, name }
    })
    .filter((item): item is { id: string; name: string } => item !== null)
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

export async function getPlayersOptions() {
  const payload = await request<Record<string, unknown>>('/players/options')

  return {
    teams: parseTeams(payload.teams ?? payload.equipos),
    nationalities: parseStringArray(payload.nationalities ?? payload.nacionalidades),
    positions: parseStringArray(payload.positions ?? payload.posiciones),
  } satisfies PlayerOptions
}

export async function getPlayerById(id: string) {
  return request<PlayerDetail>(`/players/${id}`)
}

export async function getPlayerStats(id: string, seasonId?: string) {
  const params = new URLSearchParams()

  if (seasonId) {
    params.set('seasonId', seasonId)
  }

  const query = params.toString()
  return request<PlayerStatsResponse>(query ? `/players/${id}/stats?${query}` : `/players/${id}/stats`)
}

export async function getPlayersCompare(ids: string[]) {
  const normalizedIds = Array.from(new Set(ids.map((id) => id.trim()).filter(Boolean))).slice(0, 3)

  if (normalizedIds.length < 2) {
    throw new Error('Selecciona al menos 2 jugadores para comparar')
  }

  const params = new URLSearchParams({
    ids: normalizedIds.join(','),
  })

  return request<PlayerComparisonResponse>(`/players/compare?${params.toString()}`)
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