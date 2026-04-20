export type Position = 'Delantero' | 'Mediocampista' | 'Defensor' | 'Arquero'

export type PlayerStats = {
  appearances: number
  goals: number
  assists: number
  passes: number
  tackles: number
  aerialDuels: number
  minutes: number
}

export type Player = {
  id: number
  name: string
  age: number
  nationality: string
  position: Position
  team: string
  league: string
  photo: string
  marketValue: string
  summary: string
  stats: PlayerStats
}

export type ApiPlayerPosition = 'GK' | 'CB' | 'RB' | 'LB' | 'CDM' | 'CM' | 'CAM' | 'RW' | 'LW' | 'ST'

export type PlayerListItem = {
  id: string
  name: string
  birthDate: string
  nationality: string
  position: ApiPlayerPosition
  photoUrl: string
  currentTeamId: string
  currentTeamName?: string
  createdAt: string
  updatedAt: string
}

export type CreatePlayerInput = {
  name: string
  birthDate: string
  nationality: string
  position: ApiPlayerPosition
  photoUrl: string
  currentTeamId: string
}

export type UpdatePlayerInput = Partial<CreatePlayerInput>

export type PlayerListMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type PlayerListResponse = {
  items: PlayerListItem[]
  meta: PlayerListMeta
}

export type PlayersQueryFilters = {
  search?: string
  position?: ApiPlayerPosition
  nationality?: string
  minAge?: number
  maxAge?: number
  page?: number
  limit?: number
}
