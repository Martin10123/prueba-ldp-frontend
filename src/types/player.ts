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

export type ApiPlayerPosition = string

export type PlayerOptionTeam = {
  id: string
  name: string
}

export type PlayerOptions = {
  teams: PlayerOptionTeam[]
  nationalities: string[]
  positions: ApiPlayerPosition[]
}

export type PlayerListItem = {
  id: string
  name: string
  birthDate: string
  nationality: string
  position: ApiPlayerPosition
  photoUrl: string
  currentTeamId?: string
  currentTeamName: string
  createdAt: string
  updatedAt: string
}

export type PlayerDetail = {
  id: string
  name: string
  birthDate: string
  nationality: string
  position: ApiPlayerPosition
  photoUrl: string
  currentTeamId: string | null
  currentTeamName: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type PlayerSeason = {
  id: string
  year: number
  name: string
  createdAt: string
  updatedAt: string
}

export type PlayerStatTeam = {
  id: string
  name: string
  country: string
  logoUrl: string
  createdAt: string
  updatedAt: string
}

export type PlayerSeasonStat = {
  id: string
  playerId: string
  seasonId: string
  teamId: string
  matchesPlayed: number
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  minutesPlayed: number
  createdAt: string
  updatedAt: string
  season: PlayerSeason
  team: PlayerStatTeam
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

export type PlayerStatsResponse = PlayerSeasonStat[]

export type PlayerComparisonItem = {
  id: string
  name: string
  birthDate: string
  nationality: string
  position: ApiPlayerPosition
  photoUrl: string
  currentTeamId: string | null
  currentTeamName: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  currentTeam: PlayerStatTeam | null
  stats: PlayerSeasonStat[]
}

export type PlayerComparisonResponse = PlayerComparisonItem[]

export type PlayersQueryFilters = {
  search?: string
  position?: ApiPlayerPosition
  nationality?: string
  minAge?: number
  maxAge?: number
  page?: number
  limit?: number
}
